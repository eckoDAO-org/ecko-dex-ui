import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';
import { reduceBalance } from '../../../utils/reduceBalance';
import CustomButton from '../../../components/shared/CustomButton';
import { SuccessfullIcon } from '../../../assets';
import { PactContext } from '../../../contexts/PactContext';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import tokenData from '../../../constants/cryptoCurrencies';
import Label from '../../shared/Label';
import { LIQUIDITY_VIEW } from '../../../constants/liquidityView';

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  svg {
    display: ${({ gameEditionView }) => gameEditionView && 'none '};
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
  width: 100%;
  height: ${({ gameEditionView }) => gameEditionView && '100% '};
  justify-content: ${({ gameEditionView }) => gameEditionView && 'space-between '};
`;

const Title = styled.div`
  font-family: montserrat-bold;
  font-size: 24px;
  ${({ theme: { colors } }) => colors.white};
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

const Row = styled.div`
  display: flex;
  align-items: center;
  &.sb {
    justify-content: space-between;
  }
  &.fs {
    justify-content: flex-start;
  }
  &.fe {
    justify-content: flex-end;
  }
  &.c {
    justify-content: center;
  }
`;

const SubTitle = styled.div`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) => (gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold)};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '14px' : '13px')};
  color: ${({ theme: { colors }, gameEditionView }) => (gameEditionView ? colors.black : colors.white)};
  text-align: ${({ gameEditionView }) => (gameEditionView ? 'left' : 'center')};
  width: ${({ gameEditionView }) => (gameEditionView ? '100%' : 'auto')};
  align-items: center;
  position: relative;
  justify-content: center;
`;

const Value = styled.span`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) => (gameEditionView ? fontFamily.pressStartRegular : fontFamily.regular)};
  font-size: 10px;
  color: ${({ theme: { colors }, gameEditionView }) => (gameEditionView ? colors.black : `${colors.white}99`)};
`;

const ReviewTxModal = ({ fromValues, toValues, supply, liquidityView }) => {
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
    if (liquidityView === LIQUIDITY_VIEW.ADD_LIQUIDITY) {
      return (
        <TransactionsDetails>
          <Row className="fs">
            <Label fontFamily="bold" fontSize={13}>
              Deposit Desired
            </Label>
          </Row>

          {/* FIRST COIN */}
          <Row className="sb" style={{ marginBottom: 8 }}>
            <Row className="fs">
              {getTokenIcon(fromValues.coin)}
              <Label fontFamily="bold" fontSize={13}>
                {fromValues.amount}
              </Label>
            </Row>
            <Label fontFamily="bold" fontSize={13}>
              {fromValues.coin}
            </Label>
          </Row>
          {/* FIRST RATE */}
          <Row className="fe">
            <Label fontSize={10}>{`1 ${fromValues?.coin} =  ${reduceBalance(1 / pact.ratio)} ${toValues?.coin}`}</Label>
          </Row>
          {/* SECOND COIN */}
          <Row className="sb" style={{ marginBottom: 8 }}>
            <Row className="fs">
              {getTokenIcon(toValues.coin)}
              <Label fontFamily="bold" fontSize={13}>
                {toValues.amount}
              </Label>
            </Row>
            <Label fontFamily="bold" fontSize={13}>
              {toValues.coin}
            </Label>
          </Row>
          {/* SECOND RATE */}
          <Row className="fe">
            <Label fontSize={10}>{`1 ${toValues?.coin} =  ${reduceBalance(1 / pact.ratio)} ${fromValues?.coin}`}</Label>
          </Row>
          <Row className="sb">
            <Label fontSize={10}>Share of Pool:</Label>
            <Label fontSize={10}>{reduceBalance(pact.share(fromValues?.amount) * 100)}%</Label>
          </Row>
        </TransactionsDetails>
      );
    } else {
      return (
        <TransactionsDetails>
          <Row className="sb">
            <Label fontSize={13}>{`1 ${fromValues?.coin}`}</Label>
            <Label fontSize={10}>{`${reduceBalance(toValues.amount / fromValues.amount)} ${toValues.coin}`}</Label>
          </Row>
          <Row style={{ padding: '16px 0px' }}>
            <Label fontSize={13}>{`1 ${toValues?.coin} `}</Label>
            <Label fontSize={10}>{`${reduceBalance(fromValues.amount / toValues.amount)} ${fromValues.coin}`}</Label>
          </Row>
        </TransactionsDetails>
      );
    }
  };

  return (
    <Content gameEditionView={gameEditionView}>
      {!gameEditionView && (
        <Label fontFamily="bold" labelStyle={{ padding: '16px 0px' }}>
          Preview Succesful
        </Label>
      )}
      <SuccessfullIcon />
      {ContentView()}
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
    </Content>
  );
};

export default ReviewTxModal;
