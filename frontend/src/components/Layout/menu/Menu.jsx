import { Link, useLocation } from 'react-router-dom';
import './menu.scss';
import { useSelector } from 'react-redux';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { menuMaterialUser, menuMaterial, menuMaterialSellers } from '../../../utils/menuData';

const Menu = () => {
  const theme = useTheme();
  const location = useLocation();

  const switchMenu = () => {
    const userState = useSelector((store) => store.auth.current);
    if (userState.role === 'admin') {
      return menuMaterial;
    }
    if (userState.role === 'seller') {
      return menuMaterialSellers;
    }
    return menuMaterialUser;
  };
  const isActive = (url) => {
    if (url === '/') {
      return location.pathname === '/';
    }

    const currentPath = location.pathname.replace('/', '');
    const targetPath = url.replace('/', '');

    if (currentPath === targetPath) {
      return true;
    }

    if (currentPath.startsWith(`${targetPath}/`)) {
      return true;
    }

    return false;
  };

  return (
    <Box
      className="menu"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          px: 1.5,
          py: 1,
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(theme.palette.primary.main, 0.3),
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: alpha(theme.palette.primary.main, 0.5),
          },
        }}
      >
        {switchMenu().map((item, index) => (
          <Box key={item.id} sx={{ mb: 1.5 }}>
            <Box sx={{ mb: 1, px: 1 }}>
              <Chip
                label={item.title}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 22,
                  fontWeight: 600,
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                  color: theme.palette.primary.main,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  '& .MuiChip-label': {
                    px: 1,
                  },
                  '@media (max-width: 1200px)': {
                    display: 'none',
                  },
                }}
              />
            </Box>

            <List sx={{ py: 0 }}>
              {item.listItems.map((listItem) => (
                <ListItem
                  key={listItem.title}
                  disablePadding
                  sx={{ mb: 0.3 }}
                >
                  <ListItemButton
                    component={Link}
                    to={listItem.url}
                    selected={isActive(listItem.url)}
                    sx={{
                      borderRadius: 2,
                      minHeight: 40,
                      px: 1.5,
                      py: 0.8,
                      transition: 'all 0.15s ease-in-out',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        transform: 'translateX(2px)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                        borderLeft: `2px solid ${theme.palette.primary.main}`,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.16),
                        },
                      },
                      '@media (max-width: 1200px)': {
                        justifyContent: 'center',
                        minWidth: 40,
                        px: 1,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 32,
                        color: isActive(listItem.url)
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                        transition: 'color 0.15s ease-in-out',
                        '& .MuiSvgIcon-root': {
                          fontSize: 20,
                        },
                        '@media (max-width: 1200px)': {
                          minWidth: 'auto',
                          justifyContent: 'center',
                        },
                      }}
                    >
                      {listItem.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={listItem.title}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontSize: '0.85rem',
                        fontWeight: isActive(listItem.url) ? 600 : 500,
                        color: isActive(listItem.url)
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                        sx: {
                          '@media (max-width: 1200px)': {
                            display: 'none',
                          },
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            {index < switchMenu().length - 1 && (
              <Divider
                sx={{
                  mt: 1,
                  mb: 0.5,
                  opacity: 0.2,
                  '@media (max-width: 1200px)': {
                    display: 'none',
                  },
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Menu;
