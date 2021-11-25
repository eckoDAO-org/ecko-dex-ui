import React, { createContext, useState } from 'react';

export const GameEditionContext = createContext(null);

const initialModalState = {
  open: false,
  title: null,
  description: null,
  content: null
};
export const GameEditionProvider = (props) => {
  const [gameEditionView, setGameEditionView] = useState(false);
  const [modalState, setModalState] = useState(initialModalState);
  const [isSwapping, setIsSwapping] = useState(false);

  const openModal = (settings) => {
    setModalState((prev) => ({ ...prev, ...settings, open: true }));
  };

  const closeModal = () => {
    setModalState(initialModalState);
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
        isSwapping,
        setIsSwapping
      }}
    >
      {props.children}
    </GameEditionContext.Provider>
  );
};
