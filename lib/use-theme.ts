"use client";

import { useState, useEffect, useCallback } from "react";

function getInitialTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("vaulte-theme");
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

export function useThemeMode() {
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeState(getInitialTheme());
    setMounted(true);
  }, []);

  const setTheme = useCallback((newTheme: "dark" | "light") => {
    setThemeState(newTheme);
    localStorage.setItem("vaulte-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme, mounted };
}
