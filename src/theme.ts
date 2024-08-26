import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    text: {
      primary: '#f5f5f5', // Almost white text
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent', // Transparent background
          border: '2px solid #f5f5f5', // Almost white border
          borderRadius: '8px', // Suitable border radius
          color: '#f5f5f5', // Almost white text color
          padding: '12px 24px',
          textTransform: 'none', // Disable uppercase text
          '&:hover': {
            backgroundColor: 'rgba(245, 245, 245, 0.1)', // Slight hover effect
          },
        },
      },
    },
  },
});

export default theme;
