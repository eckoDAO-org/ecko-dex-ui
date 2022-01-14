import React from 'react';
import NotificationContent from './NotificationContent';

const NotificationContainer = ({ type, message, title, icon, titleStyle }) => {
  switch (type) {
    case 'default':
      return <NotificationContent icon={icon} message={message} type={type} title={title} titleStyle={titleStyle} />;
    case 'success':
      return <NotificationContent icon={icon} message={message} type={type} title={title} titleStyle={titleStyle} />;
    case 'warning':
      return <NotificationContent icon={icon} message={message} type={type} title={title} titleStyle={titleStyle} />;
    case 'dark':
      return <NotificationContent icon={icon} message={message} type={type} title={title} titleStyle={titleStyle} />;
    case 'error':
      return <NotificationContent icon={icon} message={message} type={type} title={title} titleStyle={titleStyle} />;
    case 'info':
      return <NotificationContent icon={icon} message={message} type={type} title={title} titleStyle={titleStyle} />;
    default:
      return <NotificationContent icon={icon} message={message} type={type} title={title} titleStyle={titleStyle} />;
  }
};

export default NotificationContainer;
