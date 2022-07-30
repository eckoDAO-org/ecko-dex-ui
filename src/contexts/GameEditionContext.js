import React, { createContext, useEffect, useState } from 'react';

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
};

export const PROGRESS_BAR_MAX_VALUE = 89;

export const GameEditionProvider = (props) => {
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

  // show all wires below the game edition
  const [showWires, setShowWires] = useState(false);

  // show the selected wire connected to game edition
  const [selectedWire, setSelectedWire] = useState(false);

  const [showTokens, setShowTokens] = useState(false);
  const [outsideToken, setOutsideToken] = useState({ tokenSelectorType: null, token: null, fromToken: null, toToken: null });

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
      }}
    >
      {props.children}
    </GameEditionContext.Provider>
  );
};
