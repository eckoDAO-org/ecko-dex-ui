/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import styled, { css } from 'styled-components/macro';
import { throttle, debounce } from 'throttle-debounce';
import { ModalContext } from '../../contexts/ModalContext';
import { AccountContext } from '../../contexts/AccountContext';
import { WalletContext } from '../../contexts/WalletContext';
import { LiquidityContext } from '../../contexts/LiquidityContext';
import { PactContext } from '../../contexts/PactContext';
import { LightModeContext } from '../../contexts/LightModeContext';
import { GameEditionContext, GE_DESKTOP_CONFIGURATION } from '../../contexts/GameEditionContext';
import { reduceBalance, getCorrectBalance } from '../../utils/reduceBalance';
import WalletRequestView from '../../components/swap/swap-modals/WalletRequestView';
import { ArrowBack, CogIcon } from '../../assets';
import Label from '../../components/shared/Label';
import CustomButton from '../../components/shared/CustomButton';
import ReviewTxModal from '../../components/modals/liquidity/ReviewTxModal';
import TxView from '../../components/swap/swap-modals/TxView';
import tokenData from '../../constants/cryptoCurrencies';
import SwapForm from '../../components/swap/SwapForm';
import TokenSelectorModalContent from '../../components/swap/swap-modals/TokenSelectorModalContent';
import TokenSelectorModalContentGE from '../../components/swap/swap-modals/TokenSelectorModalContentGE';
import FormContainer from '../../components/shared/FormContainer';
import GradientBorder from '../../components/shared/GradientBorder';
import HeaderItem from '../../components/shared/HeaderItem';
import CustomPopup from '../../components/shared/CustomPopup';
import SlippagePopupContent from '../../components/layout/header/SlippagePopupContent';
import BackgroundLogo from '../../components/shared/BackgroundLogo';
import browserDetection from '../../utils/browserDetection';
import { theme } from '../../styles/theme';
import PixeledInfoContainerBlue from '../../components/game-edition-v2/components/PixeledInfoContainerBlue';
import { LIQUIDITY_VIEW } from '../../constants/liquidityView';
import PressButtonToActionLabel from '../../components/game-edition-v2/components/PressButtonToActionLabel';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  justify-content: ${({ $gameEditionView }) => ($gameEditionView ? 'space-between' : 'center')};
  ${({ $gameEditionView }) => {
    if ($gameEditionView) {
      return css`
        justify-content: space-between;
        width: 100%;
      `;
    }
    return css`
      justify-content: center;
      max-width: 550px;
      width: 550px;
    `;
  }}
`;

const TitleContainer = styled.div`
  display: flex;
  padding: ${({ gameEditionView }) => (gameEditionView ? '0px 10px' : '0px !important')};
  justify-content: space-between;
  margin-bottom: 14px;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${browserDetection() === 'SAFARI' ? '0px' : '16px'};
  width: 100%;
`;

const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 16px 0px 0px 0px;
  flex-flow: column;
  width: 100%;
  padding: 0;

  ${({ gameEditionView }) => {
    if (gameEditionView) {
      return css`
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        margin: 10px 0px 0px;
        padding: 0px 10px;
        width: ${GE_DESKTOP_CONFIGURATION.displayWidth}px;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        & > div:not(:last-child) {
          margin-right: 15px;
        }
      `;
    }
  }}

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    margin: ${({ gameEditionView }) => gameEditionView && `10px 0px 5px 0px`};
    flex-flow: column;
  }

  & > *:not(:last-child) {
    margin-bottom: ${({ gameEditionView }) => !gameEditionView && `10px`};
  }
`;

const InnerRowContainer = styled(PixeledInfoContainerBlue)`
  ${({ gameEditionView }) => {
    if (!gameEditionView) {
      return css`
        justify-content: space-between;
        flex-flow: row;
      `;
    }
  }}
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: ${({ gameEditionView }) => (gameEditionView ? 'column' : `row`)};
  }
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
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const LabelContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: ${({ gameEditionView }) => !gameEditionView && '1'};
`;

const LiquidityContainer = ({ selectedView, setSelectedView, pair, closeLiquidity }) => {
  const pact = useContext(PactContext);
  const account = useContext(AccountContext);
  const wallet = useContext(WalletContext);
  const liquidity = useContext(LiquidityContext);
  const modalContext = useContext(ModalContext);
  const { themeMode } = useContext(LightModeContext);
  const { gameEditionView, openModal, closeModal, isSwapping, setIsSwapping } = useContext(GameEditionContext);
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
    if (pair?.token0 && fromValues === initialStateValue) {
      handleTokenValue('from', tokenData[pair?.token0]);
    }
  }, [pair?.token0]);

  useEffect(() => {
    setInputSide('to');
    if (pair?.token1 && toValues === initialStateValue) {
      handleTokenValue('to', tokenData[pair?.token1]);
    }
  }, [pair?.token1]);
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
      if (selectedView === LIQUIDITY_VIEW.ADD_LIQUIDITY) {
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
      if (selectedView === LIQUIDITY_VIEW.ADD_LIQUIDITY) {
        setFromValues((prev) => ({ ...prev, amount: '' }));
      }
    }
  }, [toValues.amount]);

  useEffect(() => {
    if (wallet.walletSuccess) {
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
    if (selectedView === LIQUIDITY_VIEW.CREATE_A_PAIR) {
      if (pairExist) {
        setSelectedView(LIQUIDITY_VIEW.ADD_LIQUIDITY);
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
    if (selectedView === LIQUIDITY_VIEW.CREATE_A_PAIR) {
      if (wallet.signing.method !== 'sign') {
        const res = await liquidity.createTokenPairLocal(tokenData[fromValues.coin], tokenData[toValues.coin], fromValues.amount, toValues.amount);
        if (res === -1) {
          alert('Incorrect password. If forgotten, you can reset it with your private key');
          return;
        } else {
          setShowReview(false);
          setShowTxModal(true);
        }
      } else {
        console.log('not signed');
      }
    } else {
      if (wallet.signing.method !== 'sign' && wallet.signing.method !== 'none') {
        const res = await liquidity.addLiquidityLocal(tokenData[fromValues.coin], tokenData[toValues.coin], fromValues.amount, toValues.amount);
        if (res === -1) {
          alert('Incorrect password. If forgotten, you can reset it with your private key');
          return;
        } else {
          setShowReview(false);
          setShowTxModal(true);
        }
      } else {
        setShowReview(false);
        console.log('param,', tokenData[fromValues.coin], tokenData[toValues.coin], fromValues.amount, toValues.amount);
        const res = await liquidity.addLiquidityWallet(tokenData[fromValues.coin], tokenData[toValues.coin], fromValues.amount, toValues.amount);
        if (!res) {
          wallet.setIsWaitingForWalletAuth(true);
          /* pact.setWalletError(true); */
          /* walletError(); */
        } else {
          wallet.setWalletError(null);
          setSelectedView(LIQUIDITY_VIEW.ADD_LIQUIDITY);
          setShowTxModal(true);
        }
        /* setShowTxModal(true) */
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
            <TokenSelectorModalContentGE
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
          minWidth: '0px',
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

  useEffect(() => {
    if (showTxModal) {
      if (gameEditionView) {
        openModal({
          title: 'transaction details',
          closeModal: () => {
            setShowTxModal(false);
            closeModal();
          },
          content: (
            <TxView
              onClose={() => {
                setShowTxModal(false);
                closeModal();
              }}
              view={selectedView}
              token0={fromValues.coin}
              token1={toValues.coin}
              createTokenPair={() =>
                liquidity.createTokenPairLocal(tokenData[fromValues.coin].name, tokenData[toValues.coin].name, fromValues.amount, toValues.amount)
              }
            />
          ),
        });
      } else {
        modalContext.openModal({
          title: 'transaction details',
          description: '',

          onClose: () => {
            setShowTxModal(false);
            modalContext.closeModal();
          },
          content: (
            <TxView
              onClose={() => {
                setShowTxModal(false);
                modalContext.closeModal();
              }}
              view={selectedView}
              token0={fromValues.coin}
              token1={toValues.coin}
              createTokenPair={() =>
                liquidity.createTokenPairLocal(tokenData[fromValues.coin].name, tokenData[toValues.coin].name, fromValues.amount, toValues.amount)
              }
            />
          ),
        });
      }
    }
  }, [showTxModal]);

  useEffect(() => {
    if (showReview) {
      if (gameEditionView) {
        openModal({
          title: 'transaction details',
          closeModal: () => {
            setShowReview(false);
            closeModal();
          },
          content: <ReviewTxModal fromValues={fromValues} toValues={toValues} supply={supply} liquidityView={selectedView} />,
        });
      } else {
        modalContext.openModal({
          title: 'transaction details',
          description: '',
          onClose: () => {
            setShowReview(false);
            modalContext.closeModal();
          },
          content: <ReviewTxModal fromValues={fromValues} toValues={toValues} supply={supply} liquidityView={selectedView} />,
        });
      }
    }
  }, [showReview]);

  return (
    <Container $gameEditionView={gameEditionView} onAnimationEnd={() => setIsLogoVisible(true)} className="scrollbar-none">
      <WalletRequestView show={wallet.isWaitingForWalletAuth} error={wallet.walletError} onClose={() => onWalletRequestViewModalClose()} />

      {!gameEditionView && isLogoVisible && <BackgroundLogo />}

      <TitleContainer gameEditionView={gameEditionView}>
        <Label fontSize={32} geCenter fontFamily="bold" geFontSize={52} geLabelStyle={{ lineHeight: '32px' }} onClose={() => closeLiquidity()}>
          {!gameEditionView && (
            <ArrowBack
              style={{
                cursor: 'pointer',
                color: theme(themeMode).colors.white,
                marginRight: '15px',
                justifyContent: 'center',
              }}
              onClick={() => closeLiquidity()}
            />
          )}
          Add Liquidity
        </Label>
        {/* {gameEditionView && <CloseGE style={{ cursor: 'pointer' }} onClick={() => props.closeLiquidity()} />} */}
        {!gameEditionView && (
          <HeaderItem headerItemStyle={{ alignItems: 'center', display: 'flex' }}>
            <CustomPopup trigger={<CogIcon />} on="click" offset={[10, 10]} position="bottom right">
              <SlippagePopupContent />
            </CustomPopup>
          </HeaderItem>
        )}
      </TitleContainer>
      <FormContainer
        style={{ justifyContent: 'space-between' }}
        gameEditionView={gameEditionView}
        footer={
          gameEditionView ? (
            <LabelContainer gameEditionView={gameEditionView}>
              {buttonStatus().status === true ? (
                <PressButtonToActionLabel button="B" actionLabel="add liquidity" />
              ) : (
                <Label geCenter geColor="yellow" geFontSize={20}>
                  {buttonStatus().msg}
                </Label>
              )}
            </LabelContainer>
          ) : (
            <ButtonContainer>
              <CustomButton
                fluid
                type={buttonStatus().status === true ? 'secondary' : 'primary'}
                disabled={!buttonStatus().status}
                onClick={() => setShowReview(true)}
              >
                {buttonStatus().msg}
              </CustomButton>
            </ButtonContainer>
          )
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
                <Label fontSize={13} geFontSize={20} geColor="blue">{`${toValues.coin} per ${fromValues.coin}`}</Label>
                <Label geFontSize={28} fontSize={13} fontFamily="bold">
                  {reduceBalance(pact.getRatio(toValues.coin, fromValues.coin)) ?? '-'}
                </Label>
              </InnerRowContainer>
              <InnerRowContainer gameEditionView={gameEditionView}>
                <Label fontSize={13} geFontSize={20} geColor="blue">{`${fromValues.coin} per ${toValues.coin}`}</Label>
                <Label geFontSize={28} fontSize={13} fontFamily="bold">
                  {reduceBalance(pact.getRatio1(toValues.coin, fromValues.coin)) ?? '-'}
                </Label>
              </InnerRowContainer>
              <InnerRowContainer gameEditionView={gameEditionView}>
                <Label fontSize={13} geFontSize={20} geColor="blue">
                  Share of Pool
                </Label>
                <Label geFontSize={28} fontSize={13} fontFamily="bold">
                  {!pact.share(fromValues.amount) ? 0 : reduceBalance(pact.share(fromValues.amount) * 100)}%
                </Label>
              </InnerRowContainer>
            </ResultContainer>
          </>
        )}
      </FormContainer>
    </Container>
  );
};

export default LiquidityContainer;
