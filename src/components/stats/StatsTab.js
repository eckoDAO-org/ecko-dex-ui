/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import { Divider } from 'semantic-ui-react';
import styled from 'styled-components/macro';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { LightModeContext } from '../../contexts/LightModeContext';
import { PactContext } from '../../contexts/PactContext';
import GradientBorder from '../../components/shared/GradientBorder';
import LogoLoader from '../../components/shared/LogoLoader';
import { theme } from '../../styles/theme';
import { PartialScrollableScrollSection } from '../layout/Containers';
import StatsCard from './StatsCard';

export const CardContainer = styled.div`
  position: ${({ gameEditionView }) => !gameEditionView && `relative`};
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: ${({ gameEditionView }) => (gameEditionView ? `24px` : `32px `)};
  width: 100%;
  max-width: 1110px;
  margin-left: auto;
  margin-right: auto;
  border-radius: ${({ gameEditionView }) => !gameEditionView && `10px`};

  opacity: 1;
  background: ${({ gameEditionView, theme: { backgroundContainer } }) => (gameEditionView ? `transparent` : backgroundContainer)}; // or add new style
  backdrop-filter: ${({ gameEditionView }) => !gameEditionView && `blur(50px)`};
  border: ${({ gameEditionView, theme: { colors } }) => gameEditionView && `2px dashed #ffffff`};

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    padding: ${({ gameEditionView }) => gameEditionView && `12px`};
    flex-flow: column;
    gap: 0px;
  }
`;

const StatsTab = ({ activeTabs, setActiveTabs }) => {
  const pact = useContext(PactContext);
  const { gameEditionView } = useContext(GameEditionContext);
  const { themeMode } = useContext(LightModeContext);

  useEffect(async () => {
    await pact.getPairList();
  }, []);

  return (
    <CardContainer gameEditionView={gameEditionView}>
      {!gameEditionView && <GradientBorder />}
      <PartialScrollableScrollSection style={{ width: '100%' }} className="scrollbar-none">
        {pact.pairList[0] ? (
          Object.values(pact.pairList).map(
            (pair, index) =>
              pair &&
              pair.reserves && (
                <div key={index}>
                  <StatsCard pair={pair} key={index} />
                  {Object.values(pact.pairList).length - 1 !== index && (
                    <Divider
                      style={{
                        width: '100%',
                        margin: '32px 0px',
                        borderTop: gameEditionView ? `2px dashed ${theme(themeMode).colors.black}` : `1px solid  ${theme(themeMode).colors.white}`,
                      }}
                    />
                  )}
                </div>
              )
          )
        ) : (
          <LogoLoader />
        )}
      </PartialScrollableScrollSection>
    </CardContainer>
  );
};

export default StatsTab;
