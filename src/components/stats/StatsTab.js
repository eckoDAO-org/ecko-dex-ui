/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import { Divider } from 'semantic-ui-react';
import axios from 'axios';
import styled, { css } from 'styled-components/macro';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { PactContext } from '../../contexts/PactContext';
import GradientBorder from '../../components/shared/GradientBorder';
import LogoLoader from '../shared/Loader';
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
  const { themeMode } = useContext(ApplicationContext);

  useEffect(async () => {
    await pact.getPairList();
    await getTVL();
  }, []);

  const kdaPrice = 6.7;
  const fluxPrice = 0.293426;

  const getTVL = async () => {
    let totalTVL = 0;
    if (Array.isArray(pact?.pairList)) {
      const allTokenNames = pact?.pairList?.flatMap((pair) => [pair.token0, pair.token1]);
      // axios
      //   .get(`https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=kadena,${allTokenNames.join(',')}`)
      //   .then((res) => {
      for (const pair of pact.pairList) {
        const token0Balance = Number(pair.reserves[0]?.decimal) || pair.reserves[0] || 0;
        const token1Balance = Number(pair.reserves[1]?.decimal) || pair.reserves[1] || 0;

        let token0USD = token0Balance * kdaPrice;
        let token1USD = token1Balance * fluxPrice;
        totalTVL += token0USD += token1USD;
      }
      console.log('!!! ~ USD TVL', totalTVL);
      // })
      // .catch((err) => console.log('get usd price error, err'));
    }
  };

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
