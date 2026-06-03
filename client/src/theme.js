import { createTheme } from '@mui/material/styles';

// Centralized site colors
export const siteColors = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  secondary: '#f59e0b',
  success: '#16a34a',
  warning: '#d97706',
  error: '#dc2626',
  info: '#0284c7',
  background: '#FAF9F6',
  surface: '#ffffff',
  surfaceAlt: '#f8fafc',
  divider: '#e5e7eb',
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
    success: {
      main: siteColors.success
    },
    warning: {
      main: siteColors.warning
    },
    error: {
      main: siteColors.error
    },
    info: {
      main: siteColors.info
    },
    background: {
      default: siteColors.background,
      paper: siteColors.surface
    },
    divider: siteColors.divider,
    text: {
      primary: siteColors.textPrimary,
      secondary: siteColors.textSecondary
    }
  },
  typography: {
    fontFamily: `"Segoe UI Variable", "Segoe UI", Roboto, system-ui, -apple-system, "Helvetica Neue", Arial`,
    h1: { fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 750, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      textTransform: 'none'
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 2
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
          paddingInline: 16
        },
        sizeSmall: {
          minHeight: 32,
          paddingInline: 12
        },
        sizeMedium: {
          minHeight: 40
        },
        containedPrimary: {
          '&:hover': {
            boxShadow: '0 10px 24px rgba(99, 102, 241, 0.24)'
          }
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
        size: 'small'
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: siteColors.surface,
          borderRadius: 12
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 999
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    }
  }
});

export default theme;
