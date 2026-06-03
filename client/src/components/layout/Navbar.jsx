import React, { useContext, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setMobileOpen((open) => !open);

  const handleNavigate = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    handleMenuClose();
    setMobileOpen(false);
    logout();
    navigate('/');
  };

  const navLinks = [
    // { label: 'Browse', path: '/feed' },
    { label: 'Browse V2', path: '/browse-v2' },
    { label: 'About', path: '/about' },
    ...(user ? [{ label: 'My Stories', path: '/my-stories' }] : []),
    ...(user ? [{ label: 'Profile', path: '/profile' }] : [{ label: 'Login', path: '/login' }])
  ];

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        background: 'rgba(255, 255, 255, 0.92)',
        borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 8px 32px rgba(15, 23, 42, 0.06)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ color: '#0f172a', textDecoration: 'none', mr: 3, fontWeight: 800, letterSpacing: '-0.02em' }}
        >
          <span style={{ marginRight: 8 }}>📖</span> Story Creator
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={handleDrawerToggle} aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}>
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
              <Box sx={{ width: 280, p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Navigation</Typography>
                <List>
                  {navLinks.map((link) => (
                    <ListItemButton key={link.path} onClick={() => handleNavigate(link.path)}>
                      <ListItemText primary={link.label} />
                    </ListItemButton>
                  ))}
                  {user && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <ListItemButton onClick={handleLogout}>
                        <ListItemText primary="Logout" />
                      </ListItemButton>
                    </>
                  )}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <>
            {/* Desktop navigation buttons */}
            {/* if within localhost, then show v1 */}
            {window.location.hostname === 'localhost' && (
              <Button
                component={RouterLink}
                to="/browse-v1-archived"
                sx={{
                  color: '#475569',
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 600,
                borderRadius: '6px',
                padding: '8px 14px',
                transition: 'all 0.2s ease',
                '&:hover': { color: '#0f172a', backgroundColor: 'rgba(99, 102, 241, 0.12)' },
              }}
            >
              Archived Browse
            </Button>
            )}

            <Button
              component={RouterLink}
              to="/feed"
              sx={{
                color: '#475569',
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 600,
                borderRadius: '6px',
                padding: '8px 14px',
                transition: 'all 0.2s ease',
                ml: 1,
                '&:hover': { color: '#0f172a', backgroundColor: 'rgba(99, 102, 241, 0.12)' },
              }}
            >
              Browse
            </Button>

            <Button
              component={RouterLink}
              to="/about"
              sx={{
                color: '#475569',
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 600,
                borderRadius: '6px',
                padding: '8px 14px',
                transition: 'all 0.2s ease',
                ml: 1,
                '&:hover': { color: '#0f172a', backgroundColor: 'rgba(99, 102, 241, 0.12)' },
              }}
            >
              About
            </Button>

            {user ? (
              <>
                <Button
                  component={RouterLink}
                  to="/my-stories"
                  sx={{
                    color: '#475569',
                    textTransform: 'none',
                    fontSize: '15px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    padding: '8px 14px',
                    transition: 'all 0.2s ease',
                    ml: 1,
                    '&:hover': { color: '#0f172a', backgroundColor: 'rgba(99, 102, 241, 0.12)' },
                  }}
                >
                  My Stories
                </Button>
                <Button
                  component={RouterLink}
                  to="/create"
                  sx={{
                    background: '#6366f1',
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    borderRadius: '8px',
                    padding: '7px 14px',
                    ml: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': { boxShadow: '0 8px 24px rgba(99, 102, 241, 0.28)', background: '#4f46e5', transform: 'translateY(-1px)' },
                  }}
                >
                  Create
                </Button>
                <Tooltip title="Open profile menu">
                  <IconButton
                    color="inherit"
                    onClick={handleMenuOpen}
                    sx={{ ml: 1 }}
                    aria-controls="profile-menu"
                    aria-haspopup="true"
                    aria-label="Open profile menu"
                  >
                    <Avatar alt={user.username}>
                      {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  id="profile-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                sx={{
                  color: '#475569',
                  textTransform: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  padding: '8px 14px',
                  transition: 'all 0.2s ease',
                  '&:hover': { color: '#0f172a', backgroundColor: 'rgba(99, 102, 241, 0.12)' },
                }}
              >
                Login
              </Button>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
