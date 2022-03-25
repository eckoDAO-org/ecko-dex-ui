import React from 'react';
import styled from 'styled-components/macro';
import { NotificationIcon } from '../../assets';

const Container = styled.div`
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const NotificationContainer = styled.div`
  position: relative;
  display: flex;
`;

const NotificationSignal = styled.div`
  cursor: pointer;
  height: 5px;
  width: 5px;
  border-radius: 50%;
  background-color: ${({ theme: { colors } }) => colors.error};
  position: absolute;
  top: -5px;
  left: -3px;
`;

const Notification = ({ hasNotification, containerStyle, color, onClick }) => {
  return (
    <Container onClick={onClick} style={containerStyle} color={color}>
      <NotificationContainer>
        {hasNotification && <NotificationSignal />}
        <NotificationIcon />
      </NotificationContainer>
    </Container>
  );
};

export default Notification;
