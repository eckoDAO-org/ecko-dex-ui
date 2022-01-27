import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { NotificationContext } from '../../contexts/NotificationContext';
import NotificationCard from './NotificationCard';

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme: colors }) => colors.white};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: calc(100% - 200px);
  color: ${({ theme: colors }) => colors.white};
  overflow: auto;
  overflow-y: hidden;
`;

const RightModalContent = () => {
  const notification = useContext(NotificationContext);

  return (
    <ModalContainer>
      <Content>
        {[...notification.notificationList]?.reverse().map((notif, index) => {
          return (
            <NotificationCard
              key={index}
              index={index}
              type={notif?.type}
              time={notif?.time}
              date={notif?.date}
              title={notif?.title}
              isHighlight={!notif?.isReaded}
              description={notif?.description}
              removeItem={notification?.removeItem}
              link={notif?.link}
            />
          );
        })}
      </Content>
    </ModalContainer>
  );
};

export default RightModalContent;
