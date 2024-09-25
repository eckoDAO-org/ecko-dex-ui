/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useGameEditionContext, useLiquidityContext, useModalContext, usePactContext, useWalletContext } from '../../contexts';
import TxView from '../modals/TxView';
import WalletRequestView from '../modals/WalletRequestView';
import CustomButton from '../shared/CustomButton';
import FormContainer from '../shared/FormContainer';
import Input from '../shared/Input';
import Label from '../shared/Label';
import PressButtonToActionLabel from '../game-edition-v2/components/PressButtonToActionLabel';
import { InfoContainer } from '../game-edition-v2/components/PixeledInfoContainerBlue';
import { extractDecimal, getDecimalPlaces, humanReadableNumber, limitDecimalPlaces, reduceBalance } from '../../utils/reduceBalance';
import PixeledBlueContainer from '../game-edition-v2/components/PixeledInfoContainerBlue';
import LogoLoader from '../shared/Loader';
import { FadeIn } from '../shared/animations';
import { FlexContainer } from '../shared/FlexContainer';
import InputRange from '../shared/InputRange';
import { SuccessSingleSideRemoveView } from '../modals/liquidity/LiquidityTxView';
import TokenSelectorModalContent from '../modals/swap-modals/TokenSelectorModalContent';
import InputToken from '../shared/InputToken';

const Container = styled(FadeIn)`
  margin-top: 0px;

  overflow: auto;
  max-width: 550px;
  .ui.input > input {
    height: fit-content;
  }
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

const RemoveSingleSideLiquidity = ({ pair, previewObject, setPreviewAmount, previewAmount }) => {
  const pact = usePactContext();
  const wallet = useWalletContext();
  const liquidity = useLiquidityContext();
  const { tokensUsdPrice } = usePactContext();
  const modalContext = useModalContext();
  const { wantsKdxRewards } = useLiquidityContext();

  const { gameEditionView, setButtons } = useGameEditionContext();
  const [showTxModal, setShowTxModal] = useState(false);

  const [amount, setAmount] = useState(100);
  const [currentToken, setCurrentToken] = useState({ coin: pair?.token0, code: pair?.name.split(':')[0] });
  const [loading, setLoading] = useState(false);

  const [pooled, setPooled] = useState(pair?.balance);
  const [pooledToken0, setPooledToken0] = useState(reduceBalance(pair?.pooledAmount?.[0], 12));
  const [pooledToken1, setPooledToken1] = useState(reduceBalance(pair?.pooledAmount?.[1], 12));
  const [previewFees, setPreviewFees] = useState(previewObject?.['estimated-kdx-rewards']);

  useEffect(() => {
    if (!isNaN(amount) && pair) {
      setPooled((extractDecimal(pair?.balance) * amount) / 100);
      setPooledToken0(
        (extractDecimal(wantsKdxRewards && pair.isBoosted ? previewObject?.['tokenA-amount-received'] : pair?.pooledAmount[0]) * amount) / 100
      );
      setPooledToken1(
        (extractDecimal(wantsKdxRewards && pair.isBoosted ? previewObject?.['tokenB-amount-received'] : pair?.pooledAmount[1]) * amount) / 100
      );
      setPreviewFees(extractDecimal(wantsKdxRewards && pair.isBoosted && previewObject?.['estimated-kdx-rewards']));
      setPreviewAmount(amount / 100);
    }
  }, [amount, pair, wantsKdxRewards]);

  useEffect(() => {
    if (!isNaN(amount) && reduceBalance(amount) !== 0) {
      setButtons({
        A: () => {
          onRemoveSingleSideLiquidity();
        },
      });
    } else {
      setButtons({ A: null });
    }
  }, [amount, pooled, pooledToken0, pooledToken1]);

  const handleTokenValue = async (token) => {
    const crypto = pact.allTokens[token];
    setCurrentToken({ coin: crypto.name, code: crypto.code });
  };

  useEffect(() => {
    if (wallet.walletSuccess) {
      //?//
      setLoading(false);
      wallet.setWalletSuccess(false);
    }
  }, [wallet.walletSuccess]);

  const sendTransaction = () => {
    setLoading(true);
    pact.txSend();
    modalContext.closeModal();
    setLoading(false);
    setShowTxModal(false);
  };

  const onWalletRequestViewModalClose = () => {
    wallet.setIsWaitingForWalletAuth(false);
    wallet.setWalletError(null);
    setLoading(false);
  };

  const onRemoveSingleSideLiquidity = async () => {
    setLoading(true);
    const res = await liquidity.removeSingleSideLiquidityWallet(
      pact.allTokens[pair?.token0_code],
      pact.allTokens[pair?.token1_code],
      currentToken?.code,
      extractDecimal(pooled)
    );
    if (!res) {
      wallet.setIsWaitingForWalletAuth(true);
      setLoading(false);
      /* pact.setWalletError(true); */
      /* walletError(); */
    } else {
      wallet.setWalletError(null);
      setShowTxModal(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showTxModal) {
      modalContext.openModal({
        title: 'remove liquidity',
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
            loading={loading}
          >
            {/* SuccessRemoveWithBoosterView to remove liquidy with booster */}
            <SuccessSingleSideRemoveView
              token0={pair.token0}
              token0Name={pair.token0_code}
              token1={pair.token1}
              token1Name={pair.token1_code}
              loading={loading}
              onClick={sendTransaction}
              pair={pair}
              label="Remove Liquidity"
            />
          </TxView>
        ),
      });
    }
  }, [showTxModal]);

  const openTokenSelectorModal = () => {
    modalContext.openModal({
      title: 'Select',
      description: '',

      onClose: () => {
        modalContext.closeModal();
      },
      content: (
        <TokenSelectorModalContent
          token={currentToken.coin}
          tokensToKeep={[pair?.token0, pair?.token1]}
          onSelectToken={async (crypto) => await handleTokenValue(crypto.name)}
          onClose={() => {
            modalContext.closeModal();
          }}
        />
      ),
    });
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
                disabled={isNaN(amount) || reduceBalance(amount) === 0}
                onClick={async () => await onRemoveSingleSideLiquidity()}
              >
                Remove
              </CustomButton>
            )}
          </ButtonContainer>
        }
      >
        <SubContainer gameEditionView={gameEditionView}>
          <Input
            value={amount}
            error={isNaN(amount)}
            placeholder="Enter Amount"
            geColor="white"
            withBorder
            size="large"
            numberOnly
            topComponent={<Label labelStyle={{ marginBottom: 16 }}>Amount %</Label>}
            inputRightComponent={
              <InputToken
                geColor="black"
                values={currentToken}
                onClick={() => {
                  openTokenSelectorModal();
                }}
                onMaxClickButton={() => setAmount(100)}
              />
            }
            onChange={(e) => {
              if (Number(e.target.value) <= 100 && Number(e.target.value) >= 0) {
                setAmount(limitDecimalPlaces(e.target.value, 2));
              }
            }}
          />

          <InputRange value={amount} setValue={setAmount} />
        </SubContainer>

        {gameEditionView ? (
          <InfoContainer style={{ marginTop: 32 }}>
            <PixeledBlueContainer label={`${pair?.token0}/${pair?.token1}`} value={extractDecimal(pooled).toPrecision(4)} />
            <PixeledBlueContainer label={`Pooled ${pair?.token0}`} value={extractDecimal(pooledToken0).toPrecision(4)} />
            <PixeledBlueContainer label={`Pooled ${pair?.token1}`} value={extractDecimal(pooledToken1).toPrecision(4)} />
          </InfoContainer>
        ) : (
          <FlexContainer className="column" gap={12} style={{ margin: '16px 0' }}>
            <div>
              <FlexContainer className="justify-sb w-100">
                <Label fontSize={13}>Pooled {pair?.token0}</Label>
                <Label fontSize={13}>{getDecimalPlaces(extractDecimal(pooledToken0))}</Label>
              </FlexContainer>
              {tokensUsdPrice ? (
                <Label fontSize={11} labelStyle={{ marginTop: 4, opacity: 0.7, justifyContent: 'flex-end' }}>
                  $ {humanReadableNumber(tokensUsdPrice?.[pair?.token0_code] * extractDecimal(pooledToken0))}
                </Label>
              ) : (
                ''
              )}
            </div>

            <div>
              <FlexContainer className="justify-sb w-100">
                <Label fontSize={13}>Pooled {pair?.token1}</Label>
                <Label fontSize={13}>{getDecimalPlaces(extractDecimal(pooledToken1))}</Label>
              </FlexContainer>
              {tokensUsdPrice ? (
                <Label fontSize={11} labelStyle={{ marginTop: 4, opacity: 0.7, justifyContent: 'flex-end' }}>
                  $ {humanReadableNumber(tokensUsdPrice?.[pair?.token1_code] * extractDecimal(pooledToken1))}
                </Label>
              ) : (
                ''
              )}
            </div>

            {wantsKdxRewards && pair.isBoosted && (
              <div>
                <FlexContainer className="justify-sb w-100">
                  <Label fontSize={13}>Fees Collected KDX</Label>
                  <Label fontSize={13}>~ {getDecimalPlaces(extractDecimal(previewFees))}</Label>
                </FlexContainer>
                {tokensUsdPrice ? (
                  <Label fontSize={11} labelStyle={{ marginTop: 4, opacity: 0.7, justifyContent: 'flex-end' }}>
                    $ {humanReadableNumber(tokensUsdPrice?.KDX * extractDecimal(previewFees))}
                  </Label>
                ) : (
                  ''
                )}
              </div>
            )}
            <FlexContainer className="justify-sb w-100">
              <Label fontSize={13}>
                {pair?.token0}/{pair?.token1} Rate
              </Label>
              <Label fontSize={13}>
                {getDecimalPlaces(extractDecimal(pair.reserves[0]) / extractDecimal(pair.reserves[1])) < 0.000001
                  ? '< 0.000001'
                  : getDecimalPlaces(extractDecimal(pair.reserves[0]) / extractDecimal(pair.reserves[1]))}
              </Label>
            </FlexContainer>
          </FlexContainer>
        )}
      </FormContainer>
    </Container>
  );
};

export default RemoveSingleSideLiquidity;
