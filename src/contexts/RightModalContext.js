import React, { useState, createContext } from 'react';
import { useNotificationContext } from '.';

export const RightModalContext = createContext();

const initialState = {
  open: false,
  isNotificationModal: false,
  title: '',
  content: null,
  footer: null,
};

export const RightModalProvider = (props) => {
  const [state, setState] = useState(initialState);
  const { seIsReadedNotification } = useNotificationContext();

  const openModal = (settings) => {
    setState((prev) => ({ ...prev, ...settings, open: true }));
  };

  const setModalLoading = (isLoading) => {
    setState((prev) => ({ ...prev, isLoading }));
  };

  const closeModal = () => {
    if (state.isNotificationModal) {
      seIsReadedNotification();
    }
    setState(initialState);
  };

  return (
    <RightModalContext.Provider
      value={{
        ...state,
        setModalLoading,
        openModal,
        closeModal,
      }}
    >
      {props.children}
    </RightModalContext.Provider>
  );
};

export const RightModalConsumer = RightModalContext.Consumer;

export const withRightModalContext = (Component) => (props) =>
  <RightModalConsumer>{(providerProps) => <Component {...props} modalContextProps={providerProps} />}</RightModalConsumer>;
