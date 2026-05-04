import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';

const Home = () => {
  return (
    <div>
      <Box sx={{ bgcolor: 'background.paper', py: 8, pt: 12 }}>
        <Container maxWidth="md">
          <Typography component="h1" variant="h3" align="center" gutterBottom>
            Create Your Own Adventure
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            Build interactive stories where every choice matters. Share your creations with the world.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button variant="contained" size="large" component={RouterLink} to="/feed">Browse Stories</Button>
            <Button variant="outlined" size="large" component={RouterLink} to="/create">Start Creating</Button>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 6 }} maxWidth="lg">
        <Grid container spacing={4}>
          {[
            {icon: '✍️', title: 'Create Stories', desc: 'Build branching narratives with multiple paths and endings'},
            {icon: '🎮', title: 'Interactive Gameplay', desc: 'Let players make choices that determine the outcome'},
            {icon: '🌐', title: 'Share & Play', desc: 'Publish your stories and explore creations from the community'},
            {icon: '📱', title: 'Export (Coming Soon)', desc: 'Turn your stories into standalone apps or websites'}
          ].map((f) => (
            <Grid item key={f.title} xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h4">{f.icon}</Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>{f.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{f.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default Home;
