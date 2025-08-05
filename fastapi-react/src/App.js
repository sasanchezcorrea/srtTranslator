// src/App.js
import React from 'react';
import UploadTranslate from './UploadTranslate';
import DownloadFile from './DownloadFile';
import { Container, Typography, Box } from '@mui/material';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Typography variant="h4" component="h1" gutterBottom>
          Srt Translate
        </Typography>
      </header>
      <main>
        <Container maxWidth="sm">
          <Box my={4}>
            <UploadTranslate />
            <DownloadFile />
          </Box>
        </Container>
      </main>
    </div>
  );
}

export default App;