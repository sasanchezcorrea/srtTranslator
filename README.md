### Installation
#### Install poetry

```bash 
poetry install
```
#### Install npm
```bash
npm install @mui/material @emotion/react @emotion/styled --legacy-peer-deps
```
#### setup react project
```bash
npx create-react-app fastapi-react
cd fastapi-react
npm start
```

### Run
```bash
poetry run python translate.py
```

### Run npm
remember to be in fastapi-react folder
```bash
npm start
```

### Run with gunicorn
```bash
poetry run gunicorn translate:app -b
```
### Run with docker
```bash
docker build -t translate .
docker run -p 1992:1992 translate
```



## curl commands

### detect language
```bash     
curl -X POST "http://127.0.0.1:1992/detect-language/" \                 
-F "file=@1.srt"  
```
### to translate

curl -X POST "http://127.0.0.1:1992/translate/" \                       
-F "src_language=en" \
-F "dest_language=es" \
-F "file=@1.srt"


### to download
curl -X GET "http://127.0.0.1:1992/download/translated_file2.srt" --output descarga.srt

curl -O "http://127.0.0.1:1992/download/translated_20241206215416_1.srt"