import React, { useState, createContext, useContext } from 'react';
import { NotificationContext } from './NotificationContext';

export const RightModalContext = createContext();

const initialState = {
  open: false,
  title: '',
  content: null,
  footer: null,
};

export const RightModalProvider = (props) => {
  const [state, setState] = useState(initialState);
  const { notificationList, setNotificationList } = useContext(NotificationContext);

  const openModal = (settings) => {
    setState((prev) => ({ ...prev, ...settings, open: true }));
  };

  const setModalLoading = (isLoading) => {
    setState((prev) => ({ ...prev, isLoading }));
  };

  const closeModal = () => {
    setState(initialState);
    // if in the notification list the nofications are readed
    const newNotificationList = notificationList.map((notif) => ({
      ...notif,
      isRead: true,
    }));
    setNotificationList(newNotificationList);
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
