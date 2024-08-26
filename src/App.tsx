import React from 'react';
import LinkTree from './components/LinkTree';
import { Box } from '@mui/material';

const App: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'text.primary', // Using the theme's text color
      }}
    >
      <LinkTree />
    </Box>
  );
}

export default App;
