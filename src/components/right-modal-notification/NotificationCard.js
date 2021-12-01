import React, { useState } from 'react';
import styled from 'styled-components';
import { CloseIcon, NotificationCautionBlueIcon, NotificationErrorIcon, NotificationSuccessIcon, NotificationWarningIcon } from '../../assets';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: ${({ isHighlight, typeColor }) => (isHighlight ? `4px solid ${typeColor}` : '4px solid transparent')};
  background: ${({ isHighlight, typeColor }) =>
    isHighlight ? `transparent linear-gradient(90deg, ${typeColor}1A 0%, #80621800 100%) 0% 0% no-repeat padding-box;` : 'none'};
  width: 100%;
  padding: 0px 26px;

  /* 
  transform: ${({ animation }) => (!animation ? 'translateX(0px)' : 'translateX(500px)')};
  transition: transform 1s ease-in-out; */
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

const CloseIconColumn = styled.div`
  display: flex;
  height: 100%;
  align-self: flex-start;
  svg {
    width: 7px;
    height: 7px;
  }
`;

const IconColumn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
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

const DateTimeText = styled.span`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.regular};
  font-size: 12px;
  color: grey;
`;
const Title = styled.span`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  font-size: 16px;
`;
const Description = styled.span`
  word-wrap: break-word;
  overflow-wrap: anywhere;
  line-height: 18px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.regular};
  font-size: 14px;
`;

const NotificationCard = ({ index, time, date, title, description, type, removeItem, link, isHighlight }) => {
  console.log(`Notification ${type} - ${index}`, isHighlight);
  const [animation, setAnimation] = useState(false);

  const getIconByTypeNotification = (type) => {
    switch (type) {
      case 'warning':
        return <NotificationWarningIcon />;
      case 'info':
        return <NotificationCautionBlueIcon />;
      case 'success':
        return <NotificationSuccessIcon />;

      case 'error':
        return <NotificationErrorIcon />;
      default:
        return <NotificationCautionBlueIcon />;
    }
  };

  const getColorByType = (type) => {
    switch (type) {
      case 'warning':
        return '#FFC330';
      case 'info':
        return '#3498DB';
      case 'success':
        return '#52AF52';

      case 'error':
        return '#DB2828';
      default:
        return '#3498DB';
    }
  };

  return (
    <Container
      id={`notification_card_${index}`}
      typeColor={getColorByType(type)}
      isHighlight={isHighlight}
      animation={animation}
      style={{ cursor: link && 'pointer' }}
    >
      <NotificationContainer>
        <Content>
          <IconColumn>{getIconByTypeNotification(type)}</IconColumn>
          <DescriptionColumn
            onClick={() => {
              link && window.open(link, '_blank', 'noopener,noreferrer');
            }}
          >
            <DateTimeText>{`${date} - ${time}`}</DateTimeText>
            <Title>{title}</Title>
            <Description>{description}</Description>
          </DescriptionColumn>
        </Content>
        <CloseIconColumn>
          <CloseIcon
            style={{ cursor: 'pointer' }}
            onClick={() => {
              //   setAnimation(true);
              removeItem(index);
            }}
          />
        </CloseIconColumn>
      </NotificationContainer>
    </Container>
  );
};

export default NotificationCard;
