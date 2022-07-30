/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, createContext, useEffect } from 'react';

export const ModalContext = createContext();

const initialState = {
  id: '',
  open: false,
  title: '',
  content: null,
  containerStyle: null,
};

export const ModalProvider = (props) => {
  const [state, setState] = useState(initialState);

  const [prevModal, setPrevModal] = useState(state);

  useEffect(() => {
    if (state.id === prevModal.id) {
      setPrevModal(state);
    }
  }, [state]);

  const onBackModal = () => {
    setState(prevModal);
  };

  const openModal = (settings) => {
    try {
      setState((prev) => ({ ...prev, ...settings, open: true }));
    } catch (err) {
      console.log(err);
    }
  };

  const setModalLoading = (isLoading) => {
    setState((prev) => ({ ...prev, isLoading }));
  };

  const closeModal = () => {
    setState({ ...initialState, open: false });
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
  <ModalConsumer>{(providerProps) => <Component {...props} modalContextProps={providerProps} />}</ModalConsumer>;
