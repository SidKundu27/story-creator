import { createTheme } from '@mui/material/styles';

// Centralized site colors
export const siteColors = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  secondary: '#f59e0b',
  background: '#FAF9F6',
  surface: '#ffffff',
  textPrimary: '#1f2937',
  textSecondary: '#6b7280'
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: siteColors.primary,
      dark: siteColors.primaryDark
    },
    secondary: {
      main: siteColors.secondary
    },
    background: {
      default: siteColors.background,
      paper: siteColors.surface
    },
    text: {
      primary: siteColors.textPrimary,
      secondary: siteColors.textSecondary
    }
  },
  typography: {
    fontFamily: `Segoe UI, Roboto, system-ui, -apple-system, 'Helvetica Neue', Arial`,
    button: {
      textTransform: 'none'
    }
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 2
      }
    }
  }
});

export default theme;
