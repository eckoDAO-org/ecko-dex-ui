import React, { useContext, useEffect } from 'react';
import { Divider, Loader } from 'semantic-ui-react';
import styled from 'styled-components';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { LightModeContext } from '../../contexts/LightModeContext';
import { PactContext } from '../../contexts/PactContext';
import GradientBorder from '../../shared/GradientBorder';
import ModalContainer from '../../shared/ModalContainer';
import { theme } from '../../styles/theme';
import { Label, PartialScrollableScrollSection, Title, TitleContainer } from '../layout/Containers';
import HistoryCard from './HistoryCard';

export const CardContainer = styled.div`
  position: ${({ gameEditionView }) => !gameEditionView && `relative`};
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: ${({ gameEditionView }) => (gameEditionView ? `24px ` : `32px `)};
  width: 100%;
  max-width: 1110px;
  max-height: ${({ gameEditionView }) => (gameEditionView ? `40vh` : `550px`)};
  margin-left: auto;
  margin-right: auto;
  border-radius: 10px;
  border: ${({ gameEditionView, theme: { colors } }) => gameEditionView && `1px dashed ${colors.black}`};

  opacity: 1;
  background: ${({ gameEditionView, theme: { backgroundContainer } }) => (gameEditionView ? `transparent` : backgroundContainer)}; // or add new style
  backdrop-filter: ${({ gameEditionView }) => !gameEditionView && `blur(50px)`};

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
    gap: 0px;
  }
`;

const Tabs = styled(Title)`
  opacity: ${({ active }) => (active ? '1' : '0.4')};
  cursor: pointer;
`;

const HistoryTab = ({ activeTabs, setActiveTabs }) => {
  const pact = useContext(PactContext);
  const { gameEditionView } = useContext(GameEditionContext);
  const { themeMode } = useContext(LightModeContext);

  useEffect(async () => {
    await pact.getPairList();
  }, []);

  return (
    <ModalContainer
      withoutRainbowBackground
      backgroundNotChangebleWithTheme
      containerStyle={{
        maxHeight: !gameEditionView && '80vh',
        height: gameEditionView && '100%',
        padding: gameEditionView ? 24 : 0,
        border: gameEditionView && '1px solid transparent',
      }}
    >
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
      <CardContainer gameEditionView={gameEditionView}>
        {!gameEditionView && <GradientBorder />}
        <PartialScrollableScrollSection className="scrollbar-none" style={{ width: '100%' }}>
          {!pact.swapList?.error ? (
            pact.swapList[0] ? (
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
            )
          ) : (
            <Label>{pact.swapList?.error} </Label>
          )}
        </PartialScrollableScrollSection>
      </CardContainer>
    </ModalContainer>
  );
};

export default HistoryTab;

//LOADER

{
  /* <div style={{ padding: '16px' }}>
<Loader
  active
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
</div> */
}

// MAP
// pact.swapList?.map((tx, index) => (
//   <>
//     <HistoryCard tx={tx} />
//     {pact.swapList?.length - 1 !== index && (
//       <Divider
//         style={{
//           width: '100%',
//           margin: '32px 0px',
//           borderTop: gameEditionView
//             ? `1px dashed ${theme(themeMode).colors.black}`
//             : `1px solid  ${theme(themeMode).colors.white}`,
//         }}
//       />
//     )}
//   </>
// ))
