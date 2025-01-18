import { createTheme } from '@mui/material/styles';

const themePurple = createTheme({
  palette: {
    primary: {
      main: '#7719AA', // Purple main color close to OneNote
    },
    secondary: {
      main: '#ff4081', // Light pink
    },
    background: {
      default: '#f5f5f5', // Default background color
    },
    text: {
      primary: '#212121', // Primary text color
      secondary: '#757575', // Secondary text color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const themeBlue = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Darker blue color from Angular Material
    },
    secondary: {
      main: '#ff4081', // Light pink
    },
    background: {
      default: '#f5f5f5', // Default background color
    },
    text: {
      primary: '#212121', // Primary text color
      secondary: '#757575', // Secondary text color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const themePink = createTheme({
  palette: {
    primary: {
      main: '#e91e63', // Pink main color from Angular Material
    },
    secondary: {
      main: '#ff4081', // Light pink
    },
    background: {
      default: '#f5f5f5', // Default background color
    },
    text: {
      primary: '#212121', // Primary text color
      secondary: '#757575', // Secondary text color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const themes = {
  purple: themePurple,
  blue: themeBlue,
  pink: themePink,
};

export default themes;