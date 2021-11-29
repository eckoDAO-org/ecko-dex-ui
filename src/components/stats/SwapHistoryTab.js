import React, { useContext } from 'react';
import { Grid } from 'semantic-ui-react';
import styled from 'styled-components/macro';
import { KDALogo, ZelcoreLogo } from '../../assets';
import { NETWORK_TYPE } from '../../constants/contextConstants';
import tokenData from '../../constants/cryptoCurrencies';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { PactContext } from '../../contexts/PactContext';
import ModalContainer from '../../shared/ModalContainer';
import theme from '../../styles/theme';
import { PartialScrollableScrollSection } from '../layout/Containers';

const IconColumn = styled(Grid.Column)`
  display: flex !important;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
`;

const ColumnContainer = styled(Grid.Column)`
  font-family: ${({ theme: { fontFamily }, gameEditionView, regular }) => {
    if (gameEditionView) return fontFamily.pressStartRegular;
    else if (regular) return fontFamily.regular;
    else return fontFamily.bold;
  }};
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '18px')};
`;

const SwapHistoryTab = () => {
  const pact = useContext(PactContext);
  const { gameEditionView } = useContext(GameEditionContext);

  const getIconCoin = (cryptoCode) => {
    const crypto = Object.values(tokenData).find(({ code }) => code === cryptoCode);
    return crypto?.icon;
  };

  return (
    <ModalContainer
      title="Swap History"
      containerStyle={{
        maxHeight: '60vh',
        maxWidth: 650,
      }}
    >
      <Grid style={{ width: '100%', marginLeft: 0 }}>
        <Grid.Row columns="3">
          <ColumnContainer gameEditionView={gameEditionView}>Height</ColumnContainer>
          <ColumnContainer gameEditionView={gameEditionView}>Pair</ColumnContainer>
          <ColumnContainer gameEditionView={gameEditionView}>Amount</ColumnContainer>
        </Grid.Row>
      </Grid>
      <PartialScrollableScrollSection>
        <Grid style={{ width: '100%', minHeight: '40px', margin: '16px 0' }}>
          {pact.swapList === 'NO_SWAP_FOUND' ? (
            <Grid.Row>
              <ColumnContainer gameEditionView={gameEditionView}>No Swap found</ColumnContainer>
            </Grid.Row>
          ) : (
            Object.values(pact.swapList)
              ?.sort((a, b) => a?.height - b?.height)
              ?.map((swap, index) => (
                <Grid.Row
                  columns="3"
                  key={index}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${swap?.moduleHash}`, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <ColumnContainer regular gameEditionView={gameEditionView} fontSize="12px">
                    {swap?.height}
                  </ColumnContainer>
                  <IconColumn>
                    {getIconCoin(
                      swap?.params[3]?.refName?.namespace
                        ? `${swap?.params[3]?.refName?.namespace}.${swap?.params[3]?.refName?.name}`
                        : swap?.params[3]?.refName?.name
                    )}
                    {getIconCoin(
                      swap?.params[5]?.refName?.namespace
                        ? `${swap?.params[5]?.refName?.namespace}.${swap?.params[5]?.refName?.name}`
                        : swap?.params[5]?.refName?.name
                    )}
                  </IconColumn>
                  <ColumnContainer regular gameEditionView={gameEditionView} fontSize="12px">{`${swap?.params[2]}`}</ColumnContainer>
                </Grid.Row>
              ))
          )}
        </Grid>
      </PartialScrollableScrollSection>
    </ModalContainer>
  );
};

export default SwapHistoryTab;
