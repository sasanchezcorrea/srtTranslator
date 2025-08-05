from deep_translator import GoogleTranslator
import re


def translate_text(text, src_language, dest_language):
    translator = GoogleTranslator(source=src_language, target=dest_language)
    translation = translator.translate(text)
    return translation


def translate_srt(input_file, output_file, src_language, dest_language):
    with open(input_file, "r") as file:
        file_text = file.read()

    # Regular expression to match the subtitle text
    subtitle_pattern = re.compile(
        r"(\d+\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}\n)(.*?)(?=\n\n|\Z)",
        re.DOTALL,
    )
    translated_file_text = ""

    for match in subtitle_pattern.finditer(file_text):
        subtitle_header = match.group(1)
        subtitle_text = match.group(2).strip()
        translated_text = translate_text(subtitle_text, src_language, dest_language)
        translated_file_text += f"{subtitle_header}{translated_text}\n\n"

    with open(output_file, "w") as file:
        file.write(translated_file_text)

    print(f"File translation completed. Check '{output_file}' for the result.")


if __name__ == "__main__":
    input_file = "file.srt"
    output_file = "translated_fileto.srt"
    src_language = "en"
    dest_language = "el"

    translate_srt(input_file, output_file, src_language, dest_language)
