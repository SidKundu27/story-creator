import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

const Home = () => {
  const featureCards = [
    { icon: '✍️', title: 'Create Stories', desc: 'Build branching narratives with multiple paths and endings' },
    { icon: '🎮', title: 'Interactive Gameplay', desc: 'Let players make choices that determine the outcome' },
    { icon: '🌐', title: 'Share & Play', desc: 'Publish your stories and explore creations from the community' },
    { icon: '📱', title: 'Export (Coming Soon)', desc: 'Turn your stories into standalone apps or websites' }
  ];

  return (
    <Box sx={{
      position: 'relative',
      overflow: 'hidden',
      minHeight: 'calc(100vh - 72px)',
      // background: `
      //   radial-gradient(circle at top left, rgba(99, 102, 241, 0.16), transparent 30%),
      //   radial-gradient(circle at top right, rgba(245, 158, 11, 0.15), transparent 26%),
      //   linear-gradient(180deg, #fffdf8 0%, #f7f5ef 42%, #f3efe7 100%)
      // `
    }}>
      <Box sx={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)',
        backgroundSize: '42px 42px',
        maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.4), transparent 85%)',
        pointerEvents: 'none'
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', py: { xs: 7, md: 12 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <Chip label="Interactive fiction, rebuilt" sx={{ alignSelf: 'flex-start', bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'primary.dark', fontWeight: 700 }} />
              <Box>
                <Typography component="h1" variant="h2" sx={{ fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', maxWidth: 720 }}>
                  Create worlds where every choice changes the ending.
                </Typography>
                <Typography variant="h6" sx={{ mt: 2, maxWidth: 620, color: 'text.secondary', fontWeight: 500, lineHeight: 1.6 }}>
                  Build and publish branching stories with a cleaner editor, stronger previews, and a player that feels intentional from the first click.
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" size="large" style={{ borderRadius: 12 }} component={RouterLink} to="/feed">Browse Stories</Button>
                <Button variant="outlined" size="large" style={{ borderRadius: 12 }} component={RouterLink} to="/about">About</Button>
                <Button variant="outlined" size="large" style={{ borderRadius: 12 }} component={RouterLink} to="/create">Start Creating</Button>
              </Stack>

              <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />} sx={{ color: 'text.secondary', flexWrap: 'wrap' }}>
                <Typography variant="body2"><strong style={{ color: 'inherit' }}>Branching scenes</strong> with a simple flow</Typography>
                <Typography variant="body2"><strong style={{ color: 'inherit' }}>Community feed</strong> for discovery</Typography>
                <Typography variant="body2"><strong style={{ color: 'inherit' }}>Profile edits</strong> and account polish</Typography>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid rgba(15, 23, 42, 0.08)', bgcolor: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(14px)', boxShadow: '0 24px 70px rgba(15, 23, 42, 0.02)' }}>
              <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 2 }}>Story preview</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>The Clockwork Door</Typography>
              <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary', lineHeight: 1.7 }}>
                You wake up in a half-lit library, a brass key in your pocket and a door that only opens when the lights go out.
              </Typography>

              <Stack spacing={1.5} sx={{ mt: 3 }}>
                {['Open the door', 'Search the shelves', 'Wait and listen'].map((choice, index) => (
                  <Box key={choice} sx={{ p: 1.5, borderRadius: 2, border: '1px solid rgba(99, 102, 241, 0.14)', bgcolor: index === 0 ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255,255,255,0.9)' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{choice}</Typography>
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={2}>
                {[
                  { value: '4', label: 'active writers' },
                  { value: '12', label: 'published stories' },
                  { value: '∞', label: 'possible endings' }
                ].map((item) => (
                  <Grid item xs={4} key={item.label}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 900 }}>{item.value}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: { xs: 7, md: 10 } }}>
          <Grid container spacing={4}>
            {featureCards.map((feature) => (
              <Grid item key={feature.title} xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ height: '100%', borderRadius: 2, borderColor: 'rgba(15, 23, 42, 0.08)', bgcolor: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(10px)', boxShadow: '0 14px 42px rgba(15, 23, 42, 0.08)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h4">{feature.icon}</Typography>
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: 800 }}>{feature.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25, lineHeight: 1.7 }}>{feature.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
