import React from 'react';
import styled from 'styled-components/macro';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  margin: 16px 0px;
`;

const Button = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  width: 32px;
  height: 32px;
  padding: 0;
  margin: 0;
  background: transparent;
  svg path.a {
    fill: #fff;
  }
`;

const ButtonDivider = ({ icon, containerStyle, buttonStyle, onClick }) => {
  return (
    <Container style={containerStyle}>
      <Button style={buttonStyle} onClick={onClick}>
        {icon}
      </Button>
    </Container>
  );
};

export default ButtonDivider;
