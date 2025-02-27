import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

export const kStyleGlobal = extendTheme({
  config,
  colors: {
    primary: {
      50: '#E6F6FF',
      100: '#BAE3FF',
      200: '#7CC4FA',
      300: '#47A3F3',
      400: '#2186EB',
      500: '#0967D2',
      600: '#0552B5',
      700: '#03449E',
      800: '#01337D',
      900: '#002159',
    },
    gray: {
      50: '#F7FAFC',
      100: '#EDF2F7',
      200: '#E2E8F0',
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096',
      600: '#4A5568',
      700: '#2D3748',
      800: '#1A202C',
      900: '#171923',
    },
    blue: {
      500: '#3182CE',
    },
    green: {
      500: '#38A169',
    },
    red: {
      500: '#E53E3E',
    },
  },
  fonts: {
    body: 'system-ui, sans-serif',
    heading: 'system-ui, sans-serif',
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        ghost: {
          _hover: {
            bg: 'gray.100',
          },
        },
        outline: {
          border: '1px solid',
          borderColor: 'gray.200',
        },
        link: {
          textDecoration: 'none',
          _hover: {
            textDecoration: 'none',
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'md',
        },
      },
      variants: {
        filled: {
          field: {
            bg: 'gray.50',
            _hover: {
              bg: 'gray.100',
            },
            _focus: {
              bg: 'gray.100',
            },
          },
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    Progress: {
      baseStyle: {
        track: {
          bg: 'gray.100',
        },
        filledTrack: {
          transition: 'all 0.3s',
        },
      },
    },
    Checkbox: {
      baseStyle: {
        control: {
          borderRadius: 'sm',
          _checked: {
            bg: 'gray.900',
            borderColor: 'gray.900',
          },
        },
      },
    },
  },
});
