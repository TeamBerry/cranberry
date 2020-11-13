/* eslint-disable react/destructuring-assignment */
import React, { useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
// eslint-disable-next-line import/extensions
import { lightColors, darkColors, Colors } from './colorThemes';

export interface Theme {
    isDark: boolean;
    colors: Colors;
    setScheme: (value: 'dark' | 'light') => void;
}

export const ThemeContext = React.createContext<Theme>({
  isDark: false,
  colors: lightColors,
  setScheme: () => { },
});

export const ThemeProvider = (props) => {
  const colorScheme = useColorScheme();

  const [isDark, setIsDark] = useState<boolean>(colorScheme === 'dark');

  useEffect(() => {
    setIsDark(colorScheme === 'dark');
  }, [colorScheme]);

  const defaultTheme: Theme = {
    isDark,
    colors: isDark ? darkColors : lightColors,
    setScheme: (scheme) => setIsDark(scheme === 'dark'),
  };

  return (
    <ThemeContext.Provider value={defaultTheme}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
