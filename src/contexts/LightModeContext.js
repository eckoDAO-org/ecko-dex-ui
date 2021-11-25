import React, { createContext, useEffect, useState } from 'react';

export const LightModeContext = createContext(null);

export const LightModeProvider = (props) => {
  const [themeMode, setThemeMode] = useState('dark');
  const [mountedComponent, setMountedComponent] = useState(false);

  const setMode = (mode) => {
    window.localStorage.setItem('theme', mode);
    setThemeMode(mode);
  };

  const themeToggler = () => {
    themeMode === 'dark' ? setMode('light') : setMode('dark');
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme');
    localTheme && setThemeMode(localTheme);
    setMountedComponent(true);
  }, []);

  const contextValues = {
    themeMode,
    themeToggler,
    mountedComponent
  };
  return <LightModeContext.Provider value={contextValues}>{props.children}</LightModeContext.Provider>;
};
