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

  const [prevModal, setPrevModal] = useState(state);

  const onBackModal = () => {
    setState(prevModal);
  };

  const openModal = (settings) => {
    setState((prev) => ({ ...prev, ...settings, open: true }));
    if (state.id === prevModal.id) setPrevModal(state);
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
        onBackModal,
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
