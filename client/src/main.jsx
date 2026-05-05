import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './theme.css';
import './index.css';
import App from './App';
import theme from './theme';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (apiBaseUrl) {
  axios.defaults.baseURL = apiBaseUrl;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);