import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { siteColors } from '../theme';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

const ColorSwatch = ({ name, color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
    <Box sx={{ width: 48, height: 32, bgcolor: color, borderRadius: 1, border: '1px solid rgba(0,0,0,0.08)' }} />
    <Typography variant="body2">{name}: {color}</Typography>
  </Box>
);

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: user?.username || '', email: user?.email || '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const startEdit = () => {
    setForm({ username: user?.username || '', email: user?.email || '' });
    setError('');
    setSuccess('');
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await updateProfile({ username: form.username, email: form.email });
      if (!res.success) {
        setError(res.message || 'Update failed');
      } else {
        setSuccess('Profile updated');
        setEditing(false);
      }
    } catch (err) {
      setError('Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }} elevation={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 64, height: 64 }}>{user?.username ? user.username.charAt(0).toUpperCase() : 'U'}</Avatar>
          <Box>
            {!editing ? (
              <>
                <Typography variant="h6">{user?.username || 'Guest User'}</Typography>
                <Typography variant="body2" color="text.secondary">{user?.email || 'Not signed in'}</Typography>
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField size="small" label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                <TextField size="small" label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Box>
            )}
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {user?.email === 'test@gmail.com' && <Chip label="Admin" color="secondary" />}
          {!editing ? (
            <Button onClick={startEdit} variant="outlined">Edit</Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={cancelEdit} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} variant="contained" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

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
