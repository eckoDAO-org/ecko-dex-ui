import React from 'react';
import styled from 'styled-components/macro';

const Container = styled.div`
  display: flex;
  & > div:not(:last-child) {
    margin-right: 8px;
  }
`;

const LoaderContainer = styled.div`
  height: 50px;
  width: 14px;
  background: ${({ color }) => color};
  -webkit-animation-delay: ${({ delay = 0 }) => delay}s !important;
  animation: load 0.8s infinite;
  @-webkit-keyframes load {
    0%,
    80%,
    100% {
      background: ${({ color }) => color};

      height: 4em;
    }
    40% {
      background: ${({ color }) => color};

      height: 7em;
    }
  }
  @keyframes load {
    0%,
    80%,
    100% {
      background: ${({ color }) => color};

      height: 4em;
    }
    40% {
      background: ${({ color }) => color};

      height: 7em;
    }
  }
`;

export const AppLoader = ({ containerStyle, color }) => {
  return (
    <Container style={containerStyle}>
      <LoaderContainer color={color || '#22274D'} />
      <LoaderContainer color={color || '#22274D'} delay={0.1} />
      <LoaderContainer color={color || '#22274D'} delay={0.2} />
    </Container>
  );
};

export default AppLoader;
