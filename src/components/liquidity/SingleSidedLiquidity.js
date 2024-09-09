import React, { useEffect, useState } from 'react';
import { getTokenBalanceAccount } from '../../api/pact';
import { ArrowDown } from '../../assets';
import { useAccountContext, useLiquidityContext, useModalContext, usePactContext, useWalletContext } from '../../contexts';
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
import { DEFAULT_ICON_URL } from '../../constants/cryptoCurrencies';

const SingleSidedLiquidity = ({ apr, pools, pair, pairCode, onPairChange  }) => {
  
  const modalContext = useModalContext();
  const { addOneSideLiquidityWallet } = useLiquidityContext();
  const wallet = useWalletContext();
  const pact = usePactContext();
  const account = useAccountContext();
  const [fetchingPair, setFetchingPair] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);
  const [showTxModal, setShowTxModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fromValue, setFromValue] = useState({
    coin: pair?.token0 || 'KDA',
    contract: 'coin',
    account: '',
    guard: null,
    balance: '',
    amount: '',
    precision: 12,
  });
 

  const splitPoolIndex = (poolIndex) => {
    if (!poolIndex) return { token0: null, token1: null };
    const [token0, token1] = poolIndex.split(':');
    return { token0, token1 };
  };

  const getTokenIcon = (tokenCode, allTokens) => {
    if (!tokenCode || !allTokens) return DEFAULT_ICON_URL;
    const token = Object.values(allTokens).find(t => t.code === tokenCode || t.name === tokenCode);
    return token ? token.icon : DEFAULT_ICON_URL;
  };

  const { token0, token1 } = splitPoolIndex(selectedPool?.name);

  // Update the balance after a transaction send or change account
  useEffect(() => {
    if (account.fetchAccountBalance) {
      handleTokenValue(token0 || 'KDX');
    }
  }, [account.fetchAccountBalance, account.account.account, pair?.token0]);

  // Reset fetchAccountBalance change page
  useEffect(() => {
    account.setFetchAccountBalance(true);
    return () => {
      account.setFetchAccountBalance(false);
    };
  }, []);

  useEffect(() => {
    if (pair?.token0 && !selectedPool) {
      const pool = pools.find((p) => p.token0 === pair.token0 || p.token1 === pair.token0);
      setSelectedPool(pool);
      if (pool) {
        handleTokenValue(pair.token0);
      }
    } else if (!pair?.token0 && !selectedPool && pools.length > 0) {
      setSelectedPool(pools[0]);
      handleTokenValue(pools[0].token0);
    }
  }, [pair?.token0, pools, selectedPool]);

  useEffect(() => {
    const fetchReserves = async () => {
      if (selectedPool) {
        onPairChange(selectedPool?.token1, selectedPool?.token0);
        setFetchingPair(true);

        // Find the contract addresses for token0 and token1
        const token0Entry = Object.values(pact.allTokens).find(token => token.name === selectedPool?.token0);
        const token1Entry = Object.values(pact.allTokens).find(token => token.name === selectedPool?.token1);
       
        if (!token0Entry || !token1Entry) {
          console.error('Token not found in pact.allTokens:', selectedPool?.token0, selectedPool?.token1);
          setFetchingPair(false);
          return;
        }

        const token0Address = token0Entry.code;
        const token1Address = token1Entry.code;

        if (fromValue.coin === selectedPool?.token0) {
          await pact.getReserves(token0Address, token1Address);
        } else {
          await pact.getReserves(token1Address, token0Address);
        }

        setFetchingPair(false);
      }
    };

    fetchReserves();
  }, [fromValue?.coin, selectedPool]);

  const handleTokenValue = async (tokenCode) => {
    const crypto = Object.values(pact.allTokens).find(token => token.name === tokenCode || token.code === tokenCode);
    if (!crypto) {
      console.error("Token not found:", tokenCode);
      return;
    }    let balance;
    let contract = crypto?.code;
    if (crypto?.code === 'coin') {
      if (account.account) {
        balance = account.account.balance;
      }
      contract = 'coin';
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
      coin: crypto?.name || 'KDA',
      contract: contract || 'coin',
      precision: crypto?.precision,
      amount: '',
    }));
    account.setFetchAccountBalance(false);
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
          onSelectToken={async (selectedCrypto) => {
            await handleTokenValue(selectedCrypto.name);
          }}
          onClose={() => {
            modalContext.closeModal();
          }}
        />
      ),
    });
  };

  const onSelectPool = (pool) => {
    setSelectedPool(pool);
    onPairChange(pool.token0, pool.token1);
    handleTokenValue(pool.token0); // Now it updates fromValue with the first token of the new pair
  };

  const supply = async () => {
    const fromValueCode = fromValue.contract;
    const token1Code = selectedPool?.token0 === fromValue.coin ?
      pact.allTokens[token1]?.code :
      pact.allTokens[token0]?.code;

    if (!fromValueCode || !token1Code) {
      console.error("Invalid token codes:", fromValueCode, token1Code);
      return;
    }
    
    const res = await addOneSideLiquidityWallet(
      pact.allTokens[fromValueCode],
      pact.allTokens[token1Code],
      Number(fromValue?.amount).toFixed(fromValue.precision)
    );

    if (!res) {
      wallet.setIsWaitingForWalletAuth(true);
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
    if (selectedPool) {
      const defaultToken = selectedPool.token0;
      handleTokenValue(defaultToken);
    }
  }, [selectedPool]);

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
              token0Name={pairCode.token0}
              token1={selectedPool?.token0 === fromValue.coin ? selectedPool?.token1 : selectedPool?.token0}
              token1Name={pairCode.token1}
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
      onSelect={onSelectPool}
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
                  <img
                    src={getTokenIcon(token0, pact.allTokens)}
                    alt={token0}
                    style={{ width: 20, height: 20 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_ICON_URL;
                    }}
                  />
                </CryptoContainer>
                <CryptoContainer size={22} style={{ marginLeft: -12, zIndex: 1 }}>
                  <img
                    src={getTokenIcon(token1, pact.allTokens)}
                    alt={token1}
                    style={{ width: 20, height: 20 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_ICON_URL;
                    }}
                  />
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
          bottomLeftLabel={`balance: ${getDecimalPlaces(fromValue.balance) ?? '-'}`}
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
                $ {humanReadableNumber(extractDecimal(pact.tokensUsdPrice?.[fromValue.contract]) * extractDecimal(fromValue.amount))}
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
          hj
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