import React, { createContext, useEffect, useState } from 'react';

export const GameEditionContext = createContext(null);

const initialModalState = {
  open: false,
  title: null,
  description: null,
  content: null,
};

export const PROGRESS_BAR_MAX_VALUE = 89;

export const GameEditionProvider = (props) => {
  const [gameEditionView, setGameEditionView] = useState(true);
  const [modalState, setModalState] = useState(initialModalState);
  const [isSwapping, setIsSwapping] = useState(false);

  const [completed, setCompleted] = useState(1);

  useEffect(() => {
    if (gameEditionView) {
      console.log('if');
      setInterval(() => setCompleted(PROGRESS_BAR_MAX_VALUE), 1000);
    } else return () => setCompleted(1);
  }, [gameEditionView]);

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
        setIsSwapping,
        completed,
      }}
    >
      {props.children}
    </GameEditionContext.Provider>
  );
};
