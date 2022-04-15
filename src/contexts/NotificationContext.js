import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
import NotificationContainer from '../components/notification/NotificationContainer';
import { NETWORK_TYPE } from '../constants/contextConstants';

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
  const toastId = React.useRef(null);

  const [notificationList, setNotificationList] = useState(getStoredNotification || []);

  // TOAST NOTIFICATION
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
    closeOnClick = true,
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
      closeOnClick,
      onClick,
      onOpen,
      onClose,
      icon,
    });
  };

  // FUNCTIONS FOR STORE, UPDATE AND DELETE NOTIFICATION ON RIGHT MODAL
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
      notificationListByStorage.unshift(notification);
      localStorage.setItem(`Notification`, JSON.stringify(notificationListByStorage));
      setNotificationList(notificationListByStorage);
    }
  };

  const setIsCompletedNotification = (reqKey) => {
    const getStoredNotification = JSON.parse(localStorage.getItem('Notification'));
    const newNotificationList = getStoredNotification.map((notif) => {
      if (notif.type === 'info' && notif.description === reqKey) {
        notif.isCompleted = true;
      }
      return notif;
    });
    localStorage.setItem(`Notification`, JSON.stringify(newNotificationList));
  };

  const seIsReadedNotification = () => {
    const newNotificationList = notificationList.map((notif) => ({
      ...notif,
      isRead: true,
    }));
    setNotificationList(newNotificationList);
  };

  const removeNotification = (indexToRemove) => {
    // remember that notification list i view reversed
    const notifWithoutRemoved = [...notificationList].filter((notif, index) => index !== indexToRemove);
    setNotificationList(notifWithoutRemoved);
  };

  const removeAllNotifications = (list) => {
    setNotificationList([]);
  };

  // UTILS FOR THE LOGIC ON BLOCKCHAIN CALLS
  const pollingNotif = (reqKey, title, message = null) => {
    storeNotification({
      type: STATUSES.INFO,
      date: moment().format('DD/MM/YYYY - HH:mm:ss'),
      title: title || 'Transaction Pending',
      description: reqKey,
      isRead: false,
      isCompleted: false,
    });
    toastId.current = showNotification({
      title: title || 'Transaction Pending',
      message: message || reqKey,
      type: STATUSES.INFO,
      closeOnClick: false,
      hideProgressBar: false,
      onClick: async () => {
        window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${reqKey}`, '_blank', 'noopener,noreferrer');
      },
    });
  };

  //Show and store the Error Notification
  const showErrorNotification = (reqKey, title, message = null) => {
    toast.dismiss(toastId.current);
    setIsCompletedNotification(reqKey);
    storeNotification({
      type: STATUSES.ERROR,
      date: moment().format('DD/MM/YYYY - HH:mm:ss'),

      title: title || 'Transaction Error!',
      description: message || 'Check it out in the block explorer',
      link: reqKey ? `https://explorer.chainweb.com/${NETWORK_TYPE}/txdetail/${reqKey}` : null,
      isRead: false,
    });
    // open the toast FAILURE message
    showNotification({
      title: title || 'Transaction Error!',
      message: message || 'Check it out in the block explorer',
      type: STATUSES.ERROR,
      onClick: async () => {
        toast.dismiss(toastId);
        reqKey && window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/txdetail/${reqKey}`, '_blank', 'noopener,noreferrer');
      },
      autoClose: 10000,
    });
  };

  //Show and store the Success Notification
  const showSuccessNotification = (reqKey, title, message = null) => {
    toast.dismiss(toastId.current);
    setIsCompletedNotification(reqKey);

    storeNotification({
      type: STATUSES.SUCCESS,
      date: moment().format('DD/MM/YYYY - HH:mm:ss'),

      title: title || 'Transaction Success!',
      description: message || 'Check it out in the block explorer',
      link: `https://explorer.chainweb.com/${NETWORK_TYPE}/txdetail/${reqKey}`,
      isRead: false,
    });
    // open the toast SUCCESS message
    showNotification({
      title: title || 'Transaction Success!',
      message: message || 'Check it out in the block explorer',
      type: STATUSES.SUCCESS,
      onClick: async () => {
        window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/txdetail/${reqKey}`, '_blank', 'noopener,noreferrer');
      },
      autoClose: 10000,
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        toastId,
        STATUSES,
        showNotification,
        notificationList,
        setNotificationList,
        storeNotification,
        setIsCompletedNotification,
        seIsReadedNotification,
        removeNotification,
        removeAllNotifications,
        pollingNotif,
        showErrorNotification,
        showSuccessNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const NotificationConsumer = NotificationContext.Consumer;
