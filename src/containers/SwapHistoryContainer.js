/* eslint-disable react-hooks/exhaustive-deps */
import React  from 'react';
import styled, { css } from 'styled-components/macro';
import { useHistory } from 'react-router-dom';
import { FlexContainer } from '../components/shared/FlexContainer';
import Label from '../components/shared/Label';
import { ROUTE_INDEX } from '../router/routes';
import { HistoryIcon } from '../assets';
import modalBackground from '../assets/images/game-edition/modal-background.png';
import { FadeIn } from '../components/shared/animations';
import { useAccountContext} from '../contexts';
import { commonTheme } from '../styles/theme';

import TransactionsTableAccount from '../components/transactions/TransactionsTableAccount';


export const CardContainer = styled(FadeIn)`
  display: flex;
  flex-flow: column;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  ${({ gameEditionView }) => {
    if (!gameEditionView) {
      return css`
        border-radius: 10px;
        position: relative;
        z-index: 2;
      `;
    } else {
      return css`
        padding: 16px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        background-image: ${`url(${modalBackground})`};
      `;
    }
  }}

  overflow: auto;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    padding: ${({ gameEditionView }) => gameEditionView && `12px`};
    flex-flow: column;
    gap: 0px;
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobileSmallPixel + 1}px`}) {
    max-height: ${({ gameEditionView }) => (gameEditionView ? 'unset' : '400px')};
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel}px`}) {
    max-height: ${({ gameEditionView }) => gameEditionView && 'unset'};
  }
`;

const HistoryIconContainer = styled(FlexContainer)`
  background-color: ${({ theme: { colors } }) => colors.white};
  width: 32px;
  height: 32px;
  border-radius: 4px;
  svg {
    height: 20px;
    width: 20px;
    path {
      fill: ${({ theme: { colors } }) => colors.primary};
    }
  }
`;


const SwapHistoryContainer = () => {
  const account = useAccountContext();
  const history = useHistory();
  return <CardContainer
      gameEditionView={false}
      desktopStyle={{ padding: `32px ${commonTheme.layout.desktopPadding}px` }}
      tabletStyle={{ padding: 32 }}
      mobileStyle={{ padding: '24px 16px 40px' }}
    >
      <FlexContainer className="w-100 justify-sb" style={{ marginBottom: 24 }} gameEditionStyle={{ marginBottom: 14 }}>
        <Label fontSize={24} geFontSize={32} fontFamily="syncopate">
          ACCOUNT HISTORY
        </Label>
        <HistoryIconContainer className="justify-ce align-ce pointer" onClick={() => history.push(ROUTE_INDEX)}>
          <HistoryIcon />
        </HistoryIconContainer>

      </FlexContainer>
      {account.account.account && <TransactionsTableAccount account={account.account.account} /> }

    </CardContainer>

}

export default SwapHistoryContainer;
