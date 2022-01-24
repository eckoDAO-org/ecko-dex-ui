import React, { useContext } from 'react';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components/macro';
import pwError from '../alerts/pwError';
import CustomButton from '../../components/shared/CustomButton';
import { AccountContext } from '../../contexts/AccountContext';
import reduceToken from '../../utils/reduceToken';
import ConnectWalletModal from '../modals/kdaModals/ConnectWalletModal';
import { ModalContext } from '../../contexts/ModalContext';
import { WalletContext } from '../../contexts/WalletContext';
import { SwapContext } from '../../contexts/SwapContext';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import PressButtonToActionLabel from '../game-edition-v2/components/PressButtonToActionLabel';

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

const Label = styled.span`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) => (gameEditionView ? fontFamily.pixeboy : fontFamily.regular)};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '20px' : '13px')};
  color: ${({ theme: { colors }, gameEditionView }) => colors.yellow};
  text-transform: capitalize;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    text-align: left;
  }
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
}) => {
  const modalContext = useContext(ModalContext);
  const { account } = useContext(AccountContext);
  const wallet = useContext(WalletContext);
  const swap = useContext(SwapContext);
  const { gameEditionView, openModal } = useContext(GameEditionContext);

  const getButtonLabel = () => {
    if (!account.account) return 'Connect wallet';
    //if (!pact.hasWallet()) return "Set signing method in wallet";
    if (!fromValues.coin || !toValues.coin) return 'Select tokens';
    if (fetchingPair) return 'Fetching Pair...';
    if (isNaN(ratio)) return 'Pair does not exist!';
    if (noLiquidity) return 'not enough liquidity';
    if (!fromValues.amount || !toValues.amount) return 'Enter an amount';
    if (fromValues.amount > fromValues.balance) return `Insufficient ${fromValues.coin} balance`;
    return 'SWAP';
  };
  return (
    <ButtonContainer gameEditionView={gameEditionView}>
      {gameEditionView ? (
        <LabelContainer>
          {getButtonLabel() === 'SWAP' ? (
            <PressButtonToActionLabel button="B" actionLabel="swap" />
          ) : (
            <Label gameEditionView={gameEditionView}>{getButtonLabel()}</Label>
          )}
        </LabelContainer>
      ) : (
        <CustomButton
          fluid
          disabled={account.account && (getButtonLabel() !== 'SWAP' || isNaN(fromValues.amount) || isNaN(toValues.amount))}
          loading={loading}
          onClick={async () => {
            if (!account.account) {
              if (gameEditionView) {
                return openModal({
                  isVisible: true,
                  title: account?.account ? 'wallet connected' : 'connect wallet',
                  description: account?.account ? `Account ID: ${reduceToken(account.account)}` : 'Connect a wallet using one of the methods below',
                  content: <ConnectWalletModal />,
                });
              } else {
                return modalContext.openModal({
                  title: account?.account ? 'wallet connected' : 'connect wallet',
                  description: account?.account ? `Account ID: ${reduceToken(account.account)}` : 'Connect a wallet using one of the methods below',
                  content: <ConnectWalletModal />,
                });
              }
            }
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
                if (swap.localRes) pwError();
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
          }}
        >
          {getButtonLabel()}
        </CustomButton>
      )}
    </ButtonContainer>
  );
};

export default SwapButtonsForm;
