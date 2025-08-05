from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from deep_translator import GoogleTranslator
from langdetect import detect, LangDetectException
from datetime import datetime
import os
import re

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to the specific origins you want to allow
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def translate_text(text, src_language, dest_language):
    # Use deep_translator to translate the text
    translation = GoogleTranslator(source=src_language, target=dest_language).translate(
        text
    )
    return translation


def translate_srt(input_file, output_file, src_language, dest_language):
    with open(input_file, "r", encoding="utf-8") as file:
        file_text = file.read()

    subtitle_pattern = re.compile(
        r"(\d+\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}\n)(.*?)(?=\n\n|\Z)",
        re.DOTALL,
    )
    translated_file_text = ""
    detected_language = src_language

    for match in subtitle_pattern.finditer(file_text):
        subtitle_header = match.group(1)
        subtitle_text = match.group(2).strip()

        if not src_language:
            try:
                detected_language = detect(subtitle_text)
            except LangDetectException:
                detected_language = "en"  # Default to English if detection fails

        translated_text = translate_text(
            subtitle_text, detected_language, dest_language
        )
        translated_file_text += f"{subtitle_header}{translated_text}\n\n"

    with open(output_file, "w", encoding="utf-8") as file:
        file.write(translated_file_text)

    print(f"Translation complete. Translated file saved to: {output_file}")
    return detected_language


@app.post("/translate/")
async def translate_srt_file(
    dest_language: str = Form(...),
    src_language: str = Form(None),
    file: UploadFile = File(...),
):
    try:
        # Create unique file paths
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        input_file_path = f"/tmp/{timestamp}_{file.filename}"
        output_file_path = f"/tmp/translated_{timestamp}_{file.filename}"

        # Save uploaded file
        with open(input_file_path, "wb") as input_file:
            input_file.write(await file.read())
        print(f"Uploaded file saved at: {input_file_path}")

        # Perform translation
        detected_language = translate_srt(
            input_file_path, output_file_path, src_language, dest_language
        )

        return {
            "translated_filename": os.path.basename(output_file_path),
            "detected_language": detected_language,
        }
    except Exception as e:
        print(f"Error in /translate/: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/detect-language/")
async def detect_language(file: UploadFile = File(...)):
    try:
        # Save the uploaded file to a temporary location
        file_path = f"/tmp/{file.filename}"
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Read the file content
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Detect the language
        try:
            detected_language = detect(content)
        except LangDetectException as e:
            return {"error": str(e)}

        # Clean up the temporary file
        os.remove(file_path)

        return {"detected_language": detected_language}
    except Exception as e:
        print(f"Error in /detect-language/: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = f"/tmp/{filename}"
    if os.path.exists(file_path):
        print(f"File found, preparing download: {file_path}")
        return FileResponse(path=file_path, filename=filename)
    print(f"File not found: {file_path}")
    return {"error": f"File '{filename}' not found on the server."}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=1992)
