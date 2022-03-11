import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { reduceBalance } from '../../../utils/reduceBalance';
import CustomButton from '../../../components/shared/CustomButton';
import { SuccessfullIcon } from '../../../assets';
import { PactContext } from '../../../contexts/PactContext';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import tokenData from '../../../constants/cryptoCurrencies';
import Label from '../../shared/Label';
import { Row, SuccessViewContainerGE } from '../common-result-components';
import GameEditionLabel from '../../game-edition-v2/components/GameEditionLabel';
import { useGameEditionContext } from '../../../contexts';

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  svg {
    display: ${({ gameEditionView }) => gameEditionView && 'none '};
    path {
      fill: ${({ gameEditionView, theme: { colors } }) => !gameEditionView && colors.white};
    }
  }
  width: 100%;
  height: ${({ gameEditionView }) => gameEditionView && '100% '};
  justify-content: ${({ gameEditionView }) => gameEditionView && 'space-between '};
`;

const TransactionsDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px 0px;
  padding-top: 5px;
  & > *:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const ReviewTxModal = ({ fromValues, toValues, supply }) => {
  const pact = useContext(PactContext);
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
      <TransactionsDetails>
        <Row className="fs">
          <Label fontFamily="syncopate" fontSize={13}>
            Deposit Desired
          </Label>
        </Row>

        {/* FIRST COIN */}
        <Row className="sb" style={{ marginBottom: 8 }}>
          <Row className="fs">
            {getTokenIcon(fromValues.coin)}
            <Label fontFamily="syncopate" fontSize={13}>
              {fromValues.amount}
            </Label>
          </Row>
          <Label fontFamily="syncopate" fontSize={13}>
            {fromValues.coin}
          </Label>
        </Row>
        {/* FIRST RATE */}
        <Row className="fe">
          <Label fontSize={13}>{`1 ${fromValues?.coin} =  ${reduceBalance(1 / pact.ratio)} ${toValues?.coin}`}</Label>
        </Row>
        {/* SECOND COIN */}
        <Row className="sb" style={{ marginBottom: 8 }}>
          <Row className="fs">
            {getTokenIcon(toValues.coin)}
            <Label fontFamily="syncopate" fontSize={13}>
              {toValues.amount}
            </Label>
          </Row>
          <Label fontFamily="syncopate" fontSize={13}>
            {toValues.coin}
          </Label>
        </Row>
        {/* SECOND RATE */}
        <Row className="fe">
          <Label fontSize={13}>{`1 ${toValues?.coin} =  ${reduceBalance(pact.ratio)} ${fromValues?.coin}`}</Label>
        </Row>
        <Row className="sb">
          <Label fontSize={13}>Pool Share:</Label>
          <Label fontSize={13}>{(pact.share(fromValues?.amount) * 100).toPrecision(4)} %</Label>
        </Row>
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

            <Row className="fs">
              {getTokenIcon(fromValues.coin)}
              <GameEditionLabel fontSize={22} color="blue-grey">
                {fromValues.amount}
              </GameEditionLabel>
            </Row>

            <GameEditionLabel color="blue">{`1 ${fromValues?.coin} =  ${reduceBalance(1 / pact.ratio)} ${toValues?.coin}`}</GameEditionLabel>
          </>
        }
        rightItem={
          <>
            <GameEditionLabel fontSize={32} color="blue">
              {toValues.coin}
            </GameEditionLabel>

            <Row className="fs">
              {getTokenIcon(toValues.coin)}
              <GameEditionLabel fontSize={22} color="blue-grey">
                {toValues.amount}
              </GameEditionLabel>
            </Row>
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
    <Content gameEditionView={gameEditionView}>
      {!gameEditionView && (
        <Label fontFamily="syncopate" labelStyle={{ padding: '16px 0px' }}>
          Preview Succesful
        </Label>
      )}
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
