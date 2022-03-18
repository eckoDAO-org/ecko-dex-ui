/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useAccountContext, useGameEditionContext, usePactContext, useSwapContext } from '../../../contexts';
import { chainId, ENABLE_GAS_STATION, GAS_PRICE } from '../../../constants/contextConstants';
import { extractDecimal, reduceBalance } from '../../../utils/reduceBalance';
import { getTokenIcon, showTicker } from '../../../utils/token-utils';
import GameEditionLabel from '../../game-edition-v2/components/GameEditionLabel';
import Label from '../../shared/Label';
import { SuccessViewContainerGE, SuccesViewContainer } from '../common-result-components';
import { CryptoContainer, FlexContainer } from '../../shared/FlexContainer';
import reduceToken from '../../../utils/reduceToken';
import CopyPopup from '../../shared/CopyPopup';
import CustomDivider from '../../shared/CustomDivider';

export const SuccessAddRemoveViewGE = ({ token0, token1, swap, label, onBPress }) => {
  const { setButtons } = useGameEditionContext();
  useEffect(() => {
    setButtons({ A: onBPress });
  }, []);

  return (
    <SuccessViewContainerGE
      hideIcon
      title={label}
      leftItem={
        <>
          <GameEditionLabel fontSize={32} color="blue">
            {showTicker(token0)}
          </GameEditionLabel>
          <div className="flex justify-fs">
            {getTokenIcon(token0)}
            <GameEditionLabel fontSize={22} color="blue-grey">
              {extractDecimal(swap?.localRes?.result?.data?.amount0)}
            </GameEditionLabel>
          </div>
        </>
      }
      rightItem={
        <>
          <GameEditionLabel fontSize={32} color="blue">
            {showTicker(token1)}
          </GameEditionLabel>

          <div className="flex justify-fs">
            {getTokenIcon(token1)}
            <GameEditionLabel fontSize={22} color="blue-grey">
              {extractDecimal(swap?.localRes?.result?.data?.amount1)}
            </GameEditionLabel>
          </div>
        </>
      }
      infoItems={[
        {
          label: 'gas cost KDA',
          value: ENABLE_GAS_STATION ? (
            <>
              <GameEditionLabel geColor="white">{(GAS_PRICE * swap?.localRes?.gas).toPrecision(4)} KDA</GameEditionLabel>
              <GameEditionLabel geColor="white" labelStyle={{ marginLeft: 5 }}>
                FREE!
              </GameEditionLabel>
            </>
          ) : (
            <GameEditionLabel geColor="white">{(GAS_PRICE * swap?.localRes?.gas).toPrecision(4)} KDA</GameEditionLabel>
          ),
        },
      ]}
    />
  );
};

export const SuccessAddView = ({ token0, token1, loading, onClick }) => {
  const { account } = useAccountContext();
  const pact = usePactContext();
  const swap = useSwapContext();

  return (
    <SuccesViewContainer swap={swap} loading={loading} onClick={onClick}>
      <FlexContainer className="w-100 column" gap={12}>
        <Label>From</Label>

        {/* ACCOUNT */}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Account</Label>
          <Label fontSize={13}>
            {reduceToken(account.account)}
            <CopyPopup textToCopy={account.account} />
          </Label>
        </FlexContainer>
        {/* CHAIN */}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Chain Id</Label>
          <Label fontSize={13}>{chainId}</Label>
        </FlexContainer>
        {/* POOL */}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Pool</Label>
          <FlexContainer>
            <CryptoContainer size={24} style={{ zIndex: 2 }}>
              {getTokenIcon(token0)}
            </CryptoContainer>
            <CryptoContainer size={24} style={{ marginLeft: -12, zIndex: 1 }}>
              {getTokenIcon(token1)}
            </CryptoContainer>

            <Label fontSize={13}>
              {token0}/{token1}
            </Label>
          </FlexContainer>
        </FlexContainer>
        {/* POOL SHARE*/}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Pool Share</Label>
          <Label fontSize={13}>{(pact.share(swap?.localRes?.result?.data?.amount0) * 100).toPrecision(4)} %</Label>
        </FlexContainer>

        <CustomDivider style={{ margin: '16px 0' }} />

        <Label>Amount</Label>

        {/* FROM VALUES */}
        <FlexContainer className="align-ce justify-sb">
          <FlexContainer>
            <CryptoContainer size={30}>{getTokenIcon(token0)}</CryptoContainer>
            <Label>{swap?.localRes?.result?.data?.amount0}</Label>
          </FlexContainer>
          <Label>{token0}</Label>
        </FlexContainer>
        <Label fontSize={13}>{`1 ${token0} =  ${reduceBalance(1 / pact.ratio)} ${token1}`}</Label>

        {/* TO VALUES */}
        <FlexContainer className="align-ce justify-sb">
          <FlexContainer>
            <CryptoContainer size={30}>{getTokenIcon(token1)}</CryptoContainer>
            <Label>{swap?.localRes?.result?.data?.amount1}</Label>
          </FlexContainer>
          <Label>{token1}</Label>
        </FlexContainer>
        <Label fontSize={13}>{`1 ${token1} =  ${reduceBalance(pact.ratio)} ${token0}`}</Label>
      </FlexContainer>
    </SuccesViewContainer>
  );
};

export const SuccessRemoveView = ({ token0, token1, loading, onClick }) => {
  const swap = useSwapContext();
  return (
    <SuccesViewContainer swap={swap} loading={loading} onClick={onClick} hideSubtitle>
      <FlexContainer className="w-100 column" gap={12}>
        <Label>Are you sure you want to remove your liquidity?</Label>

        <CustomDivider style={{ margin: '16px 0' }} />

        <div className="flex align-ce justify-sb">
          <Label fontSize={16}>Amount</Label>
          <Label fontSize={16}>Rewards</Label>
        </div>

        <div className="flex align-ce justify-sb">
          <div className="flex align-ce">
            <CryptoContainer size={24}>{getTokenIcon(token0)}</CryptoContainer>
            <Label>{swap?.localRes?.result?.data?.amount0}</Label>
          </div>
          <Label>{token0}</Label>
        </div>
        <div className="flex align-ce justify-sb">
          <div className="flex align-ce">
            <CryptoContainer size={24}>{getTokenIcon(token1)}</CryptoContainer>
            <Label>{swap?.localRes?.result?.data?.amount1}</Label>
          </div>

          <Label>{token1}</Label>
        </div>
      </FlexContainer>
    </SuccesViewContainer>
  );
};
