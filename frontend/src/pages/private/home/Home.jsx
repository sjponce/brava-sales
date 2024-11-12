import './home.scss';
import { Box, Hidden, Typography } from '@mui/material';

export const Home = () => (
  <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
    <Hidden smUp>
      <Typography variant="h4" color="primary">Bienvenido</Typography>
    </Hidden>
    <Hidden only={['xs']}>
      <Typography variant="h2" color="primary">Bienvenido</Typography>
    </Hidden>
    <Box display="flex" justifyContent="center" alignItems="center" mt={18}>
      <Hidden smUp>
        <img style={{ height: '100px' }} src="/home1.png" alt="home" />
      </Hidden>
      <Hidden only={['xs']}>
        <img style={{ height: '150px' }} src="/home1.png" alt="home" />
      </Hidden>
      {' '}
    </Box>
  </Box>
);

export default Home;
