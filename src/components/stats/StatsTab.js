/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import { Divider } from 'semantic-ui-react';
import styled, { css } from 'styled-components/macro';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { LightModeContext } from '../../contexts/LightModeContext';
import { PactContext } from '../../contexts/PactContext';
import GradientBorder from '../../components/shared/GradientBorder';
import LogoLoader from '../../components/shared/LogoLoader';
import { theme } from '../../styles/theme';
import { PartialScrollableScrollSection } from '../layout/Containers';
import StatsCard from './StatsCard';

export const CardContainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  max-width: 1110px;
  margin-left: auto;
  margin-right: auto;

  opacity: 1;

  ${({ gameEditionView, theme: { backgroundContainer } }) => {
    if (gameEditionView) {
      return css`
        background-color: #ffffff0d;
        border: 2px dashed #fff;
        padding: 24px;
      `;
    } else {
      return css`
        backdrop-filter: blur(50px);
        background-color: ${backgroundContainer};
        border-radius: 10px;
        padding: 32px;
        position: relative;
      `;
    }
  }}

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
