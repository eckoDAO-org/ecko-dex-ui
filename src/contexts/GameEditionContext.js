import React, { createContext, useEffect, useState } from 'react';
import useWindowSize from '../hooks/useWindowSize';

export const GameEditionContext = createContext(null);

const initialModalState = {
  open: false,
  title: null,
  description: null,
  content: null,
};

export const GE_DESKTOP_CONFIGURATION = {
  DISPLAY_WIDTH: 455,
  DISPLAY_HEIGHT: 335,
  WIRE_CONTAINER_WIDTH: 930,
  layouts: {
    // 'scale-2.5': { id: 'scale-2.5', minimumHeight: 2160, minimumWidth: 3840, scale: 2.5, geTranslateY: -470, wiresTranslateY: -1570 },
    // 'scale-1.6': { id: 'scale-1.6', minimumHeight: 1440, minimumWidth: 2560, scale: 1.6, geTranslateY: 290, wiresTranslateY: -410 },
    // 'scale-1.2-1': { id: 'scale-1.2-1', minimumHeight: 1080, minimumWidth: 1920, scale: 1.2, geTranslateY: 430, wiresTranslateY: -85 },
    'scale-1.2': { id: 'scale-1.2', minimumHeight: 1024, minimumWidth: 1400, scale: 1.2, geTranslateY: 442, wiresTranslateY: -85 },
    'scale-1': { id: 'scale-1', minimumHeight: 780, minimumWidth: 1024, scale: 1, geTranslateY: 442, wiresTranslateY: 88 },
    'scale-0.8': {
      id: 'scale-0.8',
      minimumHeight: 616,
      minimumWidth: 1024,
      scale: 0.8,
      wiresTranslateY: 88,
      geTranslateY: {
        'translateY-425': {
          minimumHeight: 735,
          translateY: 425,
        },
        'translateY-420': {
          minimumHeight: 665,
          translateY: 420,
        },
        'translateY-415': {
          minimumHeight: 640,
          translateY: 415,
        },
        'translateY-410': {
          minimumHeight: 616,
          translateY: 410,
        },
      },
    },
  },
};

export const PROGRESS_BAR_MAX_VALUE = 89;

export const GameEditionProvider = (props) => {
  const [width, height] = useWindowSize();
  const [buttons, setButtons] = useState({
    A: null,
    B: null,
    Up: null,
    Down: null,
    Right: null,
    Left: null,
  });
  const [gameEditionView, setGameEditionView] = useState(false);
  const [modalState, setModalState] = useState(initialModalState);

  // loading bar
  const [loadingValue, setLoadingValue] = useState(1);

  // show all wires below the gameboy
  const [showWires, setShowWires] = useState(false);

  // show the selected wire connected to gameboy
  const [selectedWire, setSelectedWire] = useState(false);

  const [showTokens, setShowTokens] = useState(false);
  const [outsideToken, setOutsideToken] = useState({ tokenSelectorType: null, token: null, fromToken: null, toToken: null });

  // gameboy layout configuration
  const [layoutConfiguration, setLayoutConfiguration] = useState(null);

  const getGeTranslateY = (layout, h) => {
    switch (layout.id) {
      case GE_DESKTOP_CONFIGURATION.layouts['scale-0.8'].id:
        let translateY = 420;
        Object.keys(layout.geTranslateY).some((translateYKey) => {
          const { minimumHeight } = layout.geTranslateY[translateYKey];

          if (h > minimumHeight) {
            translateY = layout.geTranslateY[translateYKey].translateY;
            return true;
          }
          return false;
        });
        setLayoutConfiguration((prev) => ({ ...prev, geTranslateY: translateY }));
        break;
      default:
        setLayoutConfiguration((prev) => ({ ...prev, geTranslateY: layout.geTranslateY }));

        break;
    }
  };

  useEffect(() => {
    let layout = GE_DESKTOP_CONFIGURATION.layouts['scale-1'];
    Object.keys(GE_DESKTOP_CONFIGURATION.layouts).some((scaleKey) => {
      const { minimumWidth, minimumHeight } = GE_DESKTOP_CONFIGURATION.layouts[scaleKey];
      if (width >= minimumWidth && height >= minimumHeight) {
        layout = GE_DESKTOP_CONFIGURATION.layouts[scaleKey];
        return true;
      }
      return false;
    });

    setLayoutConfiguration(layout);

    getGeTranslateY(layout, height);
    if (width < layout.minimumWidth || height < layout.minimumHeight) {
      setGameEditionView(false);
      closeModal();
    }
  }, [width, height]);

  useEffect(() => {
    let interval = null;
    if (gameEditionView) {
      interval = setInterval(() => setLoadingValue(PROGRESS_BAR_MAX_VALUE), 1000);
    }
    return () => {
      clearInterval(interval);
      setLoadingValue(1);
    };
  }, [gameEditionView]);

  const openModal = (settings) => {
    setModalState((prev) => ({ ...prev, ...settings, open: true }));
  };

  const closeModal = () => {
    setModalState(initialModalState);
  };

  const onWireSelect = (wire) => {
    setShowWires(false);
    setSelectedWire(wire);
  };

  const onCloseTokensList = () => {
    setShowTokens(false);
    setOutsideToken({ tokenSelectorType: null, token: null, fromToken: null, toToken: null });
  };

  return (
    <GameEditionContext.Provider
      value={{
        gameEditionView,
        setGameEditionView,
        modalState,
        setModalState,
        openModal,
        closeModal,

        loadingValue,
        showWires,
        setShowWires,
        selectedWire,
        setSelectedWire,
        onWireSelect,
        showTokens,
        setShowTokens,
        buttons,
        setButtons,
        outsideToken,
        setOutsideToken,
        onCloseTokensList,
        layoutConfiguration,
      }}
    >
      {props.children}
    </GameEditionContext.Provider>
  );
};
