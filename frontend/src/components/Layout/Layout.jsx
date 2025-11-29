import { Outlet } from 'react-router-dom';
import { Box, Stack, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import NavbarMaterial from './navbar/NavbarMaterial';
import Menu from './menu/Menu';
import MobileBottomNavigation from './mobile/MobileBottomNavigation';
import MobileOptionsMenu from './mobile/MobileOptionsMenu';

const LayoutMaterial = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(null);
  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  const handleMoreClick = (event) => {
    setMoreMenuAnchorEl(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuAnchorEl(null);
  };

  return (
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
          {!isMobile && (
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
          )}
          <Stack
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              paddingX: isMobile ? '10px' : '20px',
              paddingBottom: isMobile ? '90px' : '20px',
              backgroundColor: 'background.paper',
              borderRadius: 2.5,
              marginTop: 1,
              marginBottom: 2.5,
              marginRight: isMobile ? 0 : 1.5,
              boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
              overflow: 'auto',
              height: '96%',
            }}
          >
            <Outlet />
          </Stack>
        </Stack>
      </Stack>
      <MobileBottomNavigation onMoreClick={handleMoreClick} />
      <MobileOptionsMenu
        anchorEl={moreMenuAnchorEl}
        open={moreMenuOpen}
        onClose={handleMoreMenuClose}
      />
      <CssBaseline />
    </Box>
  );
};

export default LayoutMaterial;
