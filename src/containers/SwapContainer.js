import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { throttle, debounce } from 'throttle-debounce';
import { FadeIn } from '../components/shared/animations';
import TokenSelectorModal from '../components/swap/swap-modals/TokenSelectorModal';
import TxView from '../components/swap/swap-modals/TxView';
import WalletRequestView from '../components/swap/swap-modals/WalletRequestView';
import SwapButtonsForm from '../components/swap/SwapButtonsForm';
import SwapForm from '../components/swap/SwapForm';
import SwapResults from '../components/swap/SwapResults';
import tokenData from '../constants/cryptoCurrencies';
import { AccountContext } from '../contexts/AccountContext';
import { GameEditionContext } from '../contexts/GameEditionContext';
import { ModalContext } from '../contexts/ModalContext';
import { PactContext } from '../contexts/PactContext';
import { SwapContext } from '../contexts/SwapContext';
import { WalletContext } from '../contexts/WalletContext';
import theme from '../styles/theme';
import { getCorrectBalance, reduceBalance } from '../utils/reduceBalance';
import TokenSelectorModalContent from '../components/swap/swap-modals/TokenSelectorModalContent';
import { Logo } from '../assets';

const Container = styled(FadeIn)`
  width: 100%;
  margin-top: ${({ gameEditionView }) => (gameEditionView ? `0px` : ` 24px`)};
  max-width: ${({ gameEditionView }) => !gameEditionView && `500px`};
  margin-left: auto;
  margin-right: auto;
`;

const FormContainer = styled.div`
  position: ${({ gameEditionView }) => !gameEditionView && `relative`};
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: ${({ gameEditionView }) =>
    gameEditionView ? `10px 10px` : `32px 32px`};
  width: 100%;
  border-radius: 15px;
  border: ${({ gameEditionView }) =>
    gameEditionView ? `none` : ` 1px solid transparent`};

  background-clip: ${({ gameEditionView }) =>
    !gameEditionView && `padding-box`};
  backdrop-filter: ${({ gameEditionView }) => !gameEditionView && `blur(50px)`};
  opacity: 1;
  background: transparent;

  ${({ gameEditionView }) =>
    !gameEditionView &&
    `&:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1000;
    margin: -1px;
    border-radius: 10px;
    border-left: 1px solid #ed1cb5;
    border-right: 1px solid #39fffc;
    background-image: linear-gradient(to right, #ed1cb5, #ffa900, #39fffc),
      linear-gradient(to right, #ed1cb5, #ffa900, #39fffc);
    /* background: ${({ gameEditionView }) =>
      !gameEditionView &&
      'linear-gradient(to right, #ed1cb5, #ffa900, #39fffc)'}; */
    background-position: 0 0, 0 100%;
    background-size: 100% 1px;
    background-repeat: no-repeat;
  }`}

  /* 
  &:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:  no-repeat;
  background-size: 100%;
  background-position: bottom;
} */

  /* &:before {
    border-radius: inherit;

  /* & > *:not(:last-child) {
    margin-right: 32px;
  } */

  @media (max-width: ${({ theme: { mediaQueries } }) =>
    `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
    gap: 0px;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  position: ${({ gameEditionView }) => gameEditionView && 'absolute'};
  top: ${({ gameEditionView }) => gameEditionView && '10px'};
  justify-content: ${({ gameEditionView }) =>
    gameEditionView ? `center` : ` space-between`};
  margin-bottom: ${({ gameEditionView }) =>
    gameEditionView ? `0px` : ` 14px`};
  width: 100%;
`;
const Title = styled.span`
  font: ${({ gameEditionView }) =>
    gameEditionView
      ? `normal normal normal 16px/19px  ${theme.fontFamily.pressStartRegular}`
      : ` normal normal bold 32px/57px ${theme.fontFamily.bold}`};
  letter-spacing: 0px;
  color: ${({ theme: { colors }, gameEditionView }) =>
    gameEditionView ? colors.black : '#ffffff'};
  text-transform: ${({ gameEditionView }) =>
    gameEditionView ? `uppercase` : ` capitalize`};
`;

const GameEditionTokenSelectorContainer = styled.div`
  position: absolute;
  bottom: 75px;
  display: flex;
  flex-direction: column;
  width: 95%;
  height: 100%;
`;

const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${({ gameEditionView }) =>
    gameEditionView ? `0px` : ` 12px 0px 0px 0px`};
  padding: ${({ gameEditionView }) => (gameEditionView ? `0 10px` : ` 0px`)};
  flex-flow: column;
  width: 100%;
  /* position: ${({ gameEditionView }) => gameEditionView && 'absolute'}; */
  margin-top: ${({ gameEditionView }) => gameEditionView && '30px'};
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
    margin-bottom: 0px;
  }
`;

const LogoContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 45%;
  margin-left: auto;
  margin-right: auto;
  transform: translate(-50%, 0);
`;
const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: row;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: row;
  }
`;

const Label = styled.span`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.regular};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '10px' : '13px')};
  color: ${({ theme: { colors }, gameEditionView }) =>
    gameEditionView ? colors.black : '#ffffff'};
  text-transform: capitalize;
`;

const Value = styled.span`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '10px' : '13px')};
  line-height: 20px;
  color: ${({ theme: { colors }, gameEditionView }) =>
    gameEditionView ? colors.black : '#ffffff'};
`;

const SwapContainer = () => {
  const pact = useContext(PactContext);
  const swap = useContext(SwapContext);
  const account = useContext(AccountContext);
  const wallet = useContext(WalletContext);
  const modalContext = useContext(ModalContext);
  const { gameEditionView, openModal, closeModal } =
    useContext(GameEditionContext);
  const [tokenSelectorType, setTokenSelectorType] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [fromValues, setFromValues] = useState({
    amount: '',
    balance: '',
    coin: '',
    address: '',
    precision: 0,
  });
  const [toValues, setToValues] = useState({
    amount: '',
    balance: '',
    coin: '',
    address: '',
    precision: 0,
  });
  const [inputSide, setInputSide] = useState('');
  const [fromNote, setFromNote] = useState('');
  const [toNote, setToNote] = useState('');
  const [showTxModal, setShowTxModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingPair, setFetchingPair] = useState(false);
  const [noLiquidity, setNoLiquidity] = useState(false);
  const [priceImpact, setPriceImpact] = useState('');
  useEffect(() => {
    if (!isNaN(fromValues.amount)) {
      if (inputSide === 'from' && fromValues.amount !== '') {
        setToNote('(estimated)');
        setFromNote('');
        setInputSide(null);
        if (
          fromValues.coin !== '' &&
          toValues.coin !== '' &&
          !isNaN(pact.ratio)
        ) {
          if (fromValues.amount.length < 5) {
            throttle(
              500,
              setToValues({
                ...toValues,
                amount: reduceBalance(
                  // fromValues.amount / pact.ratio,
                  pact.computeOut(fromValues.amount),
                  toValues.precision
                ),
              })
            );
          } else {
            debounce(
              500,
              setToValues({
                ...toValues,
                amount: reduceBalance(
                  // fromValues.amount / pact.ratio,
                  pact.computeOut(fromValues.amount),
                  toValues.precision
                ).toFixed(toValues.precision),
              })
            );
          }
        }
      }
      if (isNaN(pact.ratio) || fromValues.amount === '') {
        setToValues((prev) => ({ ...prev, amount: '' }));
      }
    }
  }, [fromValues.amount]);
  useEffect(() => {
    if (!isNaN(toValues.amount)) {
      if (inputSide === 'to' && toValues.amount !== '') {
        setFromNote('(estimated)');
        setToNote('');
        setInputSide(null);
        if (
          fromValues.coin !== '' &&
          toValues.coin !== '' &&
          !isNaN(pact.ratio)
        ) {
          if (toValues.amount.length < 5) {
            throttle(
              500,
              setFromValues({
                ...fromValues,
                amount: reduceBalance(
                  // toValues.amount * pact.ratio,
                  pact.computeIn(toValues.amount),
                  fromValues.precision
                ),
              })
            );
            throttle(500, safeSetFrom(), fromValues.precision);
          } else {
            debounce(
              500,
              setFromValues({
                ...fromValues,
                amount: reduceBalance(
                  // toValues.amount * pact.ratio,
                  pact.computeIn(toValues.amount),
                  fromValues.precision
                ).toFixed(fromValues.precision),
              })
            );
            debounce(500, safeSetFrom(), fromValues.precision);
          }
        }
      }
      if (isNaN(pact.ratio) || toValues.amount === '') {
        setFromValues((prev) => ({ ...prev, amount: '' }));
      }
    }
  }, [toValues.amount]);
  useEffect(() => {
    if (!isNaN(pact.ratio)) {
      if (fromValues.amount !== '' && toValues.amount === '') {
        setToValues({
          ...toValues,
          amount: reduceBalance(
            pact.computeOut(fromValues.amount),
            toValues.precision
          ),
        });
      }
      if (fromValues.amount === '' && toValues.amount !== '') {
        setFromValues({
          ...fromValues,
          amount: reduceBalance(
            pact.computeIn(toValues.amount),
            fromValues.precision
          ),
        });
      }
      if (fromValues.amount !== '' && toValues.amount !== '') {
        setToValues({
          ...toValues,
          amount: reduceBalance(
            pact.computeOut(fromValues.amount),
            toValues.precision
          ),
        });
      }
    }
  }, [pact.ratio]);
  useEffect(() => {
    if (!isNaN(pact.ratio)) {
      setPriceImpact(
        pact.computePriceImpact(
          Number(fromValues.amount),
          Number(toValues.amount)
        )
      );
    } else {
      setPriceImpact('');
    }
  }, [
    fromValues.coin,
    toValues.coin,
    fromValues.amount,
    toValues.amount,
    pact.ratio,
  ]);
  useEffect(() => {
    const getBalance = async () => {
      if (account.account && toValues.coin !== '' && fromValues.coin !== '') {
        let acctOfFromValues = await account.getTokenAccount(
          tokenData[fromValues.coin]?.code,
          account.account.account,
          tokenSelectorType === 'from'
        );
        let acctOfToValues = await account.getTokenAccount(
          tokenData[toValues.coin]?.code,
          account.account.account,
          tokenSelectorType === 'to'
        );
        if (acctOfFromValues) {
          let balanceFrom = getCorrectBalance(acctOfFromValues.balance);
          setFromValues((prev) => ({
            ...prev,
            balance: balanceFrom,
          }));
        }
        if (acctOfToValues) {
          let balanceTo = getCorrectBalance(acctOfToValues.balance);
          setToValues((prev) => ({
            ...prev,
            balance: balanceTo,
          }));
        }
      }
    };
    getBalance();
  }, [toValues.amount, fromValues.amount]);

  useEffect(() => {
    const getReserves = async () => {
      if (toValues.coin !== '' && fromValues.coin !== '') {
        setFetchingPair(true);
        await pact.getPair(fromValues.address, toValues.address);
        await pact.getReserves(fromValues.address, toValues.address);
        setFetchingPair(false);
      }
    };
    getReserves();
  }, [fromValues.coin, toValues.coin]);
  useEffect(() => {
    if (swap.walletSuccess) {
      setLoading(false);
      setFromValues({ amount: '', balance: '', coin: '', address: '' });
      setToValues({ amount: '', balance: '', coin: '', address: '' });
      pact.setWalletSuccess(false);
    }
  }, [swap.walletSuccess]);
  const swapValues = () => {
    const from = { ...fromValues };
    const to = { ...toValues };
    setFromValues({ ...to });
    setToValues({ ...from });
    if (toNote === '(estimated)') {
      setFromNote('(estimated)');
      setToNote('');
    }
    if (fromNote === '(estimated)') {
      setToNote('(estimated)');
      setFromNote('');
    }
  };
  // Check if their is enough liquidity before setting the from amount
  const safeSetFrom = () => {
    setNoLiquidity(false);
    if (0 >= pact.computeIn(toValues.amount)) {
      setNoLiquidity(true);
      setFromValues({
        ...fromValues,
        amount: 0,
      });
    } else {
      setFromValues({
        ...fromValues,
        amount: reduceBalance(
          pact.computeIn(toValues.amount),
          fromValues.precision
        ),
      });
    }
  };
  const onTokenClick = async ({ crypto }) => {
    let balance;
    if (crypto.code === 'coin') {
      if (account.account) {
        balance = account.account.balance;
      }
    } else {
      let acct = await account.getTokenAccount(
        crypto.code,
        account.account.account,
        tokenSelectorType === 'from'
      );
      if (acct) {
        balance = getCorrectBalance(acct.balance);
      }
    }
    if (tokenSelectorType === 'from')
      setFromValues((prev) => ({
        ...prev,
        balance: balance,
        coin: crypto.name,
        address: crypto.code,
        precision: crypto.precision,
      }));
    if (tokenSelectorType === 'to')
      setToValues((prev) => ({
        ...prev,
        balance: balance,
        coin: crypto.name,
        address: crypto.code,
        precision: crypto.precision,
      }));
  };
  const onWalletRequestViewModalClose = () => {
    wallet.setIsWaitingForWalletAuth(false);
    wallet.setWalletError(null);
  };

  useEffect(() => {
    console.log('tokenSelectorType-----', tokenSelectorType);
    console.log('fromValues.coin-----', fromValues.coin);

    if (tokenSelectorType === 'from') return setSelectedToken(fromValues.coin);
    console.log('SETTEDD');
    console.log('fromValues.coin-----', fromValues.coin);
    console.log('selectedToken-----', selectedToken);
    if (tokenSelectorType === 'to') return setSelectedToken(toValues.coin);
    return setSelectedToken(null);
  }, [tokenSelectorType]);

  useEffect(() => {
    if (tokenSelectorType !== null) {
      handleTokenSelectorType();
    }
  }, [tokenSelectorType]);

  const handleTokenSelectorType = () => {
    console.log('I?M IN');
    console.log('selectedToken INNNN', selectedToken);
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
              onTokenClick={onTokenClick}
              onClose={() => {
                setTokenSelectorType(null);
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
        onBack: () => {
          modalContext.onBackModal();
          setTokenSelectorType(null);
        },
        onClose: () => {
          setTokenSelectorType(null);
          modalContext.closeModal();
        },
        content: (
          <TokenSelectorModalContent
            selectedToken={selectedToken}
            onTokenClick={onTokenClick}
            onClose={() => {
              setTokenSelectorType(null);
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
    <Container gameEditionView={gameEditionView}>
      {/* <TokenSelectorModal
        show={tokenSelectorType !== null}
        selectedToken={selectedToken}
        onTokenClick={onTokenClick}
        fromToken={fromValues.coin}
        toToken={toValues.coin}
        onClose={() => setTokenSelectorType(null)}
      /> */}

      <TxView
        show={showTxModal}
        selectedToken={selectedToken}
        onTokenClick={onTokenClick}
        onClose={() => setShowTxModal(false)}
      />
      <WalletRequestView
        show={wallet.isWaitingForWalletAuth}
        error={wallet.walletError}
        onClose={() => onWalletRequestViewModalClose()}
      />
      {!gameEditionView && (
        <LogoContainer>
          <Logo />
        </LogoContainer>
      )}

      <TitleContainer gameEditionView={gameEditionView}>
        <Title gameEditionView={gameEditionView}>Swap</Title>
      </TitleContainer>
      <FormContainer gameEditionView={gameEditionView}>
        <SwapForm
          fromValues={fromValues}
          setFromValues={setFromValues}
          toValues={toValues}
          setToValues={setToValues}
          fromNote={fromNote}
          toNote={toNote}
          setTokenSelectorType={setTokenSelectorType}
          setInputSide={setInputSide}
          swapValues={swapValues}
          setShowTxModal={setShowTxModal}
          /* handleTokenSelectorType={handleTokenSelectorType} */
        />
        {!isNaN(pact.ratio) &&
        fromValues.amount &&
        fromValues.coin &&
        toValues.amount &&
        toValues.coin ? (
          <SwapResults
            priceImpact={priceImpact}
            fromValues={fromValues}
            toValues={toValues}
          />
        ) : (
          <ResultContainer gameEditionView={gameEditionView}>
            <RowContainer gameEditionView={gameEditionView}>
              <Label gameEditionView={gameEditionView}>max slippage</Label>
              <Value gameEditionView={gameEditionView}>{`${
                pact.slippage * 100
              }%`}</Value>
            </RowContainer>
          </ResultContainer>
        )}
        <SwapButtonsForm
          setLoading={setLoading}
          fetchingPair={fetchingPair}
          fromValues={fromValues}
          setFromValues={setFromValues}
          toValues={toValues}
          setToValues={setToValues}
          fromNote={fromNote}
          ratio={pact.ratio}
          loading={loading}
          noLiquidity={noLiquidity}
          setShowTxModal={setShowTxModal}
        />
      </FormContainer>
    </Container>
  );
};
export default SwapContainer;
