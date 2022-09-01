/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
import NotificationContainer from '../components/notification/NotificationContainer';
import { NETWORK_TYPE } from '../constants/contextConstants';
import { listen } from '../api/utils';
import { useAccountContext } from '.';
import { genRandomString } from '../utils/string-utils';

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
  const { account, setFetchAccountBalance } = useAccountContext();

  const [notificationList, setNotificationList] = useState(getStoredNotification || []);
  const [toastNotificationsId, setToastNotificationsId] = useState([]);

  const [notificationNotCompletedChecked, setNotificationNotCompletedChecked] = useState(false);

  // TOAST NOTIFICATION
  const showNotification = ({
    toastId = '',
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
      toastId,
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

  const removeToastNotificationId = async (id) => {
    let notifList = toastNotificationsId.filter((notif) => notif !== id);
    setToastNotificationsId(notifList);
  };

  // UTILS FOR THE LOGIC ON BLOCKCHAIN CALLS
  const pollingNotif = (reqKey, title, message = null) => {
    const notificationExists = toastNotificationsId.find((notif) => notif === reqKey);
    if (!notificationExists) {
      storeNotification({
        type: STATUSES.INFO,
        date: moment().format('DD/MM/YYYY - HH:mm:ss'),
        title: title || 'Transaction Pending',
        description: reqKey,
        isRead: false,
        isCompleted: false,
      });
      showNotification({
        toastId: reqKey,
        title: title || 'Transaction Pending',
        message: message || reqKey,
        type: STATUSES.INFO,
        closeOnClick: false,
        hideProgressBar: false,
        onClick: async () => {
          process.env.REACT_APP_KDA_NETWORK_TYPE !== 'development' &&
            window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${reqKey}`, '_blank', 'noopener,noreferrer');
        },
      });
      setToastNotificationsId((prev) => [...prev, reqKey]);
    }
  };

  //Show and store the Error Notification
  const showErrorNotification = async (reqKey, title, message = null) => {
    if (reqKey) {
      toast.dismiss(reqKey);
    }
    setIsCompletedNotification(reqKey);
    storeNotification({
      type: STATUSES.ERROR,
      date: moment().format('DD/MM/YYYY - HH:mm:ss'),
      title: title || 'Transaction Error!',
      description: message || 'Check it out in the block explorer',
      link:
        process.env.REACT_APP_KDA_NETWORK_TYPE !== 'development' && reqKey
          ? `https://explorer.chainweb.com/${NETWORK_TYPE}/txdetail/${reqKey}`
          : null,
      isRead: false,
    });
    // open the toast FAILURE message
    showNotification({
      toastId: reqKey || genRandomString(),
      title: title || 'Transaction Error!',
      message: message || 'Check it out in the block explorer',
      type: STATUSES.ERROR,
      onClick: async () => {
        process.env.REACT_APP_KDA_NETWORK_TYPE !== 'development' &&
          reqKey &&
          window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/txdetail/${reqKey}`, '_blank', 'noopener,noreferrer');
      },
      autoClose: 10000,
    });
    await removeToastNotificationId(reqKey);
  };

  //Show and store the Success Notification
  const showSuccessNotification = async (reqKey, title, message = null) => {
    if (reqKey) {
      toast.dismiss(reqKey);
    }
    setIsCompletedNotification(reqKey);

    storeNotification({
      type: STATUSES.SUCCESS,
      date: moment().format('DD/MM/YYYY - HH:mm:ss'),
      title: title || 'Transaction Success!',
      description: message || 'Check it out in the block explorer',
      link: process.env.REACT_APP_KDA_NETWORK_TYPE !== 'development' ? `https://explorer.chainweb.com/${NETWORK_TYPE}/txdetail/${reqKey}` : null,
      isRead: false,
    });
    // open the toast SUCCESS message
    showNotification({
      toastId: reqKey || genRandomString(),
      title: title || 'Transaction Success!',
      message: message || 'Check it out in the block explorer',
      type: STATUSES.SUCCESS,
      onClick: async () => {
        process.env.REACT_APP_KDA_NETWORK_TYPE !== 'development' &&
          window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/txdetail/${reqKey}`, '_blank', 'noopener,noreferrer');
      },
      autoClose: 10000,
    });
    await removeToastNotificationId(reqKey);
  };

  /* Generic listener of a transaction. The main input to work is the request key.
     If you want, pass successTitle and erroTitle in order to customize the message notification.
     Default messages are 'Transaction Success!' and 'Transaction Error!'
  */
  const transactionListen = async (reqKey, successTitle, errorTitle) => {
    const pollRes = await listen(reqKey);
    if (pollRes?.result?.status === 'success') {
      setFetchAccountBalance(true);
      successTitle ? showSuccessNotification(reqKey, successTitle) : showSuccessNotification(reqKey);
    } else {
      setFetchAccountBalance(true);
      errorTitle ? showErrorNotification(reqKey, errorTitle) : showErrorNotification(reqKey);
    }
    return pollRes;
  };

  useEffect(() => {
    if (!notificationNotCompletedChecked && account.account) {
      const pendingNotification = notificationList.filter((notif) => notif.type === 'info' && notif.isCompleted === false);
      pendingNotification.forEach((pendingNotif) => transactionListen(pendingNotif.description));

      setNotificationNotCompletedChecked(true);
    }
  }, [account.account]);

  return (
    <NotificationContext.Provider
      value={{
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
        transactionListen,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const NotificationConsumer = NotificationContext.Consumer;
