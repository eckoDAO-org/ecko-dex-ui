import React, { useContext, useRef } from 'react';
import styled from 'styled-components/macro';
import { CloseIcon } from '../../assets';
import { NotificationContext } from '../../contexts/NotificationContext';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import NotificationCard from './NotificationCard';

const Container = styled.div`
  position: fixed;
  background: #4c125a;
  top: 0;
  right: 0;
  width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme: { colors }, color }) => color || colors.primaryColor};
  box-shadow: ${({ theme }) => theme.boxShadow};
  transition: width 0.3s, transform 0.3s;
  z-index: 15;
  transform: ${({ open, right }) => (open ? 'translateX(0)' : 'translateX(+200%)')};

  scrollbar-width: none;
  ::-webkit-scrollbar {
    width: 0px;
  }

  width: ${({ open, theme }) => (open ? '335' : '0')}px;
  transform: translateX(0);
`;

const ContentContainer = styled.div`
  height: ${({ theme: { header, breadcrumbHeight = 0, footer } }) => `calc(100% - ${header.height + breadcrumbHeight + footer.modalFooter}px)`};
  overflow: auto;
  z-index: 1;
  overflow-x: hidden;
`;

const Title = styled.div`
  font-size: 16px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  color: ${({ theme: { colors } }) => colors.white};
  margin-left: 10px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
  padding: 10px 22px 10px 26px;
  color: ${({ theme: { colors } }) => colors.white};
  min-height: 56px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  font-size: 16px;
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
  /* margin: 10px 10px 0 10px; */
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
  overflow-y: hidden;
  flex: 1;
`;

const NotificationModal = ({
  open,
  onClose,
  title,
  children,
  content,
  containerStyle,
  titleStyle,
  contentStyle,
  customIcon,
  removeIcon,
  width,
  mountNode,
  duration,
  disableBackdrop,
  headerStyle,
  showHeader,
  footerButton,
}) => {
  const notification = useContext(NotificationContext);

  const ref = useRef();
  useOnClickOutside(ref, () => onClose());

  return (
    <Container ref={ref} open={open} right={window.innerWidth}>
      {/* <DrawerButton
        open={open}
        toggleNotificationModal={toggleNotificationModal}
        closeNotificationModal={closeNotificationModal}
        disabled={disabled}
      /> */}
      <>
        <Header style={headerStyle}>
          <Title style={titleStyle}>Notifications</Title>
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
                isHighlight={!notif?.isReaded}
                description={notif?.description}
                removeItem={notification?.removeItem}
                link={notif?.link}
              />
            );
          })}
        </Content>

        <FooterContainer>{footerButton}</FooterContainer>
      </>
    </Container>
  );
};

export default NotificationModal;
