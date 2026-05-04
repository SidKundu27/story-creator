import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { siteColors } from '../theme';

const ColorSwatch = ({ name, color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
    <Box sx={{ width: 48, height: 32, bgcolor: color, borderRadius: 1, border: '1px solid rgba(0,0,0,0.08)' }} />
    <Typography variant="body2">{name}: {color}</Typography>
  </Box>
);

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }} elevation={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 64, height: 64 }}>{user?.username ? user.username.charAt(0).toUpperCase() : 'U'}</Avatar>
          <Box>
            <Typography variant="h6">{user?.username || 'Guest User'}</Typography>
            <Typography variant="body2" color="text.secondary">{user?.email || 'Not signed in'}</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {user?.email === 'test@gmail.com' && <Chip label="Admin" color="secondary" />}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" gutterBottom>Site colors</Typography>
        <Box>
          <ColorSwatch name="Primary" color={siteColors.primary} />
          <ColorSwatch name="Primary Dark" color={siteColors.primaryDark} />
          <ColorSwatch name="Secondary" color={siteColors.secondary} />
          <ColorSwatch name="Background" color={siteColors.background} />
          <ColorSwatch name="Surface" color={siteColors.surface} />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary">This is a simple profile placeholder — edit your profile on the server or by using the admin account to set additional fields.</Typography>
      </Paper>
    </Container>
  );
};

export default Profile;
