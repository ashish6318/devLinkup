// frontend/src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') { // Ensure localStorage is available
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme;
      }
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light'; // Default to light
  });

  useEffect(() => {
    const root = window.document.documentElement; // Get the <html> element
    
    // Remove previous theme class
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Save preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
    console.log("ThemeContext: Theme changed to", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Optional: Function to set theme based on system preference
  const setSystemTheme = () => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }
  // Initially set to system theme if no preference stored
  // useEffect(() => {
  //   if (!localStorage.getItem('theme')) {
  //     setSystemTheme();
  //   }
  //   // Listen for changes in system preference
  //   const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  //   const handleChange = () => setSystemTheme(); // Or just update if current theme is 'system'
  //   mediaQuery.addEventListener('change', handleChange);
  //   return () => mediaQuery.removeEventListener('change', handleChange);
  // }, []);


  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme /*, setSystemTheme */ }}>
      {children}
    </ThemeContext.Provider>
  );
};
