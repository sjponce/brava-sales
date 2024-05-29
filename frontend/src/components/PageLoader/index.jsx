import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const PageLoader = () => (
  <Box sx={{
    height: '100vh', backgroundColor: 'background.default', display: 'flex', justifyContent: 'center', alignItems: 'center',
  }}
  >
    <CircularProgress />
  </Box>
);
export default PageLoader;
