import { Outlet } from 'react-router-dom';
import { Box, Stack, CssBaseline } from '@mui/material';
import { NavbarMaterial } from '@/navbar';
import { Menu } from '@/menu/Menu';

const LayoutMaterial = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    <NavbarMaterial />
    <Stack display="flex" flexDirection="column" justifyContent="space-between" flexGrow="1">
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Box sx={{
          width: { lg: '250px' },
          scrollbarwidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '0.4em',
            height: '0.2em',
          },
          '&::-webkit-scrollbar-track': {
            background: 'background.paper',
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '5px',

          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#5858587a',
          },
        }}
        >

          <Box sx={{ marginLeft: { lg: '20px', sm: '10px' }, marginRight: { lg: '15px', sm: '10px' } }}>
            <Menu />
          </Box>
        </Box>
        <Stack
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            backgroundColor: 'background.paper',
            borderRadius: 2.5,
            marginTop: 1.5,
            marginBottom: 1.5,
            marginRight: 1.5,
            boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
          }}
        >
          <Outlet />
        </Stack>
      </Stack>
    </Stack>
    <CssBaseline />
  </Box>
);

export default LayoutMaterial;
