"use client";

import { createTheme, ThemeOptions, alpha } from "@mui/material/styles";
import { PaletteMode, Box } from "@mui/material";
import Image from "next/image";
import ArrowDownIcon from "@/components/icons/ArrowDownIcon";
import DangerIcon from "@/components/icons/DangerIcon";

declare module "@mui/material/styles/createPalette" {
  interface ColorRange {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  }

  interface PaletteColor extends ColorRange {}
}

const customTheme = createTheme();

export const brand = {
  50: "hsl(17, 100%, 97%)",
  100: "hsl(17, 100%, 90%)",
  200: "hsl(17, 100%, 68%)",
  300: "hsl(17, 100%, 65%)",
  400: "hsl(17, 98%, 48%)",
  500: "hsl(17, 98%, 42%)",
  600: "hsl(17, 98%, 55%)",
  700: "hsl(17, 100%, 35%)",
  800: "hsl(17, 100%, 16%)",
  900: "hsl(17, 100%, 21%)",
};

export const gray = {
  50: "hsl(220, 60%, 99%)",
  100: "hsl(220, 35%, 94%)",
  200: "hsl(220, 35%, 88%)",
  300: "hsl(220, 25%, 80%)",
  400: "hsl(220, 20%, 65%)",
  500: "hsl(220, 20%, 42%)",
  600: "hsl(220, 25%, 35%)",
  700: "hsl(220, 25%, 25%)",
  800: "hsl(220, 25%, 10%)",
  900: "hsl(220, 30%, 5%)",
};

export const green = {
  50: "hsl(120, 80%, 98%)",
  100: "hsl(120, 75%, 94%)",
  200: "hsl(120, 75%, 87%)",
  300: "hsl(120, 61%, 77%)",
  400: "hsl(120, 44%, 53%)",
  500: "hsl(120, 59%, 30%)",
  600: "hsl(120, 70%, 25%)",
  700: "hsl(120, 75%, 16%)",
  800: "hsl(120, 84%, 10%)",
  900: "hsl(120, 87%, 6%)",
};

export const orange = {
  50: "hsl(45, 100%, 97%)",
  100: "hsl(45, 92%, 90%)",
  200: "hsl(45, 94%, 80%)",
  300: "hsl(45, 90%, 65%)",
  400: "hsl(45, 90%, 40%)",
  500: "hsl(45, 90%, 35%)",
  600: "hsl(45, 91%, 25%)",
  700: "hsl(45, 94%, 20%)",
  800: "hsl(45, 95%, 16%)",
  900: "hsl(45, 93%, 12%)",
};

export const red = {
  50: "hsl(0, 100%, 97%)",
  100: "hsl(0, 92%, 90%)",
  200: "hsl(0, 94%, 80%)",
  300: "hsl(0, 90%, 65%)",
  400: "hsl(0, 90%, 40%)",
  500: "hsl(0, 90%, 30%)",
  600: "hsl(0, 91%, 25%)",
  700: "hsl(0, 94%, 20%)",
  800: "hsl(0, 95%, 16%)",
  900: "hsl(0, 93%, 12%)",
};

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      light: brand[200],
      main: brand[500],
      dark: brand[800],
      contrastText: brand[50],
      ...(mode === "dark" && {
        contrastText: brand[50],
        light: brand[300],
        main: brand[400],
        dark: brand[800],
      }),
    },
    info: {
      light: brand[100],
      main: brand[300],
      dark: brand[600],
      contrastText: gray[50],
      ...(mode === "dark" && {
        contrastText: brand[300],
        light: brand[500],
        main: brand[700],
        dark: brand[900],
      }),
    },
    warning: {
      light: orange[300],
      main: orange[400],
      dark: orange[800],
      ...(mode === "dark" && {
        light: orange[400],
        main: orange[500],
        dark: orange[700],
      }),
    },
    error: {
      light: red[300],
      main: red[400],
      dark: red[800],
      ...(mode === "dark" && {
        light: red[400],
        main: red[500],
        dark: red[700],
      }),
    },
    success: {
      light: green[300],
      main: green[400],
      dark: green[800],
      ...(mode === "dark" && {
        light: green[400],
        main: green[500],
        dark: green[700],
      }),
    },
    grey: {
      ...gray,
    },
    divider: mode === "dark" ? "hsla(0, 0%, 100%, 0.5)" : alpha(gray[300], 0.5),
    background: {
      default: "hsl(0, 0%, 100%)",
      paper: gray[100],
      ...(mode === "dark" && {
        //default: "hsl(220, 30%, 3%)",
        default:"#071FD4",
        paper: gray[900],
      }),
    },
    text: {
      primary: "hsl(0, 0%, 0%)",
      secondary: "hsla(0, 0%, 0%, 0.5)",
      ...(mode === "dark" && {
        primary: "hsl(0, 0%, 100%)",
        secondary: gray[400],
      }),
    },
    action: {
      selected: `${alpha(brand[200], 0.2)}`,
      ...(mode === "dark" && {
        selected: alpha(brand[800], 0.2),
      }),
    },
  },
  typography: {
    fontFamily: ['"Sora", "sans-serif"'].join(","),
    h1: {
      fontSize: customTheme.typography.pxToRem(40),
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: customTheme.typography.pxToRem(38),
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: customTheme.typography.pxToRem(32),
      lineHeight: 1.2,
    },
    h4: {
      fontSize: customTheme.typography.pxToRem(26),
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h5: {
      fontSize: customTheme.typography.pxToRem(16),
      fontWeight: 700,
    },
    h6: {
      fontSize: customTheme.typography.pxToRem(14),
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: customTheme.typography.pxToRem(18),
    },
    subtitle2: {
      fontSize: customTheme.typography.pxToRem(16),
      fontWeight: 400,
    },
    body1: {
      fontSize: customTheme.typography.pxToRem(14),
      fontWeight: 400,
    },
    body2: {
      fontSize: customTheme.typography.pxToRem(12),
      fontWeight: 400,
    },
    caption: {
      fontSize: customTheme.typography.pxToRem(10),
      fontWeight: 400,
    },
    overline: {
      fontSize: customTheme.typography.pxToRem(14),
      textTransform: "none" as const,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default function getLPTheme(mode: PaletteMode): ThemeOptions {
  return {
    ...getDesignTokens(mode),
    components: {
      MuiAccordion: {
        defaultProps: {
          elevation: 0,
          disableGutters: true,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            padding: 8,
            overflow: "clip",
            backgroundColor: "hsl(0, 0%, 100%)",
            border: "1px solid",
            borderColor: gray[100],
            ":before": {
              backgroundColor: "transparent",
            },
            "&:first-of-type": {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            },
            "&:last-of-type": {
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            },
            ...(theme.palette.mode === "dark" && {
              backgroundColor: gray[900],
              borderColor: gray[800],
            }),
          }),
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: ({ theme }) => ({
            border: "none",
            borderRadius: 8,
            "&:hover": { backgroundColor: gray[100] },
            "&:focus-visible": { backgroundColor: "transparent" },
            ...(theme.palette.mode === "dark" && {
              "&:hover": { backgroundColor: gray[800] },
            }),
          }),
        },
      },
      MuiAccordionDetails: {
        styleOverrides: {
          root: { mb: 20, border: "none" },
        },
      },
      MuiButtonBase: {
        defaultProps: {
          disableTouchRipple: true,
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            boxSizing: "border-box",
            transition: "all 100ms ease",
            "&:focus-visible": {
              outline: `3px solid ${alpha(brand[400], 0.5)}`,
              outlineOffset: "2px",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            boxShadow: "none",
            borderRadius: "55px",
            textTransform: "none",
            fontWeight: "normal",
            fontSize: customTheme.typography.pxToRem(16),
            ...(ownerState.size === "small" && {
              height: "2rem", // 32px
              padding: "0 0.5rem",
            }),
            ...(ownerState.size === "medium" && {
              height: "2.5rem", // 40px
            }),
            ...(ownerState.size === "large" && {
              height: "3.125rem", // 50px
              padding: "0 1.25rem",
            }),
            ...(ownerState.variant === "contained" &&
              ownerState.color === "primary" && {
                fontWeight: "bold",
                color: "white",
                backgroundColor: brand[200],
                backgroundClip: "padding-box",
                boxShadow: `0px 4px 10px 0px hsla(0, 0%, 100%, 0.3) inset`,
                border: "0px solid transparent",
                "&:hover": {
                  backgroundColor: `hsl(17, 100%, 72%)`,
                  boxShadow: `0px 4px 10px 0px hsla(0, 0%, 100%, 0.3) inset`,
                },
                "&:active": {
                  backgroundColor: `hsl(17, 100%, 60%)`,
                  boxShadow: `inset 0 2.5px 0 ${alpha(brand[700], 0.4)}`,
                },
                "&:before": {
                  content: "''",
                  position: "absolute",
                  inset: "-2px",
                  zIndex: -1,
                  borderRadius: "inherit",
                  background:
                    "linear-gradient(180deg, #FFE3B5 32.17%, #D3390B 100%)",
                },
                "&:disabled": {
                  backgroundColor: brand[300],
                },
              }),
            ...(ownerState.variant === "outlined" && {
              color: brand[700],
              backgroundColor: alpha(brand[300], 0.1),
              borderColor: alpha(brand[200], 0.8),
              boxShadow: `inset 0 2px ${alpha(brand[50], 0.5)}, inset 0 -2px ${alpha(brand[200], 0.2)}`,
              "&:hover": {
                backgroundColor: alpha(brand[300], 0.2),
                boxShadow: "none",
              },
              "&:active": {
                backgroundColor: alpha(brand[300], 0.3),
                boxShadow: `inset 0 2.5px 0 ${alpha(brand[400], 0.2)}`,
                backgroundImage: "none",
              },
            }),
            ...(ownerState.variant === "outlined" &&
              ownerState.color === "secondary" && {
                backgroundColor: alpha(gray[300], 0.1),
                borderColor: alpha(gray[300], 0.5),
                color: gray[700],
                "&:hover": {
                  backgroundColor: alpha(gray[300], 0.3),
                  boxShadow: "0px 4px 10px 0px hsla(0, 0%, 0%, 0.1) inset",
                },
                "&:active": {
                  backgroundColor: alpha(gray[300], 0.4),
                  boxShadow: `inset 0 2.5px 0 ${alpha(gray[400], 0.2)}`,
                  backgroundImage: "none",
                },
              }),
            ...(ownerState.variant === "text" &&
              ownerState.color === "primary" && {
                color: brand[700],
                "&:hover": {
                  backgroundColor: alpha(brand[300], 0.3),
                },
              }),
            ...(ownerState.variant === "text" &&
              ownerState.color === "info" && {
                color: gray[700],
                "&:hover": {
                  backgroundColor: alpha(gray[300], 0.3),
                },
              }),
            ...(theme.palette.mode === "dark" && {
              ...(ownerState.variant === "outlined" && {
                color: brand[200],
                backgroundColor: alpha(brand[600], 0.1),
                borderColor: alpha(brand[600], 0.6),
                boxShadow: `inset 0 2.5px ${alpha(brand[400], 0.1)}, inset 0 -2px ${alpha(gray[900], 0.5)}`,
                "&:hover": {
                  backgroundColor: alpha(brand[700], 0.2),
                  borderColor: alpha(brand[700], 0.5),
                  boxShadow: "none",
                },
                "&:active": {
                  backgroundColor: alpha(brand[800], 0.2),
                  boxShadow: `inset 0 2.5px 0 ${alpha(brand[900], 0.4)}`,
                  backgroundImage: "none",
                },
              }),
              ...(ownerState.variant === "text" &&
                ownerState.color === "info" && {
                  color: gray[200],
                  "&:hover": {
                    backgroundColor: alpha(gray[700], 0.3),
                  },
                }),
              ...(ownerState.variant === "outlined" &&
                ownerState.color === "secondary" && {
                  color: "white",
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.25) 6.67%, rgba(255, 255, 255, 0) 100%)",
                  border: "1px solid",
                  borderImageSource:
                    "linear-gradient(180deg, #F5F5F5 0%, #999999 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.0666667), rgba(255, 255, 255, 0.0666667))",
                  boxShadow: "0px 4px 10px 0px hsla(0, 0%, 0%, 0.1) inset",
                  "&:hover": {
                    border: "1px solid",
                    // backgroundColor: alpha(gray[700], 0.2),
                  },
                  "&:active": {
                    background:
                      "linear-gradient(180deg, rgba(255, 255, 255, 0.25) 7%, rgba(255, 255, 255, 0) 100%)",
                  },
                }),
              ...(ownerState.variant === "text" &&
                ownerState.color === "primary" && {
                  color: brand[200],
                  "&:hover": {
                    backgroundColor: alpha(brand[700], 0.3),
                  },
                }),
            }),
          }),
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            overflow: "visible",
            transition: "all 100ms ease",
            backdropFilter: "blur(25px)",
            background:
              theme.palette.mode === "light"
                ? "linear-gradient(122.12deg, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.16) 100%)"
                : "linear-gradient(127.43deg, rgba(255, 255, 255, 0.15) 2.54%, rgba(153, 153, 153, 0.15) 97.47%)",
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${alpha(gray[200], 0.5)}`,
            boxShadow: "none",
            ...(ownerState.variant === "outlined" && {
              border: `1px solid ${gray[200]}`,
              boxShadow: "none",
            }),
            ...(theme.palette.mode === "dark" && {
              border: `1px solid ${alpha(gray[700], 0.3)}`,
              ...(ownerState.variant === "outlined" && {
                border: `1px solid ${alpha(gray[700], 0.4)}`,
                boxShadow: "none",
              }),
            }),
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: ({ theme }) => ({
            py: 1.5,
            px: 0.5,
            border: "1px solid",
            borderColor: brand[100],
            fontWeight: 600,
            backgroundColor: brand[50],
            "&:hover": {
              backgroundColor: brand[500],
            },
            "&:focus-visible": {
              borderColor: brand[300],
              backgroundColor: brand[200],
            },
            "& .MuiChip-label": {
              color: brand[500],
            },
            "& .MuiChip-icon": {
              color: brand[500],
            },
            ...(theme.palette.mode === "dark" && {
              borderColor: `${alpha(brand[500], 0.2)}`,
              backgroundColor: `${alpha(brand[900], 0.5)}`,
              "&:hover": {
                backgroundColor: brand[600],
              },
              "&:focus-visible": {
                borderColor: brand[500],
                backgroundColor: brand[800],
              },
              "& .MuiChip-label": {
                color: brand[200],
              },
              "& .MuiChip-icon": {
                color: brand[200],
              },
            }),
          }),
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderColor: `hsla(0, 0%, 0%, 0.1)`,
            ...(theme.palette.mode === "dark" && {
              borderColor: "hsla(0, 0%, 100%, 0.5)",
            }),
          }),
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            typography: theme.typography.caption,
            marginBottom: 5,
            color: theme.palette.text.primary,
            fontWeight: "bold",
            fontSize: "0.875rem",
            "&.Mui-focused": {
              color: theme.palette.text.primary,
            },
          }),
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            ...(ownerState.size === "small" && {
              height: "2rem",
              width: "2rem",
            }),
            ...(ownerState.size === "medium" && {
              height: "2.5rem",
              width: "2.5rem",
            }),
            transition: "opacity 0.3s ease",
            "&:hover": {
              backgroundColor: "transparent",
              opacity: 0.7,
            },
          }),
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            border: "none",
          },
        },
      },
      MuiLink: {
        defaultProps: {
          underline: "none",
        },
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.mode === "dark" ? "white" : "black ",
            fontWeight: 500,
            position: "relative",
            textDecoration: "none",
            "&::before": {
              content: '""',
              position: "absolute",
              width: 0,
              height: "1px",
              bottom: 0,
              left: 0,
              backgroundColor:
                theme.palette.mode === "dark" ? "white" : "black ",
              opacity: 0.7,
              transition: "width 0.3s ease, opacity 0.3s ease",
            },
            "&:hover::before": {
              width: "100%",
              opacity: 1,
            },
            "&:focus-visible": {
              outline: `3px solid ${alpha(brand[500], 0.5)}`,
              outlineOffset: "4px",
              borderRadius: "2px",
            },
          }),
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: ({ theme }) => ({
            paddingRight: 6,
            paddingLeft: 6,
            color: gray[700],
            fontSize: "1rem",
            fontWeight: 500,
            borderRadius: theme.shape.borderRadius,
            ...(theme.palette.mode === "dark" && {
              color: "white",
            }),
            "&.Mui-selected": {
              backgroundColor: "hsla(0, 0%, 100%, 0.15)",
              "&:hover": {
                backgroundColor: "hsla(0, 0%, 100%, 0.2)",
              },
            },
          }),
        },
      },
      MuiListItemText: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontSize: "1rem",
            color: "black",
            ...(theme.palette.mode === "dark" && {
              color: "white",
            }),
          }),
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            border: "none",
          },
          input: {
            paddingLeft: 10,
          },
          root: ({ theme, ownerState }) => ({
            "input:-webkit-autofill": {
              WebkitBoxShadow: `0 0 0 1000px ${brand[100]} inset, 0 0 0 1px ${brand[200]}`,
              maxHeight: "4px",
              borderRadius: "8px",
            },
            "& .MuiInputBase-input": {
              padding: "15px 20px",
              fontSize: "1rem",
              "&::placeholder": {
                opacity: 0.7,
                color: gray[500],
              },
            },
            boxSizing: "border-box",
            flexGrow: 1,
            borderRadius: "32px",
            border: "2px solid hsla(0, 0%, 0%, 0.2)",
            transition: "border-color 120ms ease-in",
            background: "hsla(0, 0%, 0%, 0.1)",
            "&:hover": {
              borderColor: brand[300],
            },
            ...(ownerState.color === "error" && {
              borderColor: red[200],
              color: red[500],
              "& + .MuiFormHelperText-root": {
                color: red[500],
              },
            }),
            ...(theme.palette.mode === "dark" && {
              "input:-webkit-autofill": {
                WebkitBoxShadow: `0 0 0 1000px ${brand[900]} inset, 0 0 0 1px ${brand[600]}`,
                maxHeight: "6px",
                borderRadius: "8px",
              },
              "& .MuiInputBase-input": {
                padding: "15px 20px",
                fontSize: "1rem",
                "&::placeholder": {
                  opacity: 0.5,
                },
              },
              backgroundColor: "hsla(0, 0%, 0%, 0.1)",
              transition: "border-color 120ms ease-in",
              "&:hover": {
                borderColor: brand[300],
              },
              ...(ownerState.color === "error" && {
                borderColor: red[700],
                color: red[300],
                "& + .MuiFormHelperText-root": {
                  color: red[300],
                },
              }),
            }),
          }),
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
      },
      MuiStack: {
        defaultProps: {
          useFlexGap: true,
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: ({ theme }) => ({
            boxSizing: "border-box",
            width: 45,
            height: 30,
            padding: 0,
            transition: "background-color 100ms ease-in",
            "& .MuiSwitch-switchBase": {
              transform: "translateX(3px)",
              "&.Mui-checked": {
                transform: "translateX(18px)",
              },
            },
            "& .MuiSwitch-thumb": {
              boxShadow: "0 0 2px 2px hsla(220, 0%, 0%, 0.2)",
              backgroundColor: "hsl(0, 0%, 100%)",
              width: 20,
              height: 20,
              marginTop: "5.5px",
            },
            ...(theme.palette.mode === "dark" && {
              width: 45,
              height: 30,
              padding: 0,
              transition: "background-color 100ms ease-in",
              "& .MuiSwitch-thumb": {
                boxShadow: "0 0 2px 2px hsla(220, 0%, 0%, 0.2)",
                backgroundColor: "hsl(0, 0%, 100%)",
                width: 20,
                height: 20,
                marginTop: "5.5px",
              },
            }),
          }),
          switchBase: {
            height: 24,
            width: 24,
            padding: 0,
            color: "hsl(0, 0%, 100%)",
            "&.Mui-checked + .MuiSwitch-track": {
              opacity: 1,
            },
          },
          track: {
            borderRadius: 50,
            opacity: 1,
            backgroundColor: "hsla(0, 0%, 70%, 1)",
            ".Mui-checked.Mui-checked + &": {
              backgroundColor: brand[200],
            },
          },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            boxShadow: `0 1px 2px hsla(210, 0%, 0%, 0.05), 0 2px 12px ${alpha(brand[200], 0.5)}`,
            "& .Mui-selected": {
              color: brand[500],
            },
            ...(theme.palette.mode === "dark" && {
              "& .Mui-selected": {
                color: "hsl(0, 0%, 100%)",
              },
              boxShadow: `0 0 0 1px hsla(210, 0%, 0%, 0.5), 0 2px 12px ${alpha(brand[700], 0.5)}`,
            }),
          }),
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: "12px 16px",
            textTransform: "none",
            borderRadius: theme.shape.borderRadius,
            fontWeight: 500,
            ...(theme.palette.mode === "dark" && {
              color: gray[400],
              "&.Mui-selected": { color: brand[300] },
            }),
          }),
        },
      },
      MuiDialog: {
        styleOverrides: {
          root: ({ theme }) => ({
            "& .MuiModal-backdrop": {
              backgroundColor:
                theme.palette.mode === "light"
                  ? "hsla(0, 0%, 100%, 0.5)"
                  : "hsla(0, 0%, 0%, 0.4)",
              backdropFilter: "blur(12px)",
            },
            "& .MuiDialog-paper": {
              backgroundColor: "transparent",
              background:
                theme.palette.mode === "light"
                  ? "linear-gradient(234.6deg, rgba(42, 68, 255, 0.1) 4.44%, rgba(42, 68, 255, 0.05) 97.8%)"
                  : "linear-gradient(127.43deg, rgba(255, 255, 255, 0.35) 2.54%, rgba(153, 153, 153, 0.35) 97.47%)",
              boxShadow:
                theme.palette.mode === "light"
                  ? "0px 3px 6px 0px hsla(0, 0%, 100%, 0.25) inset"
                  : "0px 3px 4px 0px hsla(213, 82%, 54%, 0.15) inset",
              border: `1px solid`,
              borderColor:
                theme.palette.mode === "light"
                  ? "hsla(233, 100%, 58%, 0.3)"
                  : brand[200],
            },
          }),
        },
      },
      MuiSelect: {
        defaultProps: {
          IconComponent: () => <ArrowDownIcon style={{ marginRight: 22 }} />,
        },
      },
      MuiAlert: {
        defaultProps: {
          icon: <DangerIcon />,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            display: "flex",
            alignItems: "center",
            fontSize: "0.75rem",
            borderRadius: "15px",
            padding: "15px",
            color: "black",
            backgroundColor: "transparent",
            background:
              "linear-gradient(127.43deg, rgba(255, 255, 255, 0.1) 2.54%, rgba(153, 153, 153, 0.1) 97.47%)",
            boxShadow: "0px 4px 34px 0px hsla(0, 0%, 0%, 0.08)",
            "& .MuiAlert-icon": {
              color: "black",
              padding: 0,
              marginRight: "10px",
            },
            "& .MuiAlert-message": {
              padding: 0,
            },
            "&.MuiAlert-filled": {
              backdropFilter: "blur(16px)",
              background:
                "linear-gradient(127.43deg, rgba(255, 255, 255, 0.5) 2.54%, rgba(153, 153, 153, 0.5) 97.47%)",
            },
            ...(theme.palette.mode === "dark" && {
              color: "white",
              "& .MuiAlert-icon": {
                color: "white",
              },
            }),
          }),
        },
      },
      MuiCheckbox: {
        defaultProps: {
          icon: (
            <Box
              sx={(theme) => ({
                width: 24,
                height: 24,
                borderRadius: "6px",
                border: "2px solid",
                borderColor:
                  theme.palette.mode === "light"
                    ? "hsla(0, 0%, 0%, 0.7)"
                    : "hsla(0, 0%, 100%, 0.7)",
              })}
            />
          ),
          checkedIcon: (
            <Image src="/checkbox.svg" alt="checkbox" width={24} height={24} />
          ),
        },
        styleOverrides: {
          root: {
            padding: "10px",
          },
        },
      },
      MuiButtonGroup: {
        styleOverrides: {
          root: ({ theme }) => ({
            display: "flex",
            gap: "5px",
            "& .MuiButton-root": {
              background:
                "linear-gradient(127.43deg, rgba(255, 255, 255, 0.1) 2.54%, rgba(153, 153, 153, 0.1) 97.47%)",
              backgroundColor: "transparent",
              border: "1px solid hsla(0, 0%, 100%, 0.2)",
              boxShadow: "none",
              borderRadius: "10px",
              color: theme.palette.text.primary,
              padding: "6px",
              lineHeight: 1,
              height: "30px",
              "&:hover": {
                opacity: 0.85,
                backgroundColor: "transparent",
                border: "1px solid hsla(0, 0%, 100%, 0.2)",
                boxShadow: "none",
              },
              "&:before": {
                inset: "-1px",
                borderRadius: "10px",
                background:
                  "linear-gradient(180deg, #F47954 52.85%, #CC512C 100%)",
              },
              "&.MuiButton-contained": {
                color: "white",
              },
            },
          }),
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: "white",
            "& .MuiSlider-thumb": {
              height: 30,
              width: 30,
              backgroundColor: "#fff",
              "&:focus, &:hover, &.Mui-active": {
                boxShadow: "0px 0px 3px 1px rgba(0, 0, 0, 0.1)",
              },
            },
            "& .MuiSlider-valueLabel": {
              fontSize: "13px",
              fontWeight: "normal",
              top: -6,
              backgroundColor: "white",
              color: "hsla(0, 0%, 0%, 1)",
              borderRadius: "10px",
              padding: "10px",
              zIndex: 1000000000,
            },
            "& .MuiSlider-mark": {
              display: "none",
            },
            "& .MuiSlider-markLabel": {
              color: theme.palette.text.primary,
              "&:nth-child(1 of .MuiSlider-markLabel)": {
                marginLeft: "16px",
              },
              "&:nth-last-child(1 of .MuiSlider-markLabel)": {
                marginLeft: "-42px",
              },
            },
            "& .MuiSlider-track": {
              border: "none",
              height: 10,
            },
            "& .MuiSlider-rail": {
              opacity: 0.5,
              height: 10,
              border: "none",
              background: "hsla(0, 0%, 100%, 0.1)",
            },
          }),
        },
      },
    },
  };
}
