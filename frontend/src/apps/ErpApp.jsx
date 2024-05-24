// import { Layout } from 'antd';

import AppRouter from '@/router/AppRouter';
import { Box, Container } from '@mui/material';

export default function ErpCrmApp() {
    return (
      <Box bgcolor="background.default">
        <AppRouter />
      </Box>
    );
}
