import React from 'react';
import styled from 'styled-components/macro';
import theme from '../../styles/theme';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Text = styled.span`
  margin-left: 16px;

  font-size: 16px;
  font-family: ${({ fontWeight }) => (fontWeight ? theme.fontFamily.syncopate : theme.fontFamily.basier)};
`;

const capitalizeFirstLetter = (string) => {
  return typeof string === 'string' ? string.charAt(0).toUpperCase() + string.slice(1) : null;
};

const NotificationContent = ({ icon, type, message, title, titleStyle }) => {
  return (
    <Container>
      {icon}
      <TextContainer className={type}>
        <Text fontWeight="bold" style={titleStyle}>
          {capitalizeFirstLetter(title) || capitalizeFirstLetter(type)}
        </Text>
        <Text>{capitalizeFirstLetter(message)}</Text>
      </TextContainer>
    </Container>
  );
};

export default NotificationContent;
