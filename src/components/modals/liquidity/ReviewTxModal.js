import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { Divider } from 'semantic-ui-react';
import { AccountContext } from '../../../contexts/AccountContext';
import { PactContext } from '../../../contexts/PactContext';
import { useGameEditionContext } from '../../../contexts';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import { reduceBalance } from '../../../utils/reduceBalance';
import CustomButton from '../../../components/shared/CustomButton';
import { SuccessfullIcon } from '../../../assets';
import tokenData from '../../../constants/cryptoCurrencies';
import Label from '../../shared/Label';
import GameEditionLabel from '../../game-edition-v2/components/GameEditionLabel';
import { CryptoContainer, FlexContainer } from '../../shared/FlexContainer';
import CopyPopup from '../../shared/CopyPopup';
import reduceToken from '../../../utils/reduceToken';
import { CHAIN_ID } from '../../../constants/contextConstants';
import { SuccessViewContainerGE } from '../TxView';

const Content = styled(FlexContainer)`
  svg {
    display: ${({ gameEditionView }) => gameEditionView && 'none '};
    path {
      fill: ${({ gameEditionView, theme: { colors } }) => !gameEditionView && colors.white};
    }
  }
`;

const TransactionsDetails = styled(FlexContainer)`
  padding: 24px 0px;
  padding-top: 5px;
`;

const ReviewTxModal = ({ fromValues, toValues, supply }) => {
  const pact = useContext(PactContext);
  const { account } = useContext(AccountContext);
  const { gameEditionView } = useContext(GameEditionContext);

  const [loading, setLoading] = useState(false);

  const showTicker = (ticker) => {
    if (ticker === 'coin') return 'KDA';
    else if (ticker === 'runonflux.flux') return 'FLUX';
    else return ticker.toUpperCase();
  };

  const getTokenIcon = (token) => {
    return tokenData[showTicker(token)].icon;
  };

  const ContentView = () => {
    return (
      <TransactionsDetails className="w-100 column" gap={12}>
        <Label>From</Label>

        {/* ACCOUNT */}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Account</Label>
          <Label fontSize={13}>
            {reduceToken(account.account)}
            <CopyPopup textToCopy={account.account} />
          </Label>
        </FlexContainer>
        {/* CHAIN */}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Chain Id</Label>
          <Label fontSize={13}>{CHAIN_ID}</Label>
        </FlexContainer>
        {/* POOL */}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Pool</Label>
          <FlexContainer>
            <CryptoContainer size={24} style={{ zIndex: 2 }}>
              {getTokenIcon(fromValues.coin)}
            </CryptoContainer>
            <CryptoContainer size={24} style={{ marginLeft: -12, zIndex: 1 }}>
              {getTokenIcon(toValues.coin)}
            </CryptoContainer>

            <Label fontSize={13}>
              {fromValues.coin}/{toValues.coin}
            </Label>
          </FlexContainer>
        </FlexContainer>
        {/* POOL SHARE*/}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Pool Share</Label>
          <Label fontSize={13}>{(pact.share(fromValues?.amount) * 100).toPrecision(4)} %</Label>
        </FlexContainer>

        <Divider />

        <Label>Amount</Label>

        {/* FROM VALUES */}
        <FlexContainer className="align-ce justify-sb">
          <FlexContainer>
            <CryptoContainer size={30}>{getTokenIcon(fromValues.coin)}</CryptoContainer>
            <Label>{fromValues.amount}</Label>
          </FlexContainer>
          <Label>{fromValues.coin}</Label>
        </FlexContainer>
        <Label fontSize={13}>{`1 ${fromValues?.coin} =  ${reduceBalance(1 / pact.ratio)} ${toValues?.coin}`}</Label>

        {/* TO VALUES */}
        <FlexContainer className="align-ce justify-sb">
          <FlexContainer>
            <CryptoContainer size={30}>{getTokenIcon(toValues.coin)}</CryptoContainer>
            <Label>{toValues.amount}</Label>
          </FlexContainer>
          <Label>{toValues.coin}</Label>
        </FlexContainer>
        <Label fontSize={13}>{`1 ${toValues?.coin} =  ${reduceBalance(pact.ratio)} ${fromValues?.coin}`}</Label>
      </TransactionsDetails>
    );
  };

  const ContentViewGe = ({ loading }) => {
    const { setButtons } = useGameEditionContext();
    useEffect(() => {
      setButtons({
        A: !loading
          ? () => {
              setLoading(true);
              supply();
            }
          : null,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);
    return (
      <SuccessViewContainerGE
        hideIcon
        loading={loading}
        title="Deposit Desired"
        leftItem={
          <>
            <GameEditionLabel fontSize={32} color="blue">
              {fromValues.coin}
            </GameEditionLabel>

            <div className="flex justify-fs">
              {getTokenIcon(fromValues.coin)}
              <GameEditionLabel fontSize={22} color="blue-grey">
                {fromValues.amount}
              </GameEditionLabel>
            </div>

            <GameEditionLabel color="blue">{`1 ${fromValues?.coin} =  ${reduceBalance(1 / pact.ratio)} ${toValues?.coin}`}</GameEditionLabel>
          </>
        }
        rightItem={
          <>
            <GameEditionLabel fontSize={32} color="blue">
              {toValues.coin}
            </GameEditionLabel>

            <div className="flex justify-fs">
              {getTokenIcon(toValues.coin)}
              <GameEditionLabel fontSize={22} color="blue-grey">
                {toValues.amount}
              </GameEditionLabel>
            </div>
            <GameEditionLabel color="blue">{`1 ${toValues?.coin} =  ${reduceBalance(pact.ratio)} ${fromValues?.coin}`}</GameEditionLabel>
          </>
        }
        infoItems={[
          {
            label: 'Pool Share',
            value: `${(pact.share(fromValues?.amount) * 100).toPrecision(4)} %`,
          },
        ]}
      />
    );
  };

  return (
    <Content gap={16} className="align-ce column w-100" gameEditionClassName="justify-sb h-100" gameEditionView={gameEditionView}>
      {!gameEditionView && <Label fontFamily="syncopate">Preview Succesful</Label>}
      <SuccessfullIcon />
      {gameEditionView ? <ContentViewGe loading={loading} /> : <ContentView />}
      {!gameEditionView && (
        <CustomButton
          type="secondary"
          fluid
          loading={loading}
          onClick={() => {
            setLoading(true);
            supply();
          }}
        >
          Confirm
        </CustomButton>
      )}
    </Content>
  );
};

export default ReviewTxModal;
