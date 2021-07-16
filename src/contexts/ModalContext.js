import React, { useState, createContext } from "react";

export const ModalContext = createContext();

const initialState = {
  id: "",
  open: false,
  title: "",
  content: null,
};

export const ModalProvider = (props) => {
  const [state, setState] = useState(initialState);

  const changeStateModal = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const openModal = (settings) => {
    setState((prev) => ({ ...prev, ...settings, open: true }));
  };

  const setModalLoading = (isLoading) => {
    setState((prev) => ({ ...prev, isLoading }));
  };

  const closeModal = () => {
    setState(initialState);
  };

  return (
    <ModalContext.Provider
      value={{
        ...state,
        changeStateModal,
        openModal,
        setModalLoading,
        closeModal,
      }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};

export const ModalConsumer = ModalContext.Consumer;

export const withModalContext = (Component) => (props) =>
  (
    <ModalConsumer>
      {(providerProps) => (
        <Component {...props} modalContextProps={providerProps} />
      )}
    </ModalConsumer>
  );
