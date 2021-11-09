import React, { useContext } from 'react';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components';
import { NotificationContext } from '../../contexts/NotificationContext';
import NotificationCard from './NotificationCard';

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
`;

const RightModalContent = () => {
  const notification = useContext(NotificationContext);
  console.log(
    '🚀 ~ file: RightModalContent.js ~ line 18 ~ RightModalContent ~ notification',
    notification.notificationList
  );
  return (
    <ModalContainer>
      {notification.notificationList?.map((notif, index) => (
        <NotificationCard
          type={notif.type}
          time={notif.time}
          date={notif.date}
          title={notif.title}
          description={notif.description}
        />
      ))}
      <Button
        onClick={() => {
          notification.storeNotification({
            type: 'error',
            time: '10:16:23',
            date: '08/10/2021',
            title: 'Transfer Success',
            description:
              'sdnsjofnpowev fnoaprvfn onvnoerfnoasnfanwrpo nvfqwnjefopaewfnaoefpn cfvnajeovfpanwufèsdaovnè',
          });
        }}
      >
        Set Notification
      </Button>
    </ModalContainer>
  );
};

export default RightModalContent;
