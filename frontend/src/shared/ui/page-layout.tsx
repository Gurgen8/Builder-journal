import React from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider, Container, useMediaQuery, useTheme, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';

const DRAWER_WIDTH = 280;

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isVerySmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Журнал работ', icon: <AssignmentRoundedIcon />, path: '/' },
    { text: 'Справочник видов работ', icon: <LibraryBooksRoundedIcon />, path: '/work-types' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      {/* Brand header */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box 
          sx={{ 
            p: 1, 
            borderRadius: 2, 
            bgcolor: 'primary.main', 
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px 0 rgba(0, 102, 102, 0.2)'
          }}
        >
          <ConstructionRoundedIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'text.primary', lineHeight: 1.2 }}>
            СТРОЙЖУРНАЛ
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Система учета работ
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ opacity: 0.6 }} />

      {/* Navigation menu */}
      <List sx={{ px: 2, py: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 3,
                py: 1.5,
                px: 2,
                transition: 'all 0.2s ease',
                bgcolor: isActive ? 'primary.light' : 'transparent',
                color: isActive ? 'primary.main' : 'text.secondary',
                '&:hover': {
                  bgcolor: isActive ? 'primary.light' : 'action.hover',
                  color: isActive ? 'primary.main' : 'text.primary',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.925rem',
                  fontFamily: 'Inter, sans-serif'
                }} 
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ opacity: 0.6 }} />

      {/* Corporate footer info */}
      <Box sx={{ p: 3, bgcolor: 'action.hover', borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" display="block" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          ОБЪЕКТ: ЖК "Северные Высоты"
        </Typography>
        <Typography variant="caption" display="block" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Подрядчик: ООО "СпецСтройКом"
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Desktop App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 4 }, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 0.5, color: 'text.primary' }}
              >
                <MenuRoundedIcon />
              </IconButton>
            )}
            <Typography 
              variant="h6" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                color: 'text.primary', 
                fontFamily: 'Outfit, sans-serif',
                fontSize: { xs: '1rem', sm: '1.25rem' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {isVerySmall 
                ? (location.pathname === '/' ? 'Журнал работ' : 'Справочник')
                : (location.pathname === '/' ? 'Журнал выполненных работ' : 'Справочник видов работ')
              }
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Box 
              sx={{ 
                px: 2, 
                py: 0.75, 
                borderRadius: 2, 
                bgcolor: 'success.light', 
                color: 'success.dark',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              Смена: Дневная
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Responsive drawer */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }} // Better open performance on mobile
            sx={{
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, border: 'none' },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: DRAWER_WIDTH, 
                borderRight: '1px solid',
                borderColor: 'divider'
              },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      {/* Main content body */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          pt: '72px', // AppBar spacing offset
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <Container 
          maxWidth="lg" 
          sx={{ 
            py: { xs: 3, sm: 4 }, 
            px: { xs: 2, sm: 4 }, 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minWidth: 0,
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};
