/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { getTokenBalanceAccount } from '../../api/pact';
import { ArrowDown } from '../../assets';
import { useAccountContext, useLiquidityContext, useModalContext, usePactContext, useWalletContext } from '../../contexts';
// import { useInterval } from '../../hooks/useInterval';
import noExponents from '../../utils/noExponents';
import { extractDecimal, getCorrectBalance, getDecimalPlaces, humanReadableNumber, limitDecimalPlaces } from '../../utils/reduceBalance';
import reduceToken from '../../utils/reduceToken';
import ConnectWalletModal from '../modals/kdaModals/ConnectWalletModal';
import { SuccessAddSigleSideView } from '../modals/liquidity/LiquidityTxView';
import SelectPoolModal from '../modals/liquidity/SelectPoolModal';
import TokenSelectorModalContent from '../modals/swap-modals/TokenSelectorModalContent';
import TxView from '../modals/TxView';
import WalletRequestView from '../modals/WalletRequestView';
import CustomButton from '../shared/CustomButton';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import Input from '../shared/Input';
import InputToken from '../shared/InputToken';
import Label from '../shared/Label';

const SingleSidedLiquidity = ({ pair, pools, onPairChange, apr }) => {
  const modalContext = useModalContext();
  const { addOneSideLiquidityWallet } = useLiquidityContext();
  const wallet = useWalletContext();
  const pact = usePactContext();
  const account = useAccountContext();
  const [fetchingPair, setFetchingPair] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);
  const [showTxModal, setShowTxModal] = useState(false);

  const [fromValue, setFromValue] = useState({
    coin: pair?.token0 || 'KDX',
    account: '',
    guard: null,
    balance: '',
    amount: '',
    precision: 12,
  });

  const [loading, setLoading] = useState(false);

  // update the balance after a transaction send or change account
  useEffect(() => {
    if (account.fetchAccountBalance) {
      handleTokenValue(pair?.token0 || 'KDX');
    }
  }, [account.fetchAccountBalance, account.account.account]);

  //reset fetchAccountBalance change page
  useEffect(() => {
    account.setFetchAccountBalance(true);
    return () => {
      account.setFetchAccountBalance(false);
    };
  }, []);

  useEffect(() => {
    if (pair?.token0) {
      setSelectedPool(pools.find((p) => p.token0 === pair.token0 || p.token1 === pair.token0));
    } else {
      setSelectedPool(pools[0]);
    }
  }, []);

  useEffect(async () => {
    if (selectedPool) {
      onPairChange(selectedPool?.token1, selectedPool?.token0);

      setFetchingPair(true);
      if (selectedPool?.token0 === fromValue.coin) {
        await pact.getReserves(pact.allTokens?.[selectedPool?.token0]?.code, pact.allTokens?.[selectedPool?.token1]?.code);
      } else {
        await pact.getReserves(pact.allTokens?.[selectedPool?.token1]?.code, pact.allTokens?.[selectedPool?.token0]?.code);
      }
      setFetchingPair(false);
    }
  }, [fromValue?.coin, selectedPool]);

  /// POLLING ON UPDATE PACT RATIO
  // useInterval(async () => {
  //   if (!isNaN(pact.ratio)) {
  //     await pact.getReserves(pact.allTokens?.[selectedPool?.token0]?.code, pact.allTokens?.[selectedPool?.token1]?.code);
  //   }
  // }, 10000);

  const handleTokenValue = async (token) => {
    const crypto = pact.allTokens[token];

    let balance;
    if (crypto?.code === 'coin') {
      if (account.account) {
        balance = account.account.balance;
      }
    } else {
      try {
        let data = await getTokenBalanceAccount(crypto.code, account.account.account);
        if (data.result.status === 'success') {
          balance = getCorrectBalance(data.result.data.balance);
        }
      } catch (e) {
        console.log('error', e);
      }
    }
    setFromValue((prev) => ({
      ...prev,
      balance: balance,
      coin: crypto?.name,
      precision: crypto?.precision,
    }));
    account.setFetchAccountBalance(false);
    // onPairChange(token);
  };

  const openTokenSelectorModal = () => {
    modalContext.openModal({
      title: 'Select',
      description: '',

      onClose: () => {
        modalContext.closeModal();
      },
      content: (
        <TokenSelectorModalContent
          token={fromValue.coin}
          tokensToKeep={[selectedPool?.token0, selectedPool?.token1]}
          onSelectToken={async (crypto) => await handleTokenValue(crypto.name)}
          onClose={() => {
            modalContext.closeModal();
          }}
        />
      ),
    });
  };

  const supply = async () => {
    const token1 = selectedPool?.token0 === fromValue.coin ? selectedPool?.token1 : selectedPool?.token0;
    const res = await addOneSideLiquidityWallet(
      pact.allTokens[fromValue.coin],
      pact.allTokens[token1],
      Number(fromValue?.amount).toFixed(fromValue.precision)
    );
    if (!res) {
      wallet.setIsWaitingForWalletAuth(true);
      /* pact.setWalletError(true); */
      /* walletError(); */
    } else {
      wallet.setWalletError(null);
      setShowTxModal(true);
    }
  };

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
      8: { msg: 'The pool is empty', status: false },
    };
    if (!account.account.account) return status[0];
    if (fetchingPair) {
      return status[7];
    }
    if (extractDecimal(selectedPool?.reserves[0]) === 0 && extractDecimal(selectedPool?.reserves[1]) === 0) {
      return status[8];
    }
    if (isNaN(pact.ratio)) {
      return status[4];
    } else if (!fromValue.amount) return status[1];
    else if (Number(fromValue.amount) > Number(fromValue.balance)) return { ...status[3], msg: status[3].msg(fromValue.coin) };
    else {
      if (isNaN(pact.ratio)) {
        return status[4];
      } else return status[2];
    }
  };

  const onWalletRequestViewModalClose = () => {
    wallet.setIsWaitingForWalletAuth(false);
    wallet.setWalletError(null);
  };

  const onAddSingleLiquidity = () => {
    setLoading(true);
    pact.txSend();

    setLoading(false);
    modalContext.closeModal();
    setShowTxModal(false);
  };

  useEffect(() => {
    if (showTxModal === false) {
      setFromValue((prev) => ({
        ...prev,
        amount: '',
      }));
    }
  }, [showTxModal]);

  useEffect(() => {
    if (showTxModal) {
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
            <SuccessAddSigleSideView
              apr={apr}
              multiplier={selectedPool?.multiplier}
              initialAmount={fromValue.amount}
              token0={fromValue.coin}
              token1={selectedPool?.token0 === fromValue.coin ? selectedPool?.token1 : selectedPool?.token0}
              label="Add Liquidity"
              loading={loading}
              onClick={onAddSingleLiquidity}
            />
          </TxView>
        ),
      });
    }
  }, [showTxModal]);

  return (
    <>
      <WalletRequestView show={wallet.isWaitingForWalletAuth} error={wallet.walletError} onClose={() => onWalletRequestViewModalClose()} />

      <FlexContainer className="column background-fill" gap={16} withGradient style={{ padding: 24 }}>
        <Label fontSize={13}>Pool</Label>
        <CustomButton
          type="primary-light"
          borderOpacity
          buttonStyle={{ borderRadius: 4, height: 40, marginBottom: 8 }}
          onClick={() => {
            modalContext.openModal({
              title: 'Select',

              onClose: () => {
                modalContext.closeModal();
              },
              content: (
                <SelectPoolModal
                  pools={pools}
                  onSelect={(pool) => {
                    setSelectedPool(pool);
                    modalContext.closeModal();
                    //setFromValue((prev) => ({ ...prev, coin: pool.token0 }));
                    handleTokenValue(pool.token0);
                  }}
                  onClose={() => {
                    modalContext.closeModal();
                  }}
                />
              ),
            });
          }}
        >
          <div className="flex align-ce w-100 justify-sb">
            <div className="flex align-ce w-100">
              <div className="flex align-ce">
                <CryptoContainer size={22} style={{ zIndex: 2 }}>
                  {pact.allTokens?.[selectedPool?.token0]?.icon}
                </CryptoContainer>
                <CryptoContainer size={22} style={{ marginLeft: -12, zIndex: 1 }}>
                  {pact.allTokens?.[selectedPool?.token1]?.icon}{' '}
                </CryptoContainer>
              </div>
              <Label fontSize={13}>
                {selectedPool?.token0}/{selectedPool?.token1}
              </Label>
            </div>
            <ArrowDown className="arrow-down" />
          </div>
        </CustomButton>

        <Input
          error={isNaN(fromValue.amount)}
          topLeftLabel="amount"
          topRightLabel={`balance: ${fromValue.balance ? getDecimalPlaces(fromValue.balance) : '-'}`}
          bottomLeftLabel={`balance: ${getDecimalPlaces(fromValue.balance) ?? '-'}`} //using for gameEdition
          geColor="black"
          placeholder="0.0"
          maxLength="15"
          numberOnly
          inputRightComponent={
            <InputToken
              geColor="black"
              values={fromValue}
              disabledButton={!fromValue.balance}
              onClick={() => {
                openTokenSelectorModal();
              }}
              onMaxClickButton={() => {
                setFromValue((prev) => ({
                  ...prev,
                  amount: extractDecimal(fromValue.balance),
                }));
              }}
            />
          }
          bottomContent={
            fromValue.amount && (
              <Label labelStyle={{ margin: '-10px 0px 10px 2px', opacity: 0.7 }}>
                $ {humanReadableNumber(extractDecimal(pact.tokensUsdPrice?.[fromValue.coin]) * extractDecimal(fromValue.amount))}
              </Label>
            )
          }
          value={noExponents(fromValue.amount)}
          onChange={async (e, { value }) => {
            setFromValue((prev) => ({
              ...prev,
              amount: limitDecimalPlaces(value, fromValue.precision),
            }));
          }}
        />

        <FlexContainer className="justify-sb w-100">
          <Label fontSize={13}>Pool Share</Label>
          <Label fontSize={13} labelStyle={{ textAlign: 'end' }}>
            {!pact.share(fromValue.amount) ? 0 : (pact.share(fromValue.amount / 2) * 100).toPrecision(4)} %
          </Label>
        </FlexContainer>

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
    </>
  );
};

export default SingleSidedLiquidity;
