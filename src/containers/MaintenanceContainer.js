import React from 'react';
import styled from 'styled-components';
import { EckoDexLogo } from '../assets';

const Container = styled.div`
  margin: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  line-height: inherit;
  overflow: auto;
  min-width: 0;
  justify-content: center;
  align-items: center;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.basier};
  color: ${({ theme: { colors } }) => colors.white};
  background: ${({ theme: { backgroundBody } }) => backgroundBody};

  opacity: 1;
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
`;

const MaintenanceContainer = () => {
  return (
    <Container>
      <EckoDexLogo style={{ marginBottom: 32 }} />
      <span style={{ fontSize: '16px', textAlign: 'center' }}>The platform is temporarily on maintenance. Please check back soon.</span>
    </Container>
  );
};

export default MaintenanceContainer;
