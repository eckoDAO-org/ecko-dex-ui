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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: calc(100% - 200px);
  color: #fff;
  overflow: auto;
  overflow-y: hidden;
`;

const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  margin: 10px 10px 0 10px;
  z-index: 1;
  padding: 10px;
`;

const RightModalContent = () => {
  const notification = useContext(NotificationContext);
  console.log(
    '🚀 ~ file: RightModalContent.js ~ line 40 ~ RightModalContent ~ notification',
    notification.notificationList
  );

  return (
    <ModalContainer>
      <Content>
        {notification.notificationList?.map((notif, index) => (
          <NotificationCard
            key={index}
            index={index}
            type={notif?.type}
            time={notif?.time}
            date={notif?.date}
            title={notif?.title}
            description={notif?.description}
            removeItem={notification?.removeItem}
            link={notif?.link}
          />
        ))}
        {/* <Button
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
          Set Notification Error
        </Button>
        <Button
          onClick={() => {
            notification.storeNotification({
              type: 'success',
              time: '10:16:24',
              date: '08/10/2021',
              title: 'Transfer Success',
              description: ' cfvnajeovfpanwufèsdaovnè',
            });
          }}
        >
          Set Notification Success
        </Button>
        <Button
          onClick={() => {
            notification.storeNotification({
              type: 'info',
              time: '10:16:25',
              date: '08/10/2021',
              title: 'Transfer Success',
              description: ' cfvnajeovfpanwufèsdaovnè',
            });
          }}
        >
          Set Notification info
        </Button>{' '}
        <Button
          onClick={() => {
            notification.storeNotification({
              type: 'warning',
              time: '10:16:26',
              date: '08/10/2021',
              title: 'Transfer Success',
              description: ' cfvnajeovfpanwufèsdaovnè',
            });
          }}
        >
          Set Notification Warning
        </Button> */}
      </Content>
    </ModalContainer>
  );
};

export default RightModalContent;
