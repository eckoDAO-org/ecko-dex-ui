import { initial } from 'lodash-es';
import React, { useState, createContext } from 'react';

export const NotificationModalContext = createContext();
const initialState = {
  open: false,
  title: '',
  content: null,
  footer: null,
};
export const NotificationModalProvider = (props) => {
  const [state, setState] = useState(initialState);

  const openModal = (settings) => {
    setState((prev) => ({ ...prev, ...settings, open: true }));
  };

  const closeModal = () => {
    setState({ ...initial });
  };

  return (
    <NotificationModalContext.Provider
      value={{
        ...state,
        openModal,
        closeModal,
      }}
    >
      {props.children}
    </NotificationModalContext.Provider>
  );
};

export const NotificationModalConsumer = NotificationModalContext.Consumer;
