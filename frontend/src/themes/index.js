import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#dc004d',
    },
    error: {
      main: '#f50057',
    },
  },
});

const globalStyles = {
  a: {
    color: blue[400],
  },
};

export { darkTheme, lightTheme, globalStyles };
