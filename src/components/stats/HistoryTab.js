import React, { useContext, useEffect } from 'react';
import { Dimmer, Divider, Input, Loader } from 'semantic-ui-react';
import styled from 'styled-components';
import tokenData from '../../constants/cryptoCurrencies';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { LightModeContext } from '../../contexts/LightModeContext';
import { PactContext } from '../../contexts/PactContext';
import CustomLabel from '../../shared/CustomLabel';
import GradientBorder from '../../shared/GradientBorder';
import ModalContainer from '../../shared/ModalContainer';
import { theme } from '../../styles/theme';
import { extractDecimal, reduceBalance } from '../../utils/reduceBalance';
import { PartialScrollableScrollSection, Title, TitleContainer } from '../layout/Containers';
import HistoryCard from './HistoryCard';
import StatsCard from './StatsCard';

const CustomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  gap: 4px 0px;
  /* 
  .ui.input {
    margin: 24px;
    color: white;
    box-shadow: -3em 0em red, -2em -1em red, -2em 1em red, 0em 1em red,
      2em 1em red, 2em 0em red, 3em 0em red, 0em -1em red, -1em 0em white,
      0em -1em white, 1em 0em white, 0em -2em white, 2em -1em red, 0em 2em red;
  } */
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
  padding: ${({ gameEditionView }) => (gameEditionView ? `10px 10px` : `32px 32px`)};
  width: 100%;
  max-width: 1110px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 10px;

  opacity: 1;
  background: ${({ gameEditionView, theme: { backgroundContainer } }) => (gameEditionView ? `transparent` : backgroundContainer)}; // or add new style
  backdrop-filter: ${({ gameEditionView }) => !gameEditionView && `blur(50px)`};

  /* &:before {
    border-radius: inherit;

  /* & > *:not(:last-child) {
    margin-right: 32px;
  } */

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
    gap: 0px;
  }
  /* 
  .ui.input {
    margin: 24px;
    color: white;
    box-shadow: -3em 0em red, -2em -1em red, -2em 1em red, 0em 1em red,
      2em 1em red, 2em 0em red, 3em 0em red, 0em -1em red, -1em 0em white,
      0em -1em white, 1em 0em white, 0em -2em white, 2em -1em red, 0em 2em red;
  } */
`;

const TitleTabs = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Tabs = styled(Title)`
  opacity: ${({ active }) => (active ? '1' : '0.4')};
  cursor: pointer;
`;

const HistoryTab = ({ activeTabs, setActiveTabs }) => {
  const pact = useContext(PactContext);
  const { gameEditionView } = useContext(GameEditionContext);
  const { themeMode } = useContext(LightModeContext);

  const fakeObjTx = {
    0: {
      reqkey: '3C8-r_p-Mrp1xTseo3Isicwq6mQGpwu-sB3AMvuJtv0',
      amount: '125',
      token0: 'KDA',
      token1: 'FLUX',
    },
    1: {
      reqkey: '5zBR4FCRRd_XpwADosD7-4TexgQu4Wwu3a2vtFbBMCQ',
      amount: '1000',
      token0: 'FLUX',
      token1: 'KDA',
    },
    2: {
      reqkey: '5zBR4FCRRd_XpwADosD7-4TexgQu4Wwu3a2vtFbBMCQ',
      amount: '1000',
      token0: 'FLUX',
      token1: 'KDA',
    },
    3: {
      reqkey: '5zBR4FCRRd_XpwADosD7-4TexgQu4Wwu3a2vtFbBMCQ',
      amount: '1000',
      token0: 'FLUX',
      token1: 'KDA',
    },
    4: {
      reqkey: '5zBR4FCRRd_XpwADosD7-4TexgQu4Wwu3a2vtFbBMCQ',
      amount: '1000',
      token0: 'FLUX',
      token1: 'KDA',
    },
    5: {
      reqkey: '5zBR4FCRRd_XpwADosD7-4TexgQu4Wwu3a2vtFbBMCQ',
      amount: '1000',
      token0: 'FLUX',
      token1: 'KDA',
    },
    6: {
      reqkey: '5zBR4FCRRd_XpwADosD7-4TexgQu4Wwu3a2vtFbBMCQ',
      amount: '1000',
      token0: 'FLUX',
      token1: 'KDA',
    },
  };

  useEffect(async () => {
    await pact.getPairList();
  }, []);

  return gameEditionView ? (
    <ModalContainer
      title="stats"
      // {
      //   <TitleTabs>
      //     <Tabs>Stats</Tabs>
      //     <Tabs>History</Tabs>
      //   </TitleTabs>
      // }
      containerStyle={{
        maxHeight: '80vh',
        maxWidth: 650,
      }}
    >
      <PartialScrollableScrollSection>
        {/* {pact.pairList[0] ? (
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
        )} */}
      </PartialScrollableScrollSection>
    </ModalContainer>
  ) : (
    //DESKTOP
    <ModalContainer
      title={gameEditionView && 'Stats'}
      withoutRainbowBackground
      backgroundNotChangebleWithTheme
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
            justifyContent: 'space-between',
          }}
        >
          <Tabs gameEditionView={gameEditionView} active={activeTabs === 'POOL_STATS'} onClick={setActiveTabs}>
            Stats
          </Tabs>
          <Tabs gameEditionView={gameEditionView} active={activeTabs === 'HISTORY'}>
            History
          </Tabs>
        </TitleContainer>
      )}
      <PartialScrollableScrollSection className="scrollbar-none">
        <CardContainer gameEditionView={gameEditionView}>
          {!gameEditionView && <GradientBorder />}

          {pact.swapList !== [] ? (
            !pact.swapList?.error ? (
              pact.swapList?.map((tx, index) => (
                <>
                  <HistoryCard tx={tx} />
                  {pact.swapList?.length - 1 !== index && (
                    <Divider
                      style={{
                        width: '100%',
                        margin: '32px 0px',
                        borderTop: gameEditionView ? `1px dashed ${theme(themeMode).colors.black}` : `1px solid  ${theme(themeMode).colors.white}`,
                      }}
                    />
                  )}
                </>
              ))
            ) : (
              <>{pact.swapList?.error}</>
            )
          ) : (
            <div style={{ padding: '16px' }}>
              <Loader
                active
                style={{
                  color: gameEditionView ? theme(themeMode).colors.black : theme(themeMode).colors.white,
                  fontFamily: gameEditionView ? theme(themeMode).fontFamily.pressStartRegular : theme(themeMode).fontFamily.regular,
                }}
              >
                Loading..
              </Loader>
            </div>
          )}
        </CardContainer>
      </PartialScrollableScrollSection>
    </ModalContainer>
  );
};

export default HistoryTab;
