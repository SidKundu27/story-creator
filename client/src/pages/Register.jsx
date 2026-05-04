import React, { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Alert from '@mui/material/Alert';

const steps = ['Account', 'Profile'];

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = (e) => {
    e && e.preventDefault();
    setError('');

    if (activeStep === 0) {
      if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
      if (formData.password.length < 6) return setError('Password must be at least 6 characters');
      return setActiveStep(1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.username.length < 3) return setError('Username must be at least 3 characters');

    const result = await register({ username: formData.username, email: formData.email, password: formData.password });

    if (result.success) navigate('/feed');
    else setError(result.message);
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h5" align="center">Create Account</Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {activeStep === 0 ? (
          <Box component="form" onSubmit={handleNext}>
            <TextField fullWidth margin="normal" required label="Email" name="email" value={formData.email} onChange={handleChange} />
            <TextField fullWidth margin="normal" required label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
            <TextField fullWidth margin="normal" required label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />

            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Next Step →</Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth margin="normal" required label="Username" name="username" value={formData.username} onChange={handleChange} helperText="This will be displayed on your stories" />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="outlined" onClick={() => setActiveStep(0)}>← Back</Button>
              <Button type="submit" variant="contained">Create Account</Button>
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">Already have an account?&nbsp;<RouterLink to="/login">Login here</RouterLink></Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
