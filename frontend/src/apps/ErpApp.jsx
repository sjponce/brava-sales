import { Box } from '@mui/material';
import AppRouter from '@/router/AppRouter';
import LayoutMaterial from '@/components/Layout/LayoutMaterial';

const ErpCrmApp = () => (
  <Box bgcolor="background.default">
    <LayoutMaterial outlet={AppRouter} />
  </Box>
);

export default ErpCrmApp;
