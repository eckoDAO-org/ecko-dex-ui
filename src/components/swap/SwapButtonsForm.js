import React, { useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
import CustomButton from '../../components/shared/CustomButton';
import { AccountContext } from '../../contexts/AccountContext';
import reduceToken from '../../utils/reduceToken';
import ConnectWalletModal from '../modals/kdaModals/ConnectWalletModal';
import { ModalContext } from '../../contexts/ModalContext';
import { WalletContext } from '../../contexts/WalletContext';
import { SwapContext } from '../../contexts/SwapContext';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import PressButtonToActionLabel from '../game-edition-v2/components/PressButtonToActionLabel';
import Label from '../shared/Label';
import {
  SWAP_BUTTON_CONNECT_WALLET,
  SWAP_BUTTON_ENTER_AMOUNT,
  SWAP_BUTTON_FETCHING_PAIR,
  SWAP_BUTTON_NOT_LIQUIDITY,
  SWAP_BUTTON_PAIR_NOT_ESIST,
  SWAP_BUTTON_SELECT_TOKENS,
  SWAP_BUTTON_SWAP,
} from '../../constants/swap';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: ${({ gameEditionView }) => (gameEditionView ? '0' : '1')};
`;

const LabelContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: ${({ gameEditionView }) => !gameEditionView && '1'};
`;

const SwapButtonsForm = ({
  loading,
  fetchingPair,
  setLoading,
  fromValues,
  setFromValues,
  toValues,
  setToValues,
  fromNote,
  noLiquidity,
  ratio,
  setShowTxModal,
  showTxModal,
  onSelectToken,
}) => {
  const modalContext = useContext(ModalContext);
  const { account } = useContext(AccountContext);
  const wallet = useContext(WalletContext);
  const swap = useContext(SwapContext);
  const { gameEditionView, openModal, setButtons, closeModal } = useContext(GameEditionContext);

  const getButtonLabel = () => {
    if (!account.account) return SWAP_BUTTON_CONNECT_WALLET.label;
    //if (!pact.hasWallet()) return "Set signing method in wallet";
    if (!fromValues.coin || !toValues.coin) return SWAP_BUTTON_SELECT_TOKENS.label;
    if (fetchingPair) return SWAP_BUTTON_FETCHING_PAIR.label;
    if (isNaN(ratio)) return SWAP_BUTTON_PAIR_NOT_ESIST.label;
    if (noLiquidity) return SWAP_BUTTON_NOT_LIQUIDITY.label;
    if (!fromValues.amount || !toValues.amount) return SWAP_BUTTON_ENTER_AMOUNT.label;
    if (fromValues.amount > fromValues.balance) return `Insufficient ${fromValues.coin} balance`;
    return SWAP_BUTTON_SWAP.label;
  };

  useEffect(() => {
    if (gameEditionView && !loading && account?.account) {
      setButtons({
        A: () => {
          if (showTxModal) {
            setLoading(true);
            swap.swapSend();
            setShowTxModal(false);
            closeModal();
            setLoading(false);
          } else {
            handleClick();
          }
        },
      });
    } else {
      setButtons({ A: null });
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTxModal, account.account, gameEditionView, fromValues, toValues, loading]);

  const handleClick = async () => {
    setLoading(true);
    if (wallet.signing.method !== 'sign' && wallet.signing.method !== 'none') {
      const res = await swap.swapLocal(
        {
          amount: fromValues.amount,
          address: fromValues.address,
          coin: fromValues.coin,
        },
        {
          amount: toValues.amount,
          address: toValues.address,
          coin: toValues.coin,
        },
        fromNote === '(estimated)' ? false : true
      );

      if (res === -1) {
        setLoading(false);
        //error alert
        if (swap.localRes) {
          openModal({
            title: 'Error',
            content: (
              <Label geColor="yellow" geCenter>
                Transaction Error! please try again.
              </Label>
            ),
          });
        }
        return;
      } else {
        setShowTxModal(true);
        if (res?.result?.status === 'success') {
          setFromValues((prev) => ({
            ...prev,
            amount: '',
          }));
          setToValues((prev) => ({
            ...prev,
            amount: '',
          }));
        }
        setLoading(false);
      }
    } else {
      const res = await swap.swapWallet(
        {
          amount: fromValues.amount,
          address: fromValues.address,
          coin: fromValues.coin,
        },
        {
          amount: toValues.amount,
          address: toValues.address,
          coin: toValues.coin,
        },
        fromNote === '(estimated)' ? false : true
      );

      if (!res) {
        wallet.setIsWaitingForWalletAuth(true);
      } else {
        wallet.setWalletError(null);
        setShowTxModal(true);
      }
      if (res?.result?.status === 'success') {
        setFromValues((prev) => ({
          ...prev,
          amount: '',
        }));
        setToValues((prev) => ({
          ...prev,
          amount: '',
        }));
      }
      setLoading(false);
    }
  };

  return (
    <ButtonContainer gameEditionView={gameEditionView}>
      {gameEditionView ? (
        <LabelContainer>
          {getButtonLabel() === SWAP_BUTTON_SWAP.label ? (
            <PressButtonToActionLabel actionLabel="swap" />
          ) : (
            <Label geColor="yellow">{getButtonLabel()}</Label>
          )}
        </LabelContainer>
      ) : (
        <CustomButton
          fluid
          type="gradient"
          disabled={
            account.account &&
            ((getButtonLabel() !== SWAP_BUTTON_SWAP.label && getButtonLabel() !== SWAP_BUTTON_SELECT_TOKENS.label) ||
              isNaN(fromValues.amount) ||
              isNaN(toValues.amount))
          }
          loading={loading}
          onClick={async () => {
            console.log('asd');
            if (!account.account) {
              return modalContext.openModal({
                title: account?.account ? 'wallet connected' : SWAP_BUTTON_CONNECT_WALLET.label,
                description: account?.account ? `Account ID: ${reduceToken(account.account)}` : 'Connect a wallet using one of the methods below',
                content: <ConnectWalletModal />,
              });
            }
            if (!fromValues.coin || !toValues.coin) {
              onSelectToken();
            } else {
              await handleClick();
            }
          }}
        >
          {getButtonLabel()}
        </CustomButton>
      )}
    </ButtonContainer>
  );
};

export default SwapButtonsForm;
