import React, { useContext, useRef } from 'react';
import styled from 'styled-components/macro';
import { CloseIcon } from '../../assets';
import { NotificationContext } from '../../contexts/NotificationContext';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import CustomButton from '../shared/CustomButton';
import Label from '../shared/Label';
import NotificationCard from './NotificationCard';
const Container = styled.div`
  width: 335px;
  position: fixed;
  background: ${({ theme: { colors } }) => colors.primary};
  box-shadow: -10px 0px 40px #0f054c3d;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  flex-direction: column;

  transition: width 0.3s, transform 0.3s;
  z-index: 15;
  transform: ${({ open, right }) => (open ? 'translateX(0)' : 'translateX(+200%)')};

  scrollbar-width: none;
  ::-webkit-scrollbar {
    width: 0px;
  }
  scrollbar-width: none;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;
  z-index: 2;
  padding: 10px 22px 10px 26px;
  color: ${({ theme: { colors } }) => colors.white};
  min-height: 56px;
  border-radius: 0px !important;
  box-shadow: ${({ theme }) => theme.boxShadow};
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const IconContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  width: 20px;
  cursor: pointer;
`;

const FooterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  z-index: 1;
  padding: 16px 26px;
  & > * {
    width: 200px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  color: ${({ theme: colors }) => colors.white};
  overflow: auto;
  flex: 1;
`;

const NotificationModal = ({ open, onClose, customIcon, removeIcon, headerStyle, footerButton }) => {
  const notification = useContext(NotificationContext);

  const ref = useRef();
  useOnClickOutside(ref, () => open && onClose());

  return (
    <Container ref={ref} open={open} right={window.innerWidth}>
      <>
        <Header style={headerStyle}>
          <Label fontFamily="syncopate" labelStyle={{ marginLeft: 10 }}>
            Notifications
          </Label>
          <IconContainer onClick={onClose}>{!removeIcon && (customIcon || <CloseIcon style={{ height: 10, width: 10 }} />)}</IconContainer>
        </Header>

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
                isHighlight={!notif?.isRead}
                description={notif?.description}
                removeItem={notification?.removeItem}
                link={notif?.link}
              />
            );
          })}
        </Content>

        <FooterContainer>
          <CustomButton
            onClick={() => {
              notification.removeAllItem();
            }}
            fontSize="12px"
            buttonStyle={{ width: '100%' }}
            outGameEditionView
          >
            Remove All Notification
          </CustomButton>
        </FooterContainer>
      </>
    </Container>
  );
};

export default NotificationModal;
