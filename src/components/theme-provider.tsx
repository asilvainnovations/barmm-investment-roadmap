import { createContext, useContext, useEffect, useState } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: "dark" | "light" | "system";
  enableSystem?: boolean;
}

const ThemeProviderContext = createContext<{ theme: string; setTheme: (t: string) => void }>({
  theme: "dark",
  setTheme: () => {},
});

export function ThemeProvider({ children, defaultTheme = "dark" }: ThemeProviderProps) {
  const [theme] = useState(defaultTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light", "system");
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme: () => {} }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeProviderContext);
}
