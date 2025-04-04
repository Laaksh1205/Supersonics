import React from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import FeedbackDemo from './components/feedback/FeedbackDemo';

// Create a Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // indigo
    },
    secondary: {
      main: '#f50057', // pink
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render application
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FeedbackDemo />
    </ThemeProvider>
  </React.StrictMode>
); 