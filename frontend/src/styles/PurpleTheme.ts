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

export default themePurple;