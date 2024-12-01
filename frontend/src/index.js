import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Import ThemeProvider and createTheme
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter for routing

// Create a default Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Default Material-UI primary color
    },
    secondary: {
      main: '#dc004e', // Default Material-UI secondary color
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif', // Default font family
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap the app with BrowserRouter */}
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
