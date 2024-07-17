import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { PaletteMode } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import getLPTheme from "@/app/getLPTheme";

function useColorModeContext(initialMode: PaletteMode) {
  const [mode, setMode] = useState<PaletteMode>(initialMode);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");

      if (!saved || (saved !== "light" && saved !== "dark")) {
        const dark = window.matchMedia("(prefers-color-scheme: dark)");
        setMode(dark ? "dark" : "light");
      } else {
        setMode(saved);
      }
    }
  }, []);

  const toggleColorMode = useCallback(() => {
    setMode((prev) => {
      const theme = prev === "light" ? "dark" : "light";
      if(theme === "light") {
        document.body.classList.add("light");
      } else {
        document.body.classList.remove("light");
      }
      // console.log("===>", (document.body.classList), theme)
      localStorage.setItem("theme", theme);
      return theme;
    });
  }, []);

  return { mode, toggleColorMode };
}

type UseColorModeContext = ReturnType<typeof useColorModeContext>;

export const ColorModeContext = createContext<UseColorModeContext>({
  mode: "dark",
  toggleColorMode: () => { },
});

export function ColorModeProvider({ children }: PropsWithChildren) {
  const value = useColorModeContext("dark");

  const theme = useMemo(
    () => createTheme(getLPTheme(value.mode)),
    [value.mode],
  );

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}
