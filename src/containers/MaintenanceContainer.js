import React from 'react';
import styled from 'styled-components';
import { KaddexLogo } from '../assets';

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
      <KaddexLogo style={{ marginBottom: 32 }} />
      <span style={{ fontSize: '16px' }}>We are almost there, Kaddex v1 will launch at 14:00 UTC on August 1st.</span>
      <span style={{ fontSize: '16px', marginTop: 12 }}>
        In the meantime, you can always trade here:{' '}
        <span
          style={{ cursor: 'pointer' }}
          onClick={(item) => {
            window.open(`https://beta.kaddex.com`, '_blank', 'noopener,noreferrer');
          }}
        >
          https://beta.kaddex.com
        </span>
      </span>
    </Container>
  );
};

export default MaintenanceContainer;
