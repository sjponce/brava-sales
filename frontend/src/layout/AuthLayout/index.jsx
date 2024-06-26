import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

const AuthLayout = ({ children }) => (
  <Box bgcolor="background.paper" display="flex" height="100vh" flexDirection="column">
    <Box display="flex" justifyContent="center" flexDirection="row" gap={1} alignItems="center" padding={2} position="absolute" left={0} right={0}>
      <img style={{ width: '64px', marginTop: 8, opacity: 0.4 }} src="/bravaLogo.png" alt="logo" />
      <Typography variant="overline" sx={{ color: 'gray' }}>
        Brava Sales
      </Typography>
    </Box>
    <Box display="flex" height="100%" alignItems="center" justifyContent="center">
      {children}
    </Box>
  </Box>
);

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
