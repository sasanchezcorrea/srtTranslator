// src/UploadTranslate.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, LinearProgress, Box } from '@mui/material';
import DownloadFile from './DownloadFile';

const UploadTranslate = () => {
  const [file, setFile] = useState(null);
  const [srcLanguage, setSrcLanguage] = useState('');
  const [destLanguage, setDestLanguage] = useState('');
  const [translatedFilename, setTranslatedFilename] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timer;
    if (startTime) {
      timer = setInterval(() => {
        setElapsedTime(Math.round((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async (url, formData) => {
    try {
      const response = await axios.post(url, formData);
      return response.data;
    } catch (error) {
      console.error(`Error in ${url}:`, error.response ? error.response.data : error.message);
      throw new Error(error.response ? error.response.data.detail : error.message);
    }
  };

  const handleDetectLanguage = async () => {
    if (!file) {
      setStatus('Please select a file first.');
      return;
    }

    setStatus('Detecting language...');
    setProgress(25);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const data = await uploadFile('http://127.0.0.1:1992/detect-language/', formData);
      setDetectedLanguage(data.detected_language);
      setSrcLanguage(data.detected_language);
      setStatus('Language detected successfully.');
      setProgress(50);
    } catch (error) {
      setStatus(`Error detecting language: ${error.message}`);
      setProgress(0);
    }
  };

  const handleTranslate = async () => {
    if (!file) {
      setStatus('Please select a file first.');
      return;
    }

    if (!destLanguage) {
      setStatus('Please enter the destination language.');
      return;
    }

    setStatus('Translating file...');
    setProgress(75);
    setStartTime(Date.now());
    const formData = new FormData();
    formData.append('file', file);
    formData.append('src_language', srcLanguage || ''); // Ensure src_language is provided
    formData.append('dest_language', destLanguage);

    try {
      const data = await uploadFile('http://127.0.0.1:1992/translate/', formData);
      setTranslatedFilename(data.translated_filename);
      setDetectedLanguage(data.detected_language);
      setStatus('Translation complete.');
      setProgress(100);
      setStartTime(null);
    } catch (error) {
      setStatus(`Error translating file: ${error.message}`);
      setProgress(0);
      setStartTime(null);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Upload and Translate File
        </Typography>
        <input
          accept=".srt"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span" fullWidth>
            Choose File
          </Button>
        </label>
        <Box my={2} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={handleDetectLanguage} fullWidth>
            Detect Language
          </Button>
          <Box mx={1} />
          <Button variant="contained" color="secondary" onClick={handleTranslate} fullWidth>
            Translate
          </Button>
        </Box>
        <TextField
          label="Source Language"
          variant="outlined"
          fullWidth
          margin="normal"
          value={srcLanguage}
          onChange={(e) => setSrcLanguage(e.target.value)}
        />
        <TextField
          label="Destination Language"
          variant="outlined"
          fullWidth
          margin="normal"
          value={destLanguage}
          onChange={(e) => setDestLanguage(e.target.value)}
        />
        {status && (
          <Box my={2}>
            <Typography variant="body1">{status}</Typography>
          </Box>
        )}
        {progress > 0 && (
          <Box my={2} display="flex" alignItems="center">
            <LinearProgress variant="determinate" value={progress} style={{ flexGrow: 1 }} />
            <Box ml={2}>
              <Typography variant="body2" color="textSecondary">{`${Math.round(progress)}%`}</Typography>
            </Box>
          </Box>
        )}
        {startTime && (
          <Box my={2}>
            <Typography variant="body2" color="textSecondary">{`Elapsed time: ${elapsedTime} seconds`}</Typography>
          </Box>
        )}
        {translatedFilename && (
          <Box my={2}>
            <Typography variant="body1">Translated file: {translatedFilename}</Typography>
            <DownloadFile translatedFilename={translatedFilename} />
          </Box>
        )}
        {detectedLanguage && (
          <Box my={2}>
            <Typography variant="body1">Detected source language: {detectedLanguage}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default UploadTranslate;