// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'JetBrains Mono, monospace',
  },
  palette: {
    primary: {
      main: '#555555', // Lighter dark gray color
    },
    secondary: {
      main: '#888888', // Lighter medium gray color
    },
    background: {
      default: '#000000', // Black background
    },
    text: {
      primary: '#ffffff', // White text color
      secondary: '#cccccc', // Light gray text color
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#333333',
          borderRadius: 8,
          color: '#ffffff',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          zIndex: 4, // Ensure container is not hidden by other elements
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          zIndex: 1, // Ensure box is not hidden by other elements
        },
      },
    },
  },
});

export default theme;