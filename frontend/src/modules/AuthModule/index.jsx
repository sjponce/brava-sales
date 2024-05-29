import AuthLayout from '@/layout/AuthLayout';
import { Box, Divider, Paper, Typography } from '@mui/material';

const AuthModule = ({ authContent, AUTH_TITLE, isForRegistre = false }) => {
  return (
      <AuthLayout>
        <Paper sx={{  padding: "1.2em", borderRadius: "1em", backgroundColor: "background.default", minWidth: { xs: "95%", sm: 400 }}}>
          <Typography variant="h4" color="primary.main">{AUTH_TITLE}</Typography>
          <Divider sx={{ mt: 0.5 }}/>
          <Box mt={3}>{authContent}</Box>
        </Paper>
      </AuthLayout>
  );
};

export default AuthModule;
