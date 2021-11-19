import React, { useContext, useEffect } from 'react';
import { Dimmer, Divider, Loader } from 'semantic-ui-react';
import styled from 'styled-components';
import tokenData from '../../constants/cryptoCurrencies';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { LightModeContext } from '../../contexts/LightModeContext';
import { PactContext } from '../../contexts/PactContext';
import CustomLabel from '../../shared/CustomLabel';
import ModalContainer from '../../shared/ModalContainer';
import { theme } from '../../styles/theme';
import { extractDecimal, reduceBalance } from '../../utils/reduceBalance';
import {
  PartialScrollableScrollSection,
  Title,
  TitleContainer,
} from '../layout/Containers';
import StatsCard from './StatsCard';

const CustomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  gap: 4px 0px;
`;
const IconsContainer = styled.div`
  display: flex;
  justify-content: flex-start;

  svg:first-child {
    z-index: 2;
  }
  div:last-child {
    margin-right: 5px;
  }
`;

export const CardContainer = styled.div`
  position: ${({ gameEditionView }) => !gameEditionView && `relative`};
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: ${({ gameEditionView }) =>
    gameEditionView ? `10px 10px` : `32px 32px`};
  width: 100%;
  max-width: 1110px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 10px;
  border: ${({ theme: { colors }, gameEditionView }) =>
    gameEditionView ? `none` : ` 2px solid ${colors.white}29`};

  background-clip: ${({ gameEditionView }) =>
    !gameEditionView && `padding-box`};

  opacity: 1;
  background: ${({ gameEditionView }) =>
    gameEditionView ? `transparent` : `transparent`}; // or add new style

  /* &:before {
    border-radius: inherit;

  /* & > *:not(:last-child) {
    margin-right: 32px;
  } */

  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
    gap: 0px;
  }
`;

const StatsTab = () => {
  const pact = useContext(PactContext);
  const { gameEditionView } = useContext(GameEditionContext);
  const { themeMode } = useContext(LightModeContext);

  useEffect(async () => {
    await pact.getPairList();
  }, []);

  return gameEditionView ? (
    <ModalContainer
      title='pool stats'
      containerStyle={{
        maxHeight: '80vh',
        maxWidth: 650,
      }}
    >
      <PartialScrollableScrollSection>
        {pact.pairList[0] ? (
          Object.values(pact.pairList).map((pair) =>
            pair && pair.reserves ? (
              <CustomGrid>
                <CustomLabel bold>Name</CustomLabel>
                {gameEditionView ? (
                  <CustomLabel
                    start
                  >{`${pair.token0}/${pair.token1}`}</CustomLabel>
                ) : (
                  <IconsContainer>
                    {tokenData[pair.token0].icon}
                    {tokenData[pair.token1].icon}
                    <CustomLabel>{`${pair.token0}/${pair.token1}`}</CustomLabel>
                  </IconsContainer>
                )}
                <CustomLabel bold>token0</CustomLabel>
                <CustomLabel start>
                  {reduceBalance(pair.reserves[0])}
                </CustomLabel>
                <CustomLabel bold>token1</CustomLabel>
                <CustomLabel start>
                  {reduceBalance(pair.reserves[1])}
                </CustomLabel>
                <CustomLabel bold>Rate</CustomLabel>
                <CustomLabel start>{`${reduceBalance(
                  extractDecimal(pair.reserves[0]) /
                    extractDecimal(pair.reserves[1])
                )} ${pair.token0}/${pair.token1}`}</CustomLabel>
              </CustomGrid>
            ) : (
              ''
            )
          )
        ) : (
          // <Dimmer active inverted={gameEditionView}>
          <Loader
            style={{
              color: gameEditionView
                ? theme(themeMode).colors.black
                : theme(themeMode).colors.white,
              fontFamily: gameEditionView
                ? theme(themeMode).fontFamily.pressStartRegular
                : theme(themeMode).fontFamily.regular,
            }}
          >
            Loading
          </Loader>
          // </Dimmer>
        )}
      </PartialScrollableScrollSection>
    </ModalContainer>
  ) : (
    //DESKTOP
    <ModalContainer
      title={gameEditionView && 'Stats'}
      withoutRainbowBackground
      containerStyle={{
        maxHeight: '80vh',
        padding: 0,
      }}
    >
      {!gameEditionView && (
        <TitleContainer
          gameEditionView={gameEditionView}
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: '1110px',
            justifyContent: 'flex-start',
          }}
        >
          <Title gameEditionView={gameEditionView}>Stats</Title>
        </TitleContainer>
      )}
      <PartialScrollableScrollSection>
        <CardContainer gameEditionView={gameEditionView}>
          {pact.pairList[0] ? (
            Object.values(pact.pairList).map((pair, index) =>
              pair && pair.reserves ? (
                <>
                  <StatsCard pair={pair} />
                  {!Object.values(pact.pairList).length === index && (
                    <Divider
                      style={{
                        width: '100%',
                        margin: '20px 0px',
                        borderTop: gameEditionView
                          ? `1px dashed ${theme(themeMode).colors.black}`
                          : `1px solid  ${theme(themeMode).colors.white}`,
                      }}
                    />
                  )}
                </>
              ) : (
                ''
              )
            )
          ) : (
            <Dimmer
              active
              inverted={gameEditionView}
              style={{ background: !gameEditionView && 'transparent' }}
            >
              <Loader
                style={{
                  color: gameEditionView
                    ? theme(themeMode).colors.black
                    : theme(themeMode).colors.white,
                  fontFamily: gameEditionView
                    ? theme(themeMode).fontFamily.pressStartRegular
                    : theme(themeMode).fontFamily.regular,
                }}
              >
                Loading..
              </Loader>
            </Dimmer>
          )}
        </CardContainer>
      </PartialScrollableScrollSection>
    </ModalContainer>
  );
};

export default StatsTab;
