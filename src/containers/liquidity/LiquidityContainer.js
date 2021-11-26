import React, { useEffect, useState, useContext } from 'react';
import styled, { css } from 'styled-components/macro';
import { throttle, debounce } from 'throttle-debounce';
import { PactContext } from '../../contexts/PactContext';
import { reduceBalance, getCorrectBalance } from '../../utils/reduceBalance';
import WalletRequestView from '../../components/swap/swap-modals/WalletRequestView';
import { ReactComponent as ArrowBack } from '../../assets/images/shared/arrow-back.svg';
import { ReactComponent as CloseGE } from '../../assets/images/shared/close-ge.svg';
import { Button } from 'semantic-ui-react';
import CustomLabel from '../../shared/CustomLabel';
import CustomButton from '../../shared/CustomButton';
import ReviewTxModal from '../../components/modals/liquidity/ReviewTxModal';
import TxView from '../../components/swap/swap-modals/TxView';
import { ModalContext } from '../../contexts/ModalContext';
import { AccountContext } from '../../contexts/AccountContext';
import { WalletContext } from '../../contexts/WalletContext';
import { LiquidityContext } from '../../contexts/LiquidityContext';
import { theme } from '../../styles/theme';
import tokenData from '../../constants/cryptoCurrencies';
import SwapForm from '../../components/swap/SwapForm';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import TokenSelectorModalContent from '../../components/swap/swap-modals/TokenSelectorModalContent';
import { CogIcon, Logo } from '../../assets';
import { FadeIn } from '../../components/shared/animations';
import FormContainer from '../../shared/FormContainer';
import GradientBorder from '../../shared/GradientBorder';
import { LightModeContext } from '../../contexts/LightModeContext';
import HeaderItem from '../../shared/HeaderItem';
import CustomPopup from '../../shared/CustomPopup';
import SlippagePopupContent from '../../components/layout/header/SlippagePopupContent';

const Container = styled(FadeIn)`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  overflow: auto;

  ${({ gameEditionView }) => {
    if (gameEditionView) {
      return css`
        height: 100%;
        display: flex;
        flex-direction: column;
      `;
    } else {
      return css`
        max-width: 500px;
      `;
    }
  }}
`;

const TitleContainer = styled.div`
  display: flex;
  padding: ${({ gameEditionView }) => (gameEditionView ? '0px 10px' : '0px !important')};
  justify-content: space-between;
  margin-bottom: 14px;
  width: 100%;
  margin-top: 16px;
`;

const Title = styled.span`
  font: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? `normal normal normal 16px/19px ${fontFamily.pressStartRegular}` : 'normal normal bold 32px/57px Montserrat'};
  letter-spacing: 0px;
  color: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? colors.black : colors.white)};
  text-transform: capitalize;
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const LogoContainer = styled(FadeIn)`
  position: absolute;
  left: 50%;
  top: 45%;
  margin-left: auto;
  margin-right: auto;
  transform: translate(-50%, 0);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  width: 100%;
`;

const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${({ gameEditionView }) => (gameEditionView ? `0px` : ` 16px 0px 0px 0px`)};
  flex-flow: column;
  width: 100%;
  padding: ${({ gameEditionView }) => (gameEditionView ? `0 10px` : 0)};
  margin-top: ${({ gameEditionView }) => gameEditionView && '30px'};
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  }

  & > *:not(:last-child) {
    margin-bottom: ${({ gameEditionView }) => !gameEditionView && `10px`};
  }
`;

const InnerRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: row;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: row;
  }
`;

const Value = styled.span`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) => (gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold)};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '10px' : '13px')};
  line-height: 20px;
  color: ${({ theme: { colors }, gameEditionView }) => (gameEditionView ? colors.black : colors.white)};
`;

const initialStateValue = {
  coin: '',
  account: '',
  guard: null,
  balance: null,
  amount: '',
  precision: 0,
};

const GameEditionTokenSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const LiquidityContainer = (props) => {
  const pact = useContext(PactContext);
  const account = useContext(AccountContext);
  const wallet = useContext(WalletContext);
  const liquidity = useContext(LiquidityContext);
  const modalContext = useContext(ModalContext);
  const { themeMode } = useContext(LightModeContext);
  const { gameEditionView, openModal, closeModal, isSwapping, setIsSwapping } = useContext(GameEditionContext);
  const { selectedView, setSelectedView } = props;
  const [tokenSelectorType, setTokenSelectorType] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [inputSide, setInputSide] = useState('');

  const [fromValues, setFromValues] = useState({
    coin: 'KDA',
    account: '',
    guard: null,
    balance: account.account.balance,
    amount: '',
    precision: 12,
  });

  const [toValues, setToValues] = useState(initialStateValue);

  const [pairExist, setPairExist] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLogoVisible, setIsLogoVisible] = useState(false);

  useEffect(() => {
    if (showTxModal === false) {
      setFromValues({
        coin: 'KDA',
        account: '',
        guard: null,
        balance: account.account.balance,
        amount: '',
        precision: 12,
      });
      setToValues(initialStateValue);
    }
  }, [showTxModal]);

  useEffect(() => {
    if (gameEditionView && isSwapping) {
      swapValues();
      setIsSwapping(false);
    }
  }, [isSwapping]);

  /////// when pass pair by the container, set the token on InputToken
  const handleTokenValue = async (by, crypto) => {
    let balance;
    if (crypto?.code === 'coin') {
      if (account.account) {
        balance = account.account.balance;
      }
    } else {
      let acct = await account.getTokenAccount(crypto?.code, account.account.account, tokenSelectorType === 'from');
      if (acct) {
        balance = getCorrectBalance(acct.balance);
      }
    }
    if (by === 'from')
      return setFromValues((prev) => ({
        ...prev,
        balance: balance,
        coin: crypto?.name,
        precision: crypto.precision,
      }));
    if (by === 'to')
      return setToValues((prev) => ({
        ...prev,
        balance: balance,
        coin: crypto?.name,
        precision: crypto.precision,
      }));
    else return null;
  };

  useEffect(() => {
    setInputSide('from');
    if (props?.pair?.token0 && fromValues === initialStateValue) {
      handleTokenValue('from', tokenData[props?.pair?.token0]);
    }
  }, [props?.pair?.token0]);

  useEffect(() => {
    setInputSide('to');
    if (props?.pair?.token1 && toValues === initialStateValue) {
      handleTokenValue('to', tokenData[props?.pair?.token1]);
    }
  }, [props?.pair?.token1]);
  ////////

  useEffect(async () => {
    if (tokenSelectorType === 'from') setSelectedToken(fromValues.coin);
    if (tokenSelectorType === 'to') setSelectedToken(toValues.coin);
    else setSelectedToken(null);
  }, [tokenSelectorType]);

  useEffect(async () => {
    if (fromValues.coin !== '') {
      await account.getTokenAccount(tokenData[fromValues.coin].code, account.account.account, true);
    }
    if (toValues.coin !== '') {
      await account.getTokenAccount(tokenData[toValues.coin].code, account.account.account, false);
    }
    if (fromValues.coin !== '' && toValues.coin !== '') {
      await pact.getPair(tokenData[fromValues.coin].code, tokenData[toValues.coin].code);
      await pact.getReserves(tokenData[fromValues.coin].code, tokenData[toValues.coin].code);
      if (pact.pair) {
        setPairExist(true);
      }
    }
  }, [fromValues, toValues, pairExist, account.account.account]);

  const onTokenClick = async ({ crypto }) => {
    let balance;
    if (crypto?.code === 'coin') {
      if (account.account) {
        balance = account.account.balance;
      }
    } else {
      let acct = await account.getTokenAccount(crypto?.code, account.account.account, tokenSelectorType === 'from');
      if (acct) {
        balance = getCorrectBalance(acct.balance);
      }
    }
    if (tokenSelectorType === 'from')
      setFromValues((prev) => ({
        ...prev,
        balance: balance,
        coin: crypto?.name,
        precision: crypto?.precision,
      }));
    if (tokenSelectorType === 'to')
      setToValues((prev) => ({
        ...prev,
        balance: balance,
        coin: crypto?.name,
        precision: crypto?.precision,
      }));
  };

  const onWalletRequestViewModalClose = () => {
    wallet.setIsWaitingForWalletAuth(false);
    wallet.setWalletError(null);
  };

  useEffect(() => {
    if (inputSide === 'from' && fromValues.amount !== '') {
      setInputSide(null);
      if (fromValues.coin !== '' && toValues.coin !== '' && !isNaN(pact.ratio)) {
        if (fromValues.amount.length < 5) {
          throttle(
            500,
            setToValues({
              ...toValues,
              amount: reduceBalance(fromValues.amount / pact.ratio, toValues.precision),
            })
          );
        } else {
          debounce(
            500,
            setToValues({
              ...toValues,
              amount: reduceBalance(fromValues.amount / pact.ratio, toValues.precision)?.toFixed(toValues.precision),
            })
          );
        }
      }
    }
    if (isNaN(pact.ratio) || fromValues.amount === '') {
      if (selectedView === 'Add Liquidity') {
        setToValues((prev) => ({ ...prev, amount: '' }));
      }
    }
  }, [fromValues.amount]);

  useEffect(() => {
    if (inputSide === 'to' && toValues.amount !== '') {
      setInputSide(null);
      if (fromValues.coin !== '' && toValues.coin !== '' && !isNaN(pact.ratio)) {
        if (toValues.amount.length < 5) {
          throttle(
            500,
            setFromValues({
              ...fromValues,
              amount: reduceBalance(toValues.amount * pact.ratio, fromValues.precision),
            })
          );
        } else {
          debounce(
            500,
            setFromValues({
              ...fromValues,
              amount: reduceBalance(toValues.amount * pact.ratio, fromValues.precision)?.toFixed(fromValues?.precision),
            })
          );
        }
      }
    }
    if (isNaN(pact.ratio) || toValues.amount === '') {
      if (selectedView === 'Add Liquidity') {
        setFromValues((prev) => ({ ...prev, amount: '' }));
      }
    }
  }, [toValues.amount]);

  useEffect(() => {
    if (wallet.walletSuccess) {
      setLoading(false);
      setFromValues({
        coin: '',
        account: null,
        guard: null,
        balance: null,
        amount: '',
        precision: 0,
      });
      setToValues({
        coin: '',
        account: null,
        guard: null,
        balance: null,
        amount: '',
        precision: 0,
      });
      wallet.setWalletSuccess(false);
    }
  }, [wallet.walletSuccess]);

  useEffect(() => {
    if (!isNaN(pact.ratio)) {
      if (fromValues.amount !== '' && toValues.amount === '') {
        setToValues({
          ...toValues,
          amount: reduceBalance(pact.computeOut(fromValues.amount), toValues.precision),
        });
      }
      if (fromValues.amount === '' && toValues.amount !== '') {
        setFromValues({
          ...fromValues,
          amount: reduceBalance(pact.computeIn(toValues.amount), fromValues.precision),
        });
      }
      if (fromValues.amount !== '' && toValues.amount !== '') {
        setToValues({
          ...toValues,
          amount: reduceBalance(pact.computeOut(fromValues.amount), toValues.precision),
        });
      }
    }
  }, [pact.ratio]);

  const buttonStatus = () => {
    let status = {
      0: { msg: 'Connect your KDA wallet', status: false },
      1: { msg: 'Enter An Amount', status: false },
      2: { msg: 'Supply', status: true },
      3: {
        msg: (token) => `Insufficient ${token} Balance`,
        status: false,
      },
      4: { msg: 'Pair does not exist yet', status: false },
      5: { msg: 'Pair Already Exists', status: false },
      6: { msg: 'Select different tokens', status: false },
    };
    if (!account.account.account) return status[0];
    if (selectedView === 'Create A Pair') {
      if (pairExist) {
        setSelectedView('Add Liquidity');
      } else return status[4];
    } else if (isNaN(pact.ratio)) {
      return status[4];
    } else if (!fromValues.amount || !toValues.amount) return status[1];
    else if (Number(fromValues.amount) > Number(fromValues.balance)) return { ...status[3], msg: status[3].msg(fromValues.coin) };
    else if (Number(toValues.amount) > Number(toValues.balance)) return { ...status[3], msg: status[3].msg(toValues.coin) };
    else if (fromValues.coin === toValues.coin) return status[6];
    else {
      if (isNaN(pact.ratio)) {
        return status[4];
      } else return status[2];
    }
  };

  const supply = async () => {
    if (selectedView === 'Create A Pair') {
      if (wallet.signing.method !== 'sign') {
        setLoading(true);
        const res = await liquidity.createTokenPairLocal(tokenData[fromValues.coin], tokenData[toValues.coin], fromValues.amount, toValues.amount);
        if (res === -1) {
          setLoading(false);
          alert('Incorrect password. If forgotten, you can reset it with your private key');
          return;
        } else {
          setShowReview(false);
          setShowTxModal(true);
          setLoading(false);
        }
      } else {
        console.log('not signed');
      }
    } else {
      if (wallet.signing.method !== 'sign' && wallet.signing.method !== 'none') {
        setLoading(true);
        const res = await liquidity.addLiquidityLocal(tokenData[fromValues.coin], tokenData[toValues.coin], fromValues.amount, toValues.amount);
        if (res === -1) {
          setLoading(false);
          alert('Incorrect password. If forgotten, you can reset it with your private key');
          return;
        } else {
          setShowReview(false);
          setShowTxModal(true);
          setLoading(false);
        }
      } else {
        setLoading(true);
        setShowReview(false);
        console.log('param,', tokenData[fromValues.coin], tokenData[toValues.coin], fromValues.amount, toValues.amount);
        const res = await liquidity.addLiquidityWallet(tokenData[fromValues.coin], tokenData[toValues.coin], fromValues.amount, toValues.amount);
        if (!res) {
          wallet.setIsWaitingForWalletAuth(true);
          /* pact.setWalletError(true); */
          /* walletError(); */
        } else {
          wallet.setWalletError(null);
          setSelectedView('Add Liquidity');
          setShowTxModal(true);
        }
        /* setShowTxModal(true) */
        setLoading(false);
        setFromValues({
          account: null,
          guard: null,
          balance: null,
          amount: '',
          coin: '',
        });
        setToValues({
          account: null,
          guard: null,
          balance: null,
          amount: '',
          coin: '',
        });
      }
    }
  };

  const swapValues = () => {
    const from = { ...fromValues };
    const to = { ...toValues };
    setFromValues({ ...to });
    setToValues({ ...from });
  };

  useEffect(() => {
    if (tokenSelectorType === 'from') {
      if (fromValues.coin === toValues.coin) {
        setToValues({
          amount: '',
          balance: '',
          coin: '',
          address: '',
          precision: 0,
        });
      }
    }
    if (tokenSelectorType === 'to') {
      if (toValues.coin === fromValues.coin) {
        setFromValues({
          amount: '',
          balance: '',
          coin: '',
          address: '',
          precision: 0,
        });
      }
    }
    setTokenSelectorType(null);
  }, [toValues, fromValues]);

  useEffect(() => {
    if (tokenSelectorType !== null) {
      handleTokenSelectorType();
    }
  }, [tokenSelectorType]);

  const handleTokenSelectorType = () => {
    if (gameEditionView) {
      openModal({
        title: 'Select a Token',
        closeModal: () => {
          setTokenSelectorType(null);
          closeModal();
        },
        content: (
          <GameEditionTokenSelectorContainer>
            <TokenSelectorModalContent
              selectedToken={selectedToken}
              tokenSelectorType={tokenSelectorType}
              onTokenClick={onTokenClick}
              onClose={() => {
                closeModal();
              }}
              fromToken={fromValues.coin}
              toToken={toValues.coin}
            />
          </GameEditionTokenSelectorContainer>
        ),
      });
    } else {
      modalContext.openModal({
        title: 'select a token',
        description: '',
        containerStyle: {
          //height: "100%",
          width: '75%',
        },
        onClose: () => {
          setTokenSelectorType(null);
          modalContext.closeModal();
        },
        content: (
          <TokenSelectorModalContent
            selectedToken={selectedToken}
            tokenSelectorType={tokenSelectorType}
            onTokenClick={onTokenClick}
            onClose={() => {
              modalContext.closeModal();
            }}
            fromToken={fromValues.coin}
            toToken={toValues.coin}
          />
        ),
      });
    }
  };

  return (
    <Container gameEditionView={gameEditionView} onAnimationEnd={() => setIsLogoVisible(true)} className="scrollbar-none">
      {/* <TokenSelectorModal
                show={tokenSelectorType !== null}
                selectedToken={selectedToken}
                onTokenClick={onTokenClick}
                fromToken={fromValues.coin}
                toToken={toValues.coin}
                onClose={() => setTokenSelectorType(null)}
            /> */}
      <TxView
        view={selectedView}
        show={showTxModal}
        token0={fromValues.coin}
        token1={toValues.coin}
        fromToken={fromValues.coin}
        toToken={toValues.coin}
        createTokenPair={() =>
          liquidity.createTokenPairLocal(tokenData[fromValues.coin].name, tokenData[toValues.coin].name, fromValues.amount, toValues.amount)
        }
        onClose={() => setShowTxModal(false)}
      />
      <WalletRequestView show={wallet.isWaitingForWalletAuth} error={wallet.walletError} onClose={() => onWalletRequestViewModalClose()} />
      <ReviewTxModal
        onClose={() => setShowReview(false)}
        fromValues={fromValues}
        toValues={toValues}
        supply={supply}
        loading={loading}
        show={showReview}
        liquidityView={selectedView}
      />

      {!gameEditionView && isLogoVisible && (
        <LogoContainer time={0.2}>
          <Logo />
        </LogoContainer>
      )}

      <TitleContainer gameEditionView={gameEditionView}>
        <Title
          gameEditionView={gameEditionView}
          style={{
            fontFamily: gameEditionView ? theme(themeMode).fontFamily.pressStartRegular : theme(themeMode).fontFamily.bold,
          }}
        >
          {!gameEditionView && (
            <ArrowBack
              style={{
                cursor: 'pointer',
                color: theme(themeMode).colors.white,
                marginRight: '15px',
                justifyContent: 'center',
              }}
              onClick={() => props.closeLiquidity()}
            />
          )}
          Add Liquidity
        </Title>
        {gameEditionView && <CloseGE style={{ cursor: 'pointer' }} onClick={() => props.closeLiquidity()} />}
        {!gameEditionView && (
          <HeaderItem headerItemStyle={{ alignItems: 'center', display: 'flex' }}>
            <CustomPopup trigger={<CogIcon />} on="click" offset={[10, 10]} position="bottom right">
              <SlippagePopupContent />
            </CustomPopup>
          </HeaderItem>
        )}
      </TitleContainer>
      <FormContainer
        gameEditionView={gameEditionView}
        footer={
          <ButtonContainer gameEditionView={gameEditionView}>
            <Button.Group fluid>
              <CustomButton disabled={!buttonStatus().status} onClick={() => setShowReview(true)}>
                {buttonStatus().msg}
              </CustomButton>
            </Button.Group>
          </ButtonContainer>
        }
      >
        {!gameEditionView && <GradientBorder />}
        <SwapForm
          fromValues={fromValues}
          setFromValues={setFromValues}
          toValues={toValues}
          setToValues={setToValues}
          setTokenSelectorType={setTokenSelectorType}
          setInputSide={setInputSide}
          swapValues={swapValues}
          setShowTxModal={setShowTxModal}
        />

        {fromValues.coin && toValues.coin && (
          <>
            <ResultContainer gameEditionView={gameEditionView}>
              <InnerRowContainer gameEditionView={gameEditionView}>
                <CustomLabel>{`${toValues.coin} per ${fromValues.coin}`}</CustomLabel>
                <Value gameEditionView={gameEditionView}>{reduceBalance(pact.getRatio(toValues.coin, fromValues.coin)) ?? '-'}</Value>
              </InnerRowContainer>
              <InnerRowContainer gameEditionView={gameEditionView}>
                <CustomLabel>{`${fromValues.coin} per ${toValues.coin}`}</CustomLabel>
                <Value gameEditionView={gameEditionView}>{reduceBalance(pact.getRatio1(toValues.coin, fromValues.coin)) ?? '-'}</Value>
              </InnerRowContainer>
              <InnerRowContainer gameEditionView={gameEditionView}>
                <CustomLabel>Share of Pool</CustomLabel>
                <Value gameEditionView={gameEditionView}>
                  {!pact.share(fromValues.amount) ? 0 : reduceBalance(pact.share(fromValues.amount) * 100)}%
                </Value>
              </InnerRowContainer>
            </ResultContainer>
          </>
        )}
      </FormContainer>
    </Container>
  );
};

export default LiquidityContainer;
