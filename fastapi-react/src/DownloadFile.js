// src/DownloadFile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Typography, Box } from '@mui/material';

const DownloadFile = ({ translatedFilename }) => {
  const [downloadLink, setDownloadLink] = useState('');

  useEffect(() => {
    if (translatedFilename) {
      handleDownload();
    }
  }, [translatedFilename]);

  const handleDownload = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:1992/download/${translatedFilename}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadLink(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>

        </Typography>
        {downloadLink && (
          <Box my={2}>
            <Button
              variant="contained"
              color="primary"
              href={downloadLink}
              download={translatedFilename}
              fullWidth
            >
              Click here to download
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default DownloadFile;