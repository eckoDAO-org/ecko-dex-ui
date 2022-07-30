import React from 'react';
import styled from 'styled-components/macro';
import { useNotificationContext } from '../../contexts';
import { CloseIcon, NotificationCautionBlueIcon, NotificationErrorIcon, NotificationSuccessIcon, NotificationWarningIcon } from '../../assets';
import Label from '../shared/Label';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: ${({ isHighlight, typeColor }) => (isHighlight ? `4px solid ${typeColor}` : '4px solid transparent')};
  background: ${({ isHighlight, typeColor }) =>
    isHighlight ? `transparent linear-gradient(90deg, ${typeColor}1A 0%, #80621800 100%) 0% 0% no-repeat padding-box;` : 'none'};
  width: 100%;
  padding: 0px 26px;
`;

const NotificationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  color: ${({ theme: { colors } }) => colors.white};
  padding: 16px 0px;
  border-top: 1px solid #707070;
`;

const CloseIconContainer = styled.div`
  display: flex;
  height: 100%;
  justify-content: flex-end;
  align-self: flex-start;
  height: 30px;
  width: 30px;
  svg {
    width: 7px;
    height: 7px;
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const DescriptionColumn = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  & > span:not(:last-child) {
    margin-bottom: 4px;
  }
`;

const Description = styled(Label)`
  word-wrap: break-word;
  overflow-wrap: anywhere;
  line-height: 18px;
`;

const NotificationList = () => {
  const { STATUSES, notificationList, removeNotification } = useNotificationContext();

  const getIconByTypeNotification = (type) => {
    switch (type) {
      case STATUSES.WARNING:
        return <NotificationWarningIcon />;
      case STATUSES.INFO:
        return <NotificationCautionBlueIcon />;
      case STATUSES.SUCCESS:
        return <NotificationSuccessIcon />;

      case STATUSES.ERROR:
        return <NotificationErrorIcon />;
      default:
        return <NotificationCautionBlueIcon />;
    }
  };

  const getColorByType = (type) => {
    switch (type) {
      case STATUSES.WARNING:
        return '#FFC330';
      case STATUSES.INFO:
        return '#3498DB';
      case STATUSES.SUCCESS:
        return '#52AF52';

      case STATUSES.ERROR:
        return '#DB2828';
      default:
        return '#3498DB';
    }
  };

  return notificationList.map((notification, index) => {
    return (
      <Container
        id={`notification_card_${index}`}
        key={`notification_card_${index}`}
        typeColor={getColorByType(notification.type)}
        isHighlight={!notification.isRead}
        style={{ cursor: notification.link && 'pointer' }}
      >
        <NotificationContainer>
          <div className="flex align-ce">
            <div className="flex justify-fe align-ce" style={{ marginRight: 16 }}>
              {getIconByTypeNotification(notification.type)}
            </div>
            <DescriptionColumn
              onClick={() => {
                notification.link && window.open(notification.link, '_blank', 'noopener,noreferrer');
              }}
            >
              <Label outGameEditionView fontSize={12} color="grey">
                {notification.date}
              </Label>
              <Label outGameEditionView fontFamily="syncopate">
                {notification.title}
              </Label>
              <Description outGameEditionView fontSize={14}>
                {notification.description}
              </Description>
            </DescriptionColumn>
          </div>
          <CloseIconContainer>
            <CloseIcon
              className="remove-notification-icon"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                removeNotification(index);
              }}
            />
          </CloseIconContainer>
        </NotificationContainer>
      </Container>
    );
  });
};

export default NotificationList;
