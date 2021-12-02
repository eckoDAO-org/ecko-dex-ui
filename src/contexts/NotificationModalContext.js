import { initial } from 'lodash-es';
import React, { useState, createContext, useContext } from 'react';
import { NotificationContext } from './NotificationContext';

export const NotificationModalContext = createContext();
const initialState = {
  open: false,
  title: '',
  content: null,
  footer: null,
};
export const NotificationModalProvider = (props) => {
  const { notificationList, setNotificationList } = useContext(NotificationContext);
  const [state, setState] = useState(initialState);

  const openModal = (settings) => {
    setState((prev) => ({ ...prev, ...settings, open: true }));
  };

  const closeModal = () => {
    setState({ ...initial });
    // if in the notification list the nofications are readed
    const newNotificationList = notificationList.map((notif) => ({
      ...notif,
      isReaded: true,
    }));
    setNotificationList(newNotificationList);
  };

  return (
    <NotificationModalContext.Provider
      value={{
        ...state,
        openModal,
        closeModal,
        setNotificationList,
      }}
    >
      {props.children}
    </NotificationModalContext.Provider>
  );
};

export const NotificationModalConsumer = NotificationModalContext.Consumer;
