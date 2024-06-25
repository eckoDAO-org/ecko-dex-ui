/* eslint-disable react-hooks/exhaustive-deps */
import { throttle, debounce } from 'throttle-debounce';
import React, { useEffect, useState } from 'react';
import { getCorrectBalance, reduceBalance } from '../../utils/reduceBalance';
import PixeledBlueContainer, { InfoContainer } from '../game-edition-v2/components/PixeledInfoContainerBlue';
import PressButtonToActionLabel from '../game-edition-v2/components/PressButtonToActionLabel';
import TokenSelectorModalContent from '../modals/swap-modals/TokenSelectorModalContent';
import TxView from '../modals/TxView';
import CustomButton from '../shared/CustomButton';
import { FlexContainer } from '../shared/FlexContainer';
import FormContainer from '../shared/FormContainer';
import Label from '../shared/Label';
import SwapForm from '../swap/SwapForm';
import TokenSelectorModalContentGE from '../../components/modals/swap-modals/TokenSelectorModalContentGE';
import WalletRequestView from '../../components/modals/WalletRequestView';
import { LIQUIDITY_VIEW } from '../../constants/liquidityView';
import { SuccessAddView } from '../modals/liquidity/LiquidityTxView';
// import { useInterval } from '../../hooks/useInterval';
import { useAccountContext, useGameEditionContext, useLiquidityContext, useModalContext, usePactContext, useWalletContext } from '../../contexts';
import reduceToken from '../../utils/reduceToken';
import ConnectWalletModal from '../modals/kdaModals/ConnectWalletModal';
import { isNaN } from 'lodash';

const DoubleSidedLiquidity = ({ pair, onPairChange }) => {
  const pact = usePactContext();
  const account = useAccountContext();
  const wallet = useWalletContext();
  const liquidity = useLiquidityContext();
  const modalContext = useModalContext();
  const { gameEditionView, openModal, closeModal, outsideToken, showTokens, setShowTokens, setOutsideToken } = useGameEditionContext();
  const [tokenSelectorType, setTokenSelectorType] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [fetchData, setFetchData] = useState(true);
  const [fetchingPair, setFetchingPair] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [inputSide, setInputSide] = useState('');
  const [loading, setLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [fromValues, setFromValues] = useState({
    amount: '',
    balance: '',
    coin: pact.allTokens?.[pair?.token0] ? pair?.token0 : 'KDX',
    precision: pact.allTokens?.[pair?.token0] ? pact.allTokens?.[pair?.token0]?.precision : 12,
  });
  const [toValues, setToValues] = useState({
    amount: '',
    balance: account.account.balance || '',
    coin: pact.allTokens?.[pair?.token1] ? pair?.token1 : pair?.token0 === 'KDA' ? 'KDX' : 'KDA',
    precision: pact.allTokens?.[pair?.token1] ? pact.allTokens?.[pair?.token1]?.precision : 12,
  });

  // update the balance after a transaction send or change account
  useEffect(() => {
    setBalanceLoading(true);
    const getBalance = async () => {
      if (account.account) {
        let acctOfFromValues = await account.getTokenAccount(
          pact.allTokens[fromValues.coin]?.code,
          account.account.account,
          tokenSelectorType === 'from'
        );
        let acctOfToValues = await account.getTokenAccount(pact.allTokens[toValues.coin]?.code, account.account.account, tokenSelectorType === 'to');
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
      setBalanceLoading(false);
    };
    getBalance();
  }, [account.fetchAccountBalance, account.account.account]);

  //reset fetchAccountBalance change page
  useEffect(() => {
    account.setFetchAccountBalance(true);
    return () => {
      account.setFetchAccountBalance(false);
    };
  }, []);

  useEffect(async () => {
    if (tokenSelectorType === 'from') setSelectedToken(fromValues?.coin);
    if (tokenSelectorType === 'to') setSelectedToken(toValues?.coin);
    else setSelectedToken(null);
  }, [tokenSelectorType]);

  /////// TOKENS RATIO LOGIC TO UPDATE INPUT BALANCE AND VALUES //////////
  useEffect(async () => {
    if (fetchData) {
      setFetchingPair(true);
      if (toValues.coin !== '' && fromValues.coin !== '') {
        await pact.getReserves(pact.allTokens?.[fromValues?.coin]?.code, pact.allTokens?.[toValues?.coin]?.code);
      }
      setFetchingPair(false);
      setFetchData(false);
    }
  }, [fetchData]); //the getPair call is invoked when is selected a token

  /// POLLING ON UPDATE PACT RATIO
  // useInterval(async () => {
  //   if (!isNaN(pact.ratio)) {
  //     await pact.getReserves(pact.allTokens?.[fromValues?.coin]?.code, pact.allTokens?.[toValues?.coin]?.code);
  //   }
  // }, 10000);

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
    setFetchData(true);
  };

  const onSelectToken = async (crypto) => {
    if (gameEditionView && showTokens) {
      await setOutsideToken((prev) => ({ ...prev, token: crypto }));
      await setShowTokens(false);
    }
    if (tokenSelectorType === 'from' && fromValues.coin === crypto.name) return;
    if (tokenSelectorType === 'to' && toValues.coin === crypto.name) return;
    if ((tokenSelectorType === 'from' && fromValues.coin !== crypto.name) || (tokenSelectorType === 'to' && toValues.coin !== crypto.name)) {
      onTokenClick({ crypto });
    }
  };

  useEffect(() => {
    onPairChange(fromValues.coin, toValues.coin);
  }, [fromValues.coin, toValues.coin]);

  const onWalletRequestViewModalClose = () => {
    wallet.setIsWaitingForWalletAuth(false);
    wallet.setWalletError(null);
  };

  useEffect(() => {
    if (inputSide === 'from' && fromValues.amount !== '') {
      setInputSide(null);
      if (fromValues.coin !== '' && toValues.coin !== '' && !isNaN(pact.ratio)) {
        if (pact.ratio) {
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
    }
    if (isNaN(pact.ratio) || fromValues.amount === '') {
      setToValues((prev) => ({ ...prev, amount: '' }));
    }
  }, [fromValues.amount]);

  useEffect(() => {
    if (inputSide === 'to' && toValues.amount !== '') {
      setInputSide(null);
      if (fromValues.coin !== '' && toValues.coin !== '' && !isNaN(pact.ratio)) {
        if (pact.ratio) {
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
    }
    if (isNaN(pact.ratio) || toValues.amount === '') {
      setFromValues((prev) => ({ ...prev, amount: '' }));
    }
  }, [toValues.amount]);

  useEffect(() => {
    if (!isNaN(pact.ratio)) {
      if (pact.ratio !== 0) {
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
    }
  }, [pact.ratio]);

  const buttonStatus = () => {
    let status = {
      0: { msg: 'Connect Wallet', status: true },
      1: { msg: 'Enter Amount', status: false },
      2: { msg: 'Supply', status: true },
      3: {
        msg: (token) => `Insufficient ${token} Balance`,
        status: false,
      },
      4: { msg: 'Pair does not exist yet', status: false },
      5: { msg: 'Pair Already Exists', status: false },
      6: { msg: 'Select different tokens', status: false },
      7: { msg: 'Fetching Pair...', status: false },
    };
    if (!account.account.account) return status[0];
    if (fetchingPair) return status[7];
    if (isNaN(pact.ratio)) {
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
    const res = await liquidity.addLiquidityWallet(
      pact.allTokens[fromValues.coin],
      pact.allTokens[toValues.coin],
      reduceBalance(fromValues.amount, pact.allTokens[fromValues.coin].precision),
      reduceBalance(toValues.amount, pact.allTokens[toValues.coin].precision)
    );
    if (!res) {
      wallet.setIsWaitingForWalletAuth(true);
    } else {
      wallet.setWalletError(null);
      setShowTxModal(true);
    }
  };

  // to reset the input data when selected the same coin
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

  // to handle token for game edition from token list
  useEffect(() => {
    if (outsideToken?.token && gameEditionView) {
      if (outsideToken?.tokenSelectorType === 'from' && fromValues.coin === outsideToken?.token.name) return;
      if (outsideToken?.tokenSelectorType === 'to' && toValues?.coin === outsideToken?.token.name) return;
      if (
        (outsideToken.tokenSelectorType === 'from' && fromValues.coin !== outsideToken?.token.name) ||
        (outsideToken.tokenSelectorType === 'to' && toValues?.coin !== outsideToken?.token.name)
      ) {
        onTokenClick({ crypto: outsideToken?.token });
        closeModal();
      }
    }
  }, [outsideToken, gameEditionView]);

  useEffect(() => {
    if (tokenSelectorType !== null) {
      handleTokenSelectorType();
    }
  }, [tokenSelectorType]);

  const handleTokenSelectorType = () => {
    if (gameEditionView) {
      openModal({
        titleFontSize: 32,
        title: 'Select',
        type: 'arcade-dark',
        onClose: () => {
          setTokenSelectorType(null);
          closeModal();
        },
        content: (
          <FlexContainer className="column w-100 h-100 justify-ce align-ce text-ce">
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
          </FlexContainer>
        ),
      });
    } else {
      modalContext.openModal({
        title: 'Select',
        description: '',

        onClose: () => {
          setTokenSelectorType(null);
          modalContext.closeModal();
        },
        content: (
          <TokenSelectorModalContent
            selectedToken={selectedToken}
            token={tokenSelectorType === 'from' ? fromValues.coin : toValues.coin}
            onSelectToken={onSelectToken}
            onClose={() => {
              modalContext.closeModal();
            }}
          />
        ),
      });
    }
  };

  const onAddLiquidity = () => {
    setLoading(true);
    pact.txSend();
    setLoading(false);

    modalContext.closeModal();
    setShowTxModal(false);
    setFromValues({
      ...fromValues,
      amount: '',
    });
    setToValues({
      ...toValues,
      amount: '',
    });
  };

  const swapValues = () => {
    if (!balanceLoading) {
      const from = { ...fromValues };
      const to = { ...toValues };
      setFromValues({ ...to });
      setToValues({ ...from });
    }
    setFetchData(true);
  };

  // trigger for open the preview modal
  useEffect(() => {
    if (showTxModal) {
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
            setShowTxModal(false);
            closeModal();
          },
          content: (
            <TxView
              onClose={() => {
                setShowTxModal(false);
                closeModal();
              }}
              view={LIQUIDITY_VIEW.ADD_LIQUIDITY}
              token0={fromValues.coin}
              token1={toValues.coin}
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
            >
              <SuccessAddView token0={pair.token0} token1={pair.token1} label="Add Liquidity" loading={loading} onClick={onAddLiquidity} />
            </TxView>
          ),
        });
      }
    }
  }, [showTxModal]);

  return (
    <>
      <WalletRequestView show={wallet.isWaitingForWalletAuth} error={wallet.walletError} onClose={() => onWalletRequestViewModalClose()} />

      <FormContainer
        style={{ justifyContent: 'space-between' }}
        gameEditionView={gameEditionView}
        footer={
          gameEditionView ? (
            <FlexContainer className="justify-ce w-100" style={{ zIndex: 1 }}>
              {buttonStatus().status === true ? (
                <PressButtonToActionLabel actionLabel="add liquidity" />
              ) : (
                <Label geCenter geColor="yellow" geFontSize={20}>
                  {buttonStatus().msg}
                </Label>
              )}
            </FlexContainer>
          ) : (
            <FlexContainer className="justify-ce w-100" style={{ marginTop: 16 }}>
              <CustomButton
                fluid
                type="secondary"
                disabled={!buttonStatus().status}
                onClick={() => {
                  if (!account.account.account) {
                    return modalContext.openModal({
                      title: account?.account.account ? 'wallet connected' : 'Connect Wallet',
                      description: account?.account.account ? `Account ID: ${reduceToken(account.account.account)}` : '',
                      content: <ConnectWalletModal />,
                    });
                  } else {
                    supply();
                  }
                }}
              >
                {buttonStatus().msg}
              </CustomButton>
            </FlexContainer>
          )
        }
      >
        <SwapForm
          fromValues={fromValues}
          setFromValues={setFromValues}
          toValues={toValues}
          setToValues={setToValues}
          setTokenSelectorType={setTokenSelectorType}
          setInputSide={setInputSide}
          swapValues={swapValues}
          setShowTxModal={setShowTxModal}
          label="Amount"
        />

        {fromValues.coin && toValues.coin && (
          <>
            {gameEditionView ? (
              <>
                <InfoContainer style={{ marginTop: 16 }}>
                  <PixeledBlueContainer
                    label={`${toValues.coin}/${fromValues.coin}`}
                    value={reduceBalance(pact.getRatio(toValues.coin, fromValues.coin)) ?? '-'}
                  />
                  <PixeledBlueContainer
                    label={`${fromValues.coin}/${toValues.coin}`}
                    value={reduceBalance(pact.getRatio1(fromValues.coin, toValues.coin)) ?? '-'}
                  />
                  <PixeledBlueContainer
                    label="pool share"
                    value={`${!pact.share(fromValues.amount) ? 0 : (pact.share(fromValues.amount) * 100).toPrecision(4)} %`}
                  />
                </InfoContainer>
              </>
            ) : (
              <>
                <div className="flex justify-sb" style={{ marginTop: 16 }}>
                  <FlexContainer className="column w-100">
                    <Label fontSize={13}>{`${toValues.coin}/${fromValues.coin}`}</Label>
                    <Label fontSize={13} labelStyle={{ textAlign: 'end' }}>
                      {pact.pairReserve.token0 === 0 && pact.pairReserve.token1 === 0
                        ? pact.getRatioFirstAddLiquidity(toValues.coin, toValues.amount, fromValues.coin, fromValues.amount)
                        : reduceBalance(pact.getRatio(toValues.coin, fromValues.coin)) < 0.000001
                        ? '< 0.000001'
                        : reduceBalance(pact.getRatio(toValues.coin, fromValues.coin)) ?? '-'}
                    </Label>
                  </FlexContainer>
                  <FlexContainer className="column align-ce w-100">
                    <Label fontSize={13}>{`${fromValues.coin}/${toValues.coin}`}</Label>
                    <Label fontSize={13} labelStyle={{ textAlign: 'end' }}>
                      {pact.pairReserve.token0 === 0 && pact.pairReserve.token1 === 0
                        ? pact.getRatioFirstAddLiquidityInverse(toValues.coin, toValues.amount, fromValues.coin, fromValues.amount)
                        : reduceBalance(pact.getRatio1(fromValues.coin, toValues.coin)) < 0.000001
                        ? '< 0.000001'
                        : reduceBalance(pact.getRatio1(fromValues.coin, toValues.coin)) ?? '-'}
                    </Label>
                  </FlexContainer>
                  <FlexContainer className="column align-fe w-100">
                    <Label fontSize={13}>Pool Share</Label>
                    <Label fontSize={13} labelStyle={{ textAlign: 'end' }}>
                      {!pact.share(fromValues.amount) ? 0 : (pact.share(fromValues.amount) * 100).toPrecision(4)} %
                    </Label>
                  </FlexContainer>
                </div>
              </>
            )}
          </>
        )}
      </FormContainer>
    </>
  );
};

export default DoubleSidedLiquidity;
