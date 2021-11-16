import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components/macro';
import { ArrowBack } from '../../assets';
import TxView from '../../components/swap/swap-modals/TxView';
import WalletRequestView from '../../components/swap/swap-modals/WalletRequestView';
import { WalletContext } from '../../contexts/WalletContext';
import { ReactComponent as CloseGE } from '../../assets/images/shared/close-ge.svg';
import CustomButton from '../../shared/CustomButton';
import FormContainer from '../../shared/FormContainer';
import Input from '../../shared/Input';
import { PRECISION } from '../../constants/contextConstants';
import tokenData from '../../constants/cryptoCurrencies';

import {
  extractDecimal,
  limitDecimalPlaces,
  pairUnit,
  reduceBalance,
} from '../../utils/reduceBalance';
import theme from '../../styles/theme';
import { LiquidityContext } from '../../contexts/LiquidityContext';
import { GameEditionContext } from '../../contexts/GameEditionContext';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  width: 100%;
  max-width: ${({ gameEditionView }) => !gameEditionView && `500px`};
  margin-left: auto;
  margin-right: auto;
  padding: ${({ gameEditionView }) => gameEditionView && `10px 10px`};
`;

const SubContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  width: 100%;
  padding: ${({ gameEditionView }) => gameEditionView && '10px'};

  & > *:first-child {
    margin-bottom: 20px;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ gameEditionView }) =>
    gameEditionView ? '10px' : `24px`};
  width: 100%;
  position: ${({ gameEditionView }) => gameEditionView && 'absolute'};
  top: ${({ gameEditionView }) => gameEditionView && '10px'};
  padding: ${({ gameEditionView }) => gameEditionView && '10px'};
`;

const Title = styled.span`
  font: ${({ gameEditionView }) =>
    gameEditionView
      ? `normal normal normal 16px/19px ${theme.fontFamily.pressStartRegular}`
      : `normal normal bold 32px/57px ${theme.fontFamily.bold}`};
  letter-spacing: 0px;
  color: ${({ gameEditionView }) =>
    gameEditionView ? `${theme.colors.black}` : `#fff`};
  text-transform: capitalize;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const MyButtonDivider = styled.div`
  width: 2%;
  height: auto;
  display: inline-block;
`;

const Gradient = styled.div`
  border-radius: 10px; /*1*/
  border: 1px solid transparent; /*2*/
  background: linear-gradient(90deg, #ed1cb5, #ffa900, #39fffc) border-box; /*3*/
  -webkit-mask: /*4*/ linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out; /*5'*/
  mask-composite: exclude; /*5*/
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  width: calc(100% + 40px);
  height: calc(100% + 40px);
  z-index: -10;
`;

const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0px;
  flex-flow: column;
  width: 100%;
  top: ${({ gameEditionView }) => gameEditionView && '180px'};
  padding: ${({ gameEditionView }) => gameEditionView && '10px'};
  position: ${({ gameEditionView }) => gameEditionView && 'absolute'};
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  }
`;

const InnerRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ gameEditionView }) => !gameEditionView && '10px'};
  flex-flow: row;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    margin-bottom: 5px;
    flex-flow: row;
  }
`;

const Label = styled.span`
  font: ${({ gameEditionView }) =>
    gameEditionView
      ? `normal normal normal 10px/12px ${theme.fontFamily.pressStartRegular}`
      : `normal normal normal 14px/15px ${theme.fontFamily.regular}`};
  color: ${({ gameEditionView }) =>
    gameEditionView ? `${theme.colors.black}` : `#fff`};
  text-transform: capitalize;
`;

const Value = styled.span`
  font: ${({ gameEditionView }) =>
    gameEditionView
      ? `normal normal normal 10px/12px ${theme.fontFamily.pressStartRegular}`
      : `normal normal normal 16px/20px ${theme.fontFamily.bold}`};
  line-height: 20px;
  color: ${({ gameEditionView }) =>
    gameEditionView ? `${theme.colors.black}` : `#fff`};
`;

const RemoveLiqContainer = (props) => {
  const wallet = useContext(WalletContext);
  const liquidity = useContext(LiquidityContext);
  const { gameEditionView } = useContext(GameEditionContext);
  const { token0, token1, balance, pooledAmount } = props.pair;

  const [amount, setAmount] = useState(100);
  const [showTxModal, setShowTxModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pooled, setPooled] = useState(balance);
  const [pooledToken0, setPooledToken0] = useState(
    reduceBalance(pooledAmount[0], 12)
  );

  const [pooledToken1, setPooledToken1] = useState(
    reduceBalance(pooledAmount[1], 12)
  );

  useEffect(() => {
    if (!isNaN(amount)) {
      setPooled(
        reduceBalance((extractDecimal(balance) * amount) / 100, PRECISION)
      );
      setPooledToken0(
        reduceBalance(
          (extractDecimal(pooledAmount[0]) * amount) / 100,
          PRECISION
        )
      );
      setPooledToken1(
        reduceBalance(
          (extractDecimal(pooledAmount[1]) * amount) / 100,
          PRECISION
        )
      );
    }
  }, [amount]);

  useEffect(() => {
    if (wallet.walletSuccess) {
      //?//
      setLoading(false);
      wallet.setWalletSuccess(false);
    }
  }, [wallet.walletSuccess]);

  const onWalletRequestViewModalClose = () => {
    wallet.setIsWaitingForWalletAuth(false);
    wallet.setWalletError(null);
  };

  return (
    <Container gameEditionView={gameEditionView}>
      <TxView
        view='Remove Liquidity'
        show={showTxModal}
        token0={token0}
        token1={token1}
        onClose={() => setShowTxModal(false)}
      />
      <WalletRequestView
        show={wallet.isWaitingForWalletAuth}
        error={wallet.walletError}
        onClose={() => onWalletRequestViewModalClose()}
      />
      <TitleContainer gameEditionView={gameEditionView}>
        <Title gameEditionView={gameEditionView}>
          {!gameEditionView && (
            <ArrowBack
              style={{
                cursor: 'pointer',
                color: '#FFFFFF',
                marginRight: '15px',
                justifyContent: 'center',
              }}
              onClick={() => props.closeLiquidity()}
            />
          )}
          Remove Liquidity
        </Title>
        {gameEditionView && <CloseGE onClick={() => props.closeLiquidity()} />}
      </TitleContainer>

      <FormContainer
        containerStyle={
          gameEditionView
            ? { border: 'none', padding: 0, position: 'absolute', top: '60px' }
            : {}
        }
      >
        {!gameEditionView && <Gradient />}
        <SubContainer gameEditionView={gameEditionView}>
          <Input
            value={amount}
            error={isNaN(amount)}
            topLeftLabel='Pool Tokens to Remove '
            placeholder=' Enter Amount'
            label={{ basic: true, content: '%' }}
            onChange={(e) => {
              if (
                Number(e.target.value) <= 100 &&
                Number(e.target.value) >= 0
              ) {
                setAmount(limitDecimalPlaces(e.target.value, 2));
              }
            }}
            numberOnly
          />
          <ButtonContainer
            gameEditionView={gameEditionView}
            style={gameEditionView ? { marginTop: '3px' } : {}}
          >
            <Button.Group fluid>
              <CustomButton
                buttonStyle={{
                  width: '20%',
                }}
                background={
                  amount === 25
                    ? gameEditionView
                      ? `${theme.colors.black}`
                      : `${theme.colors.white}`
                    : 'transparent'
                }
                border={!gameEditionView && '1px solid #FFFFFF99'}
                color={
                  amount === 25
                    ? gameEditionView
                      ? `${theme.colors.yellow}`
                      : `${theme.colors.black}`
                    : gameEditionView
                    ? `${theme.colors.black}`
                    : `${theme.colors.white}`
                }
                onClick={() => setAmount(25)}
              >
                25%
              </CustomButton>
              <MyButtonDivider />
              <CustomButton
                buttonStyle={{
                  width: '20%',
                }}
                border={!gameEditionView && '1px solid #FFFFFF99'}
                background={
                  amount === 50
                    ? gameEditionView
                      ? `${theme.colors.black}`
                      : `${theme.colors.white}`
                    : 'transparent'
                }
                color={
                  amount === 50
                    ? gameEditionView
                      ? `${theme.colors.yellow}`
                      : `${theme.colors.black}`
                    : gameEditionView
                    ? `${theme.colors.black}`
                    : `${theme.colors.white}`
                }
                onClick={() => setAmount(50)}
              >
                50%
              </CustomButton>
              <MyButtonDivider />
              <CustomButton
                buttonStyle={{
                  width: '20%',
                }}
                border={!gameEditionView && '1px solid #FFFFFF99'}
                background={
                  amount === 75
                    ? gameEditionView
                      ? `${theme.colors.black}`
                      : `${theme.colors.white}`
                    : 'transparent'
                }
                color={
                  amount === 75
                    ? gameEditionView
                      ? `${theme.colors.yellow}`
                      : `${theme.colors.black}`
                    : gameEditionView
                    ? `${theme.colors.black}`
                    : `${theme.colors.white}`
                }
                onClick={() => setAmount(75)}
              >
                75%
              </CustomButton>
              <MyButtonDivider />
              <CustomButton
                buttonStyle={{
                  width: '20%',
                }}
                border={!gameEditionView && '1px solid #FFFFFF99'}
                background={
                  amount === 100
                    ? gameEditionView
                      ? `${theme.colors.black}`
                      : `${theme.colors.white}`
                    : 'transparent'
                }
                color={
                  amount === 100
                    ? gameEditionView
                      ? `${theme.colors.yellow}`
                      : `${theme.colors.black}`
                    : gameEditionView
                    ? `${theme.colors.black}`
                    : `${theme.colors.white}`
                }
                onClick={() => setAmount(100)}
              >
                100%
              </CustomButton>
            </Button.Group>
          </ButtonContainer>
        </SubContainer>

        <ResultContainer gameEditionView={gameEditionView}>
          <InnerRowContainer gameEditionView={gameEditionView}>
            <Label gameEditionView={gameEditionView}>
              {token0} per {token1}
            </Label>
            <Value gameEditionView={gameEditionView}>
              {pairUnit(extractDecimal(pooled))}
            </Value>
          </InnerRowContainer>
          <InnerRowContainer gameEditionView={gameEditionView}>
            <Label gameEditionView={gameEditionView}>Pooled {token0}</Label>
            <Value gameEditionView={gameEditionView}>
              {pairUnit(extractDecimal(pooledToken0))}
            </Value>
          </InnerRowContainer>
          <InnerRowContainer gameEditionView={gameEditionView}>
            <Label gameEditionView={gameEditionView}>Pooled {token1}</Label>
            <Value gameEditionView={gameEditionView}>
              {pairUnit(extractDecimal(pooledToken1))}
            </Value>
          </InnerRowContainer>
        </ResultContainer>

        <ButtonContainer
          gameEditionView={gameEditionView}
          style={
            gameEditionView ? { position: 'absolute', bottom: '-180px' } : {}
          }
        >
          <Button.Group
            fluid
            style={{ padding: gameEditionView ? '0 10px' : 0 }}
          >
            <CustomButton
              loading={loading}
              disabled={isNaN(amount) || reduceBalance(amount) === 0}
              onClick={async () => {
                if (
                  wallet.signing.method !== 'sign' &&
                  wallet.signing.method !== 'none'
                ) {
                  const res = await liquidity.removeLiquidityLocal(
                    tokenData[token0].code,
                    tokenData[token1].code,
                    reduceBalance(pooled, PRECISION)
                  );
                  if (res === -1) {
                    setLoading(false);
                    alert(
                      'Incorrect password. If forgotten, you can reset it with your private key'
                    );
                    return;
                  } else {
                    setShowTxModal(true);
                    setLoading(false);
                  }
                } else {
                  setLoading(true);
                  const res = await liquidity.removeLiquidityWallet(
                    tokenData[token0].code,
                    tokenData[token1].code,
                    reduceBalance(pooled, PRECISION)
                  );
                  if (!res) {
                    wallet.setIsWaitingForWalletAuth(true);
                    setLoading(false);
                    /* pact.setWalletError(true); */
                    /* walletError(); */
                  } else {
                    wallet.setWalletError(null);
                    setShowTxModal(true);
                    setLoading(false);
                  }
                }
              }}
            >
              Remove Liquidity
            </CustomButton>
          </Button.Group>
        </ButtonContainer>
      </FormContainer>
    </Container>
  );
};

export default RemoveLiqContainer;
