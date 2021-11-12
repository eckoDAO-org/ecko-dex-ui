import React, { useEffect, useState } from 'react';
import { Divider } from 'semantic-ui-react';
import styled from 'styled-components';
import {
  CloseIcon,
  NotificationCautionBlueIcon,
  NotificationErrorIcon,
  NotificationSuccessIcon,
  NotificationWarningIcon,
} from '../../assets';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: ${({ isHover, typeColor }) =>
    isHover ? `4px solid ${typeColor}` : '4px solid transparent'};
  background: ${({ isHover, typeColor }) =>
    isHover
      ? `transparent linear-gradient(90deg, ${typeColor}1A 0%, #80621800 100%) 0% 0% no-repeat padding-box;`
      : 'none'};
  width: 100%;
  height: 100%;
  /* 
  transform: ${({ animation }) =>
    !animation ? 'translateX(0px)' : 'translateX(500px)'};
  transition: transform 1s ease-in-out; */
`;

const NotificationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 100%;
  color: #fff;
  padding: 16px 26px;
`;

const CustomDivider = styled(Divider)`
  background-color: #707070;
  width: 80%;
  margin: 0px !important;
  border-bottom: 0px !important;
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
  svg {
    width: 40px;
    height: 40px;
  }
`;

const DescriptionColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  max-width: 200px;
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
  font-family: ${({ theme: { fontFamily } }) => fontFamily.regular};
  font-size: 14px;
`;

const NotificationCard = ({
  index,
  time,
  date,
  title,
  description,
  type,
  removeItem,
  link,
}) => {
  const [isHover, setIsHover] = useState(false);
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

  //   useEffect(() => {
  //     if (animation) {
  //       const timer = setTimeout(async () => {
  //         await removeItem(index);
  //       }, 1000);
  //       return () => {
  //         setAnimation(false);

  //         clearTimeout(timer);
  //       };
  //     }
  //   }, [animation]);

  return (
    <Container
      id={`notification_card_${index}`}
      isHover={isHover}
      typeColor={getColorByType(type)}
      onMouseOver={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
      animation={animation}
      style={{ cursor: link && 'pointer' }}
    >
      <CustomDivider />
      <NotificationContainer>
        <IconColumn>{getIconByTypeNotification(type)}</IconColumn>
        <DescriptionColumn
          onClick={async () => {
            link && (await window.open(link, '_blank', 'noopener,noreferrer'));
          }}
        >
          <DateTimeText>{`${date} - ${time}`}</DateTimeText>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </DescriptionColumn>
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
