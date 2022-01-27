import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import NotificationContainer from '../components/notification/NotificationContainer';

export const NotificationContext = createContext();

export const STATUSES = {
  DEFAULT: toast.TYPE.DEFAULT,
  SUCCESS: toast.TYPE.SUCCESS,
  WARNING: toast.TYPE.WARNING,
  DARK: toast.TYPE.DARK,
  ERROR: toast.TYPE.ERROR,
  INFO: toast.TYPE.INFO,
};

const getStoredNotification = JSON.parse(localStorage.getItem('Notification'));

export const NotificationProvider = ({ children }) => {
  const [notificationList, setNotificationList] = useState(getStoredNotification || []);

  const showNotification = ({
    title = '',
    message = '',
    autoClose = false,
    position = 'bottom-right',
    type = STATUSES.SUCCESS,
    style = undefined,
    progressStyle = undefined,
    hideProgressBar = true,
    pauseOnHover = undefined,
    pauseOnFocusLoss = undefined,
    draggable = undefined,
    delay = undefined,
    closeButton = undefined,
    onClick = undefined,
    onOpen = undefined,
    onClose = undefined,
    icon = undefined,
    titleStyle,
    className,
  }) => {
    return toast(<NotificationContainer message={message} type={type} title={title} icon={icon} titleStyle={titleStyle} />, {
      className,
      title,
      message,
      autoClose,
      position,
      style,
      type,
      progressStyle,
      hideProgressBar,
      pauseOnHover,
      pauseOnFocusLoss,
      draggable,
      delay,
      closeButton,
      onClick,
      onOpen,
      onClose,
      icon,
    });
  };

  useEffect(() => {
    localStorage.setItem(`Notification`, JSON.stringify(notificationList));
  }, [notificationList]);

  useEffect(() => {
    if (!getStoredNotification) localStorage.setItem(`Notification`, JSON.stringify([]));
  }, []);

  const storeNotification = (notification) => {
    const notificationListByStorage = JSON.parse(localStorage.getItem('Notification'));
    if (!notificationListByStorage) {
      //first saving notification in localstorage
      localStorage.setItem(`Notification`, JSON.stringify([notification]));
      setNotificationList(notification);
    } else {
      notificationListByStorage.push(notification);
      localStorage.setItem(`Notification`, JSON.stringify(notificationListByStorage));
      setNotificationList(notificationListByStorage);
    }
  };

  const removeItem = (indexToRemove) => {
    // remember that notification list i view reversed
    const notifWithoutRemoved = [...notificationList].reverse().filter((notif, index) => index !== indexToRemove);
    setNotificationList(notifWithoutRemoved);
  };

  const removeAllItem = (list) => {
    setNotificationList([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        STATUSES,
        notificationList,
        showNotification,
        setNotificationList,
        storeNotification,
        removeItem,
        removeAllItem,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const NotificationConsumer = NotificationContext.Consumer;
