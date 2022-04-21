/* eslint-disable react-hooks/exhaustive-deps */
import Pact from 'pact-lang-api';
import React, { useEffect, useState } from 'react';
import { ArrowDown } from '../../assets';
import { CHAIN_ID, creationTime, NETWORK } from '../../constants/contextConstants';
import tokenData from '../../constants/cryptoCurrencies';
import { useAccountContext, useLiquidityContext, useModalContext, usePactContext, useSwapContext, useWalletContext } from '../../contexts';
import noExponents from '../../utils/noExponents';
import { getCorrectBalance, limitDecimalPlaces, reduceBalance } from '../../utils/reduceBalance';
import { SuccessAddView } from '../modals/liquidity/LiquidityTxView';
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
  const swap = useSwapContext();
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

  // useEffect(() => {
  //   onPairChange(fromValue.coin);
  //   handleTokenValue(pair?.token0 || 'KDA');
  // }, [pair.coin]);

  useEffect(() => {
    setSelectedPool(pools[0]);
    handleTokenValue(pair?.token0 || 'KDX');
  }, []);

  useEffect(async () => {
    onPairChange(fromValue?.coin);
    if (selectedPool) {
      setFetchingPair(true);
      await pact.getPair(tokenData?.[selectedPool?.token0]?.code, tokenData?.[selectedPool?.token1]?.code);

      if (selectedPool?.token0 === fromValue.coin) {
        await pact.getReserves(tokenData?.[selectedPool?.token0]?.code, tokenData?.[selectedPool?.token1]?.code);
      } else {
        await pact.getReserves(tokenData?.[selectedPool?.token1]?.code, tokenData?.[selectedPool?.token0]?.code);
      }
      setFetchingPair(false);
    }
  }, [fromValue?.coin, selectedPool]);

  const handleTokenValue = async (token) => {
    const crypto = tokenData[token];

    let balance;
    if (crypto?.code === 'coin') {
      if (account.account) {
        balance = account.account.balance;
      }
    } else {
      try {
        let data = await Pact.fetch.local(
          {
            pactCode: `(${crypto.code}.details ${JSON.stringify(account.account.account)})`,
            keyPairs: Pact.crypto.genKeyPair(),
            meta: Pact.lang.mkMeta('', CHAIN_ID, 0.01, 100000000, 28800, creationTime()),
          },
          NETWORK
        );
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
    const res = await addOneSideLiquidityWallet(tokenData[fromValue.coin], tokenData[token1], fromValue.amount.toFixed(fromValue.precision));
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
      0: { msg: 'Connect your KDA wallet', status: false },
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
    if (!account.account) return status[0];
    if (fetchingPair) {
      return status[7];
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
    swap.swapSend();

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
            <SuccessAddView
              isSingleSideLiquidity
              apr={apr}
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
          type="primary"
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
                  {tokenData?.[selectedPool?.token0]?.icon}
                </CryptoContainer>
                <CryptoContainer size={22} style={{ marginLeft: -12, zIndex: 1 }}>
                  {tokenData?.[selectedPool?.token1]?.icon}{' '}
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
          topRightLabel={`balance: ${reduceBalance(fromValue.balance) ?? '-'}`}
          bottomLeftLabel={`balance: ${reduceBalance(fromValue.balance) ?? '-'}`} //using for gameEdition
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
                  amount: reduceBalance(fromValue.balance),
                }));
              }}
            />
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
            {!pact.share(fromValue.amount) ? 0 : (pact.share(fromValue.amount) * 100).toPrecision(4)} %
          </Label>
        </FlexContainer>

        <CustomButton fluid type="gradient" disabled={!buttonStatus().status} onClick={() => supply()}>
          {buttonStatus().msg}
        </CustomButton>
      </FlexContainer>
    </>
  );
};

export default SingleSidedLiquidity;
