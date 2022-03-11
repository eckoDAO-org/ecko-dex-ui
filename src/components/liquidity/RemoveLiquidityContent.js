/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import styled, { css } from 'styled-components/macro';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { ModalContext } from '../../contexts/ModalContext';
import { LiquidityContext } from '../../contexts/LiquidityContext';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { WalletContext } from '../../contexts/WalletContext';
import TxView from '../modals/TxView';
import WalletRequestView from '../modals/WalletRequestView';
import CustomButton from '../shared/CustomButton';
import FormContainer from '../shared/FormContainer';
import Input from '../shared/Input';
import tokenData from '../../constants/cryptoCurrencies';
import GradientBorder from '../shared/GradientBorder';
import Label from '../shared/Label';
import PressButtonToActionLabel from '../game-edition-v2/components/PressButtonToActionLabel';
import { InfoContainer } from '../game-edition-v2/components/PixeledInfoContainerBlue';
import { PRECISION } from '../../constants/contextConstants';
import { extractDecimal, limitDecimalPlaces, pairUnit, reduceBalance } from '../../utils/reduceBalance';
import { ArrowBack } from '../../assets';
import { theme } from '../../styles/theme';
import { LIQUIDITY_VIEW } from '../../constants/liquidityView';
import PixeledBlueContainer from '../game-edition-v2/components/PixeledInfoContainerBlue';
import LogoLoader from '../shared/Loader';
import { FadeIn } from '../shared/animations';
import { FlexContainer } from '../shared/FlexContainer';
import InputRange from '../shared/InputRange';

const Container = styled(FadeIn)`
  margin-top: 0px;

  overflow: auto;
  max-width: 550px;
`;
const SubContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  width: 100%;
  padding: ${({ gameEditionView }) => gameEditionView && '0 16px'};
  & > *:first-child {
    margin-bottom: 16px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  & > button:not(:last-child) {
    margin-right: 8px;
  }
  & > button:last-child {
    margin-right: 0px;
  }
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel}px`}) {
    & > button {
      padding: 0px !important;
    }
  }
`;

const RemoveLiquidityContent = ({ pair }) => {
  const wallet = useContext(WalletContext);
  const liquidity = useContext(LiquidityContext);
  const { themeMode } = useContext(ApplicationContext);
  const modalContext = useContext(ModalContext);
  const { gameEditionView, openModal, closeModal, setButtons } = useContext(GameEditionContext);
  const { token0, token1, balance, pooledAmount } = pair;

  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [pooled, setPooled] = useState(balance);
  const [pooledToken0, setPooledToken0] = useState(reduceBalance(pooledAmount?.[0], 12));

  const [pooledToken1, setPooledToken1] = useState(reduceBalance(pooledAmount?.[1], 12));

  useEffect(() => {
    if (!isNaN(amount)) {
      setPooled(reduceBalance((extractDecimal(balance) * amount) / 100, PRECISION));
      setPooledToken0(reduceBalance((extractDecimal(pooledAmount[0]) * amount) / 100, PRECISION));
      setPooledToken1(reduceBalance((extractDecimal(pooledAmount[1]) * amount) / 100, PRECISION));
    }
  }, [amount]);

  useEffect(() => {
    if (!isNaN(amount) && reduceBalance(amount) !== 0) {
      setButtons({
        A: () => {
          onRemoveLiquidity();
        },
      });
    } else {
      setButtons({ A: null });
    }
  }, [amount, pooled, pooledToken0, pooledToken1]);

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

  const openTxViewModal = () => {
    if (gameEditionView) {
      openModal({
        titleFontSize: 32,
        containerStyle: { padding: 0 },
        titleContainerStyle: {
          padding: 16,
          paddingBottom: 0,
        },
        title: 'transaction details',
        onClose: () => {
          closeModal();
        },
        content: (
          <TxView
            view={LIQUIDITY_VIEW.REMOVE_LIQUIDITY}
            token0={token0}
            onClose={() => {
              closeModal();
            }}
            token1={token1}
          />
        ),
      });
    } else {
      modalContext.openModal({
        title: 'transaction details',
        description: '',
        onClose: () => {
          modalContext.closeModal();
        },
        content: (
          <TxView
            view={LIQUIDITY_VIEW.REMOVE_LIQUIDITY}
            token0={token0}
            onClose={() => {
              modalContext.closeModal();
            }}
            token1={token1}
          />
        ),
      });
    }
  };

  const onRemoveLiquidity = async () => {
    if (wallet.signing.method !== 'sign' && wallet.signing.method !== 'none') {
      setLoading(true);
      const res = await liquidity.removeLiquidityLocal(tokenData[token0].code, tokenData[token1].code, reduceBalance(pooled, PRECISION));
      if (res === -1) {
        setLoading(false);
        alert('Incorrect password. If forgotten, you can reset it with your private key');
        return;
      } else {
        openTxViewModal();
        setLoading(false);
      }
    } else {
      setLoading(true);
      const res = await liquidity.removeLiquidityWallet(tokenData[token0].code, tokenData[token1].code, reduceBalance(pooled, PRECISION));
      if (!res) {
        wallet.setIsWaitingForWalletAuth(true);
        setLoading(false);
        /* pact.setWalletError(true); */
        /* walletError(); */
      } else {
        wallet.setWalletError(null);
        openTxViewModal();
        setLoading(false);
      }
    }
  };

  return (
    <Container $gameEditionView={gameEditionView}>
      <WalletRequestView show={wallet.isWaitingForWalletAuth} error={wallet.walletError} onClose={() => onWalletRequestViewModalClose()} />

      <FormContainer
        containerStyle={gameEditionView ? { border: 'none', padding: 0 } : {}}
        footer={
          <ButtonContainer gameEditionView={gameEditionView}>
            {gameEditionView ? (
              loading ? (
                <LogoLoader />
              ) : (
                <PressButtonToActionLabel actionLabel="remove liquidity" />
              )
            ) : (
              <CustomButton
                fluid
                type="secondary"
                loading={loading}
                disabled={isNaN(amount) || reduceBalance(amount) === 0}
                onClick={async () => await onRemoveLiquidity()}
              >
                Remove Liquidity
              </CustomButton>
            )}
          </ButtonContainer>
        }
      >
        {!gameEditionView && <GradientBorder />}
        <SubContainer gameEditionView={gameEditionView}>
          <Input
            value={amount}
            error={isNaN(amount)}
            topLeftLabel="Pool Tokens to Remove"
            placeholder="Enter Amount"
            size="large"
            geColor="white"
            withBorder
            numberOnly
            label={{ content: '%' }}
            inputStyle={{ marginBottom: 5 }}
            onChange={(e) => {
              if (Number(e.target.value) <= 100 && Number(e.target.value) >= 0) {
                setAmount(limitDecimalPlaces(e.target.value, 2));
              }
            }}
          />

          <InputRange value={amount} setValue={setAmount} />
          <ButtonContainer>
            <CustomButton
              fluid
              type={amount === 25 ? 'secondary' : 'primary'}
              background={gameEditionView && amount === 25 && '#6D99E4'}
              onClick={() => setAmount(25)}
            >
              25%
            </CustomButton>
            <CustomButton
              fluid
              type={amount === 50 ? 'secondary' : 'primary'}
              background={gameEditionView && amount === 50 && '#6D99E4'}
              onClick={() => setAmount(50)}
            >
              50%
            </CustomButton>
            <CustomButton
              fluid
              type={amount === 75 ? 'secondary' : 'primary'}
              background={gameEditionView && amount === 75 && '#6D99E4'}
              onClick={() => setAmount(75)}
            >
              75%
            </CustomButton>
            <CustomButton
              fluid
              type={amount === 100 ? 'secondary' : 'primary'}
              background={gameEditionView && amount === 100 && '#6D99E4'}
              onClick={() => setAmount(100)}
            >
              100%
            </CustomButton>
          </ButtonContainer>
        </SubContainer>

        {gameEditionView ? (
          <InfoContainer style={{ marginTop: 32 }}>
            <PixeledBlueContainer label={`${token0}/${token1}`} value={extractDecimal(pooled).toPrecision(4)} />
            <PixeledBlueContainer label={`Pooled ${token0}`} value={extractDecimal(pooledToken0).toPrecision(4)} />
            <PixeledBlueContainer label={`Pooled ${token1}`} value={extractDecimal(pooledToken1).toPrecision(4)} />
          </InfoContainer>
        ) : (
          <FlexContainer className="column" gap={12} style={{ margin: '16px 0' }}>
            <FlexContainer className="justify-sb w-100">
              <Label fontSize={13}>
                {token0} per {token1}
              </Label>
              <Label fontSize={13}>{pairUnit(extractDecimal(pooled))}</Label>
            </FlexContainer>
            <FlexContainer className="justify-sb w-100">
              <Label fontSize={13}>Pooled {token0}</Label>
              <Label fontSize={13}>{pairUnit(extractDecimal(pooledToken0))}</Label>
            </FlexContainer>
            <FlexContainer className="justify-sb w-100">
              <Label fontSize={13}>Pooled {token1}</Label>
              <Label fontSize={13}>{pairUnit(extractDecimal(pooledToken1))}</Label>
            </FlexContainer>
          </FlexContainer>
        )}
      </FormContainer>
    </Container>
  );
};

export default RemoveLiquidityContent;
