import {
  Box, Divider, Paper, Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import AuthLayout from '@/layout/AuthLayout';

const AuthModule = ({ authContent, AUTH_TITLE }) => (
  <AuthLayout>
    <Paper sx={{
      padding: '1.2em', borderRadius: '1em', backgroundColor: 'background.default', minWidth: { xs: '95%', sm: 400 },
    }}
    >
      <Typography variant="h4" color="primary.main">{AUTH_TITLE}</Typography>
      <Divider sx={{ mt: 0.5 }} />
      <Box mt={3}>{authContent}</Box>
    </Paper>
  </AuthLayout>
);

AuthModule.propTypes = {
  authContent: PropTypes.node.isRequired,
  AUTH_TITLE: PropTypes.string.isRequired,
};

export default AuthModule;
