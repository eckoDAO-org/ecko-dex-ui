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
import { SuccessDoubleSideRemoveView } from '../modals/liquidity/LiquidityTxView';
import BigNumber from 'bignumber.js';

const Container = styled(FadeIn)`
  margin-top: 0px;

  overflow: auto;
  max-width: 550px;
  .ui.input > input {
    padding: 0px;
    padding-bottom: 16px;
    font-size: 13px;
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

const RemoveDoubleSideLiquidity = ({ pair, previewObject, setPreviewAmount, previewAmount }) => {
  const pact = usePactContext();
  const wallet = useWalletContext();
  const liquidity = useLiquidityContext();
  const { tokensUsdPrice } = usePactContext();
  const modalContext = useModalContext();
  const { wantsKdxRewards } = useLiquidityContext();

  const { gameEditionView, setButtons } = useGameEditionContext();
  const [showTxModal, setShowTxModal] = useState(false);

  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);

  const [pooled, setPooled] = useState(pair?.balance);
  const [pooledToken0, setPooledToken0] = useState(reduceBalance(pair?.pooledAmount?.[0], 12));

  const [pooledToken1, setPooledToken1] = useState(reduceBalance(pair?.pooledAmount?.[1], 12));
  const [previewFees, setPreviewFees] = useState(previewObject?.['estimated-kdx-rewards']);

  useEffect(() => {
    if (!isNaN(amount) && pair) {
      const bigNumPairBalance = new BigNumber(extractDecimal(pair?.balance));
      const bigNumPairBalanceMultiplied = bigNumPairBalance.times(amount);

      const calculatedPooled = bigNumPairBalanceMultiplied.dividedBy(100);
      setPooled(extractDecimal(calculatedPooled));

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
          onRemoveLiquidity();
        },
      });
    } else {
      setButtons({ A: null });
    }
  }, [amount, pooled, pooledToken0, pooledToken1]);

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

  const onRemoveLiquidity = async () => {
    setLoading(true);
    const res = await liquidity.removeDoubleSideLiquidityWallet(
      pact.allTokens[pair?.token0_code],
      pact.allTokens[pair?.token1_code],
      extractDecimal(pooled),
      previewAmount
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
            <SuccessDoubleSideRemoveView
              token0={pair.token0}
              token0Name={pair.token0_code}
              token1={pair.token1}
              token1Name={pair.token1_code}
              label="Remove Liquidity"
              loading={loading}
              onClick={sendTransaction}
              pair={pair}
            />
          </TxView>
        ),
      });
    }
  }, [showTxModal]);
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
                onClick={async () => await onRemoveLiquidity()}
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
            numberOnly
            fontSize={13}
            inputStyle={{ padding: 0 }}
            topComponent={<Label labelStyle={{ marginBottom: 16 }}>Amount</Label>}
            inputRightComponent={
              <FlexContainer className="align-ce h-fit-content">
                <Label labelStyle={{ marginRight: 4 }}>%</Label>
                <CustomButton
                  buttonStyle={{
                    padding: 0,
                    height: 'fit-content',
                  }}
                  fontFamily="basier"
                  labelStyle={{ textTransform: 'uppercase' }}
                  type="basic"
                  fontSize={13}
                  onClick={() => setAmount(100)}
                >
                  Max
                </CustomButton>
              </FlexContainer>
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
                    $ {humanReadableNumber(tokensUsdPrice?.["kaddex.kdx"] * extractDecimal(previewFees))}
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

export default RemoveDoubleSideLiquidity;
