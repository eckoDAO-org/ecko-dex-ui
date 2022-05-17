import React, { createContext, useEffect, useState } from 'react';
import useWindowSize from '../hooks/useWindowSize';

const RESOLUTIONS = {
  '3840x2160': {
    width: 3840,
    height: 2160,
    'game-mode': {
      scale: 2.3,
      geTranslateY: -420,
      wiresTranslateY: -1360,
    },
    'normal-mode': { scale: 2.3 },
  },
  /*not standard*/ '2850x1400': {
    width: 2850,
    height: 1400,
    'game-mode': { scale: 1.6, geTranslateY: 268, wiresTranslateY: -430 },
    'normal-mode': { scale: 1.6 },
  },
  '2560x1600': { width: 2560, height: 1600, 'game-mode': { scale: 1.6, geTranslateY: 208, wiresTranslateY: -430 }, 'normal-mode': { scale: 1.6 } },
  '2560x1440': { width: 2560, height: 1440, 'game-mode': { scale: 1.5, geTranslateY: 290, wiresTranslateY: -336 }, 'normal-mode': { scale: 1.5 } },
  /*not standard*/ '2400x1160': {
    width: 2400,
    height: 1160,
    'game-mode': { scale: 1.3, geTranslateY: 390, wiresTranslateY: -170 },
    'normal-mode': { scale: 1.3 },
  },
  '2048x1080': { width: 2048, height: 1080, 'game-mode': { scale: 1.3, geTranslateY: 402, wiresTranslateY: -85 }, 'normal-mode': { scale: 1.3 } },
  '1920x1080': { width: 1920, height: 1080, 'game-mode': { scale: 1.2, geTranslateY: 430, wiresTranslateY: -85 }, 'normal-mode': { scale: 1.2 } },
  '1920x936': { width: 1920, height: 936, 'game-mode': { scale: 1, geTranslateY: 445, wiresTranslateY: 0 }, 'normal-mode': { scale: 1 } },
  /*not standard*/ '1740x840': {
    width: 1740,
    height: 840,
    'game-mode': { scale: 1, geTranslateY: 442, wiresTranslateY: 0 },
    'normal-mode': { scale: 1 },
  },
  '1680x1050': { width: 1680, height: 1050, 'game-mode': { scale: 1, geTranslateY: 442, wiresTranslateY: 0 }, 'normal-mode': { scale: 1 } },
  '1680x847': { width: 1680, height: 847, 'game-mode': { scale: 1, geTranslateY: 446, wiresTranslateY: 0 }, 'normal-mode': { scale: 1 } },
  '1600x900': { width: 1600, height: 900, 'game-mode': { scale: 1, geTranslateY: 442, wiresTranslateY: 0 }, 'normal-mode': { scale: 1 } },
  /*not standard*/ '1500x730': {
    width: 1500,
    height: 730,
    'game-mode': { scale: 0.8, geTranslateY: 435, wiresTranslateY: 88 },
    'normal-mode': { scale: 0.8 },
  },
  '1440x900': { width: 1440, height: 900, 'game-mode': { scale: 1, geTranslateY: 442, wiresTranslateY: 0 }, 'normal-mode': { scale: 1 } },
  '1400x1050': { width: 1400, height: 1050, 'game-mode': { scale: 1, geTranslateY: 442, wiresTranslateY: 0 }, 'normal-mode': { scale: 1 } },
  '1366x768': { width: 1366, height: 768, 'game-mode': { scale: 0.8, geTranslateY: 425, wiresTranslateY: 88 }, 'normal-mode': { scale: 0.8 } },
  '1360x768': { width: 1360, height: 768, 'game-mode': { scale: 0.8, geTranslateY: 425, wiresTranslateY: 88 }, 'normal-mode': { scale: 0.8 } },
  '1280x1024': { width: 1280, height: 1024, 'game-mode': { scale: 1, geTranslateY: 442, wiresTranslateY: 0 }, 'normal-mode': { scale: 1 } },
  '1280x960': { width: 1280, height: 960, 'game-mode': { scale: 0.9, geTranslateY: 442, wiresTranslateY: 88 }, 'normal-mode': { scale: 0.9 } },
  '1280x800': { width: 1280, height: 800, 'game-mode': { scale: 0.8, geTranslateY: 428, wiresTranslateY: 88 }, 'normal-mode': { scale: 0.8 } },
  '1280x768': { width: 1280, height: 768, 'game-mode': { scale: 0.8, geTranslateY: 420, wiresTranslateY: 88 }, 'normal-mode': { scale: 0.8 } },
  '1280x720': { width: 1280, height: 720, 'game-mode': { scale: 0.8, geTranslateY: 420, wiresTranslateY: 88 }, 'normal-mode': { scale: 0.8 } },
  /*not standard*/ '1280x660': {
    width: 1280,
    height: 660,
    'game-mode': { scale: 0.8, geTranslateY: 428, wiresTranslateY: 76 },
    'normal-mode': { scale: 0.8 },
  },
  /*not standard*/ '1280x620': {
    width: 1280,
    height: 620,
    'game-mode': { scale: 0.7, geTranslateY: 415, wiresTranslateY: 104 },
    'normal-mode': { scale: 0.7 },
  },
  '1280x600': { width: 1280, height: 600, 'game-mode': { scale: 0.7, geTranslateY: 390, wiresTranslateY: 88 }, 'normal-mode': { scale: 0.7 } },
  '1152x864': { width: 1152, height: 864, 'game-mode': { scale: 0.8, geTranslateY: 434, wiresTranslateY: 88 }, 'normal-mode': { scale: 0.8 } },
  '1024x768': { width: 1024, height: 768, 'game-mode': { scale: 0.8, geTranslateY: 438, wiresTranslateY: 88 }, 'normal-mode': { scale: 0.8 } },
};

export const ApplicationContext = createContext(null);

export const ApplicationProvider = (props) => {
  const [themeMode, setThemeMode] = useState('dark');
  const [mountedComponent, setMountedComponent] = useState(false);

  const [resolutionConfiguration, setResolutionConfiguration] = useState(null);

  const [width, height] = useWindowSize();

  useEffect(() => {
    let resolution = null;
    Object.keys(RESOLUTIONS).some((resolutionKey) => {
      const configuration = RESOLUTIONS[resolutionKey];
      if (width >= configuration.width && height >= configuration.height) {
        resolution = RESOLUTIONS[resolutionKey];
        return true;
      }
      return false;
    });

    setResolutionConfiguration(resolution);
  }, [width, height]);

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
    mountedComponent,
    resolutionConfiguration,
  };
  return <ApplicationContext.Provider value={contextValues}>{props.children}</ApplicationContext.Provider>;
};
