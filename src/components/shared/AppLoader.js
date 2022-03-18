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
  background: ${({ color, theme: { colors } }) => color || colors.white};
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

export const AppLoader = ({ className, containerStyle, color }) => {
  return (
    <Container className={className} style={containerStyle}>
      <LoaderContainer color={color} />
      <LoaderContainer color={color} delay={0.1} />
      <LoaderContainer color={color} delay={0.2} />
    </Container>
  );
};

export default AppLoader;
