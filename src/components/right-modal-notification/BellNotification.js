import React, { useState } from 'react';
// import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components/macro';
import { NotificationIcon } from '../../assets';

const Container = styled.div`
  cursor: pointer;
  svg {
    path {
      fill: ${({ color }) => color};
    }
  }
`;

const NotificationContainer = styled.div`
  position: relative;
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

const Notification = ({
  hasNotification,
  containerStyle,
  items,
  color,
  onClick,
}) => {
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  const onContainerClick = () => {
    setShowFloatingMenu((prev) => !prev);
  };

  return (
    <Container onClick={onClick} style={containerStyle} color={color}>
      {/* <OutsideClickHandler
        onOutsideClick={() => {
          setShowFloatingMenu(false);
        }}
      > */}
      <NotificationContainer>
        {hasNotification && <NotificationSignal />}
        <NotificationIcon />
      </NotificationContainer>
      {/* </OutsideClickHandler> */}
    </Container>
  );
};

export default Notification;
