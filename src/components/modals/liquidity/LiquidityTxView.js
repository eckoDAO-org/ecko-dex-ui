/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import styled from 'styled-components/macro';
import { useAccountContext, useGameEditionContext, usePactContext, useSwapContext } from '../../../contexts';
import { CHAIN_ID, ENABLE_GAS_STATION, GAS_PRICE } from '../../../constants/contextConstants';
import { extractDecimal, reduceBalance } from '../../../utils/reduceBalance';
import { getTokenIconById, getTokenName } from '../../../utils/token-utils';
import GameEditionLabel from '../../game-edition-v2/components/GameEditionLabel';
import Label from '../../shared/Label';
import { CryptoContainer, FlexContainer } from '../../shared/FlexContainer';
import reduceToken from '../../../utils/reduceToken';
import CopyPopup from '../../shared/CopyPopup';
import CustomDivider from '../../shared/CustomDivider';
import { KaddexOutlineIcon } from '../../../assets';
import { Checkbox } from 'semantic-ui-react';
import { SuccessViewContainerGE, SuccesViewContainer } from '../TxView';
import { isNumber } from 'lodash';
import { getPairByTokensName } from '../../../constants/cryptoCurrencies';

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
            {getTokenName(token0)}
          </GameEditionLabel>
          <div className="flex justify-fs">
            {getTokenIconById(token0)}
            <GameEditionLabel fontSize={22} color="blue-grey">
              {extractDecimal(swap?.localRes?.result?.data?.amount0)}
            </GameEditionLabel>
          </div>
        </>
      }
      rightItem={
        <>
          <GameEditionLabel fontSize={32} color="blue">
            {getTokenName(token1)}
          </GameEditionLabel>

          <div className="flex justify-fs">
            {getTokenIconById(token1)}
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

export const SuccessAddView = ({ token0, token1, loading, onClick, isSingleSideLiquidity, apr }) => {
  const { account } = useAccountContext();
  const pact = usePactContext();
  const swap = useSwapContext();
  const pair = getPairByTokensName(token0, token1);

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
          <Label fontSize={13}>{CHAIN_ID}</Label>
        </FlexContainer>
        {/* POOL */}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Pool</Label>
          <FlexContainer>
            <CryptoContainer size={24} style={{ zIndex: 2 }}>
              {getTokenIconById(token0)}
            </CryptoContainer>
            <CryptoContainer size={24} style={{ marginLeft: -12, zIndex: 1 }}>
              {getTokenIconById(token1)}
            </CryptoContainer>

            <Label fontSize={13}>
              {token0}/{token1}
            </Label>
          </FlexContainer>
        </FlexContainer>
        {/* APR*/}
        {isNumber(apr) && (
          <FlexContainer className="align-ce justify-sb">
            <Label fontSize={13}>APR</Label>
            <Label fontSize={13}>{`${apr} %`}</Label>
          </FlexContainer>
        )}
        {/* POOL SHARE*/}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Pool Share</Label>
          <Label fontSize={13}>
            {(pact.share(swap?.localRes?.result?.data?.[token0 === pair.token0 ? 'amount0' : 'amount1']) * 100).toPrecision(4)} %
          </Label>
        </FlexContainer>

        <CustomDivider style={{ margin: '16px 0' }} />

        <Label>Amount</Label>
        {/* FROM VALUES */}
        <FlexContainer className="align-ce justify-sb">
          <FlexContainer>
            <CryptoContainer size={30}>{getTokenIconById(token0)}</CryptoContainer>

            <Label>{swap?.localRes?.result?.data?.[token0 === pair.token0 ? 'amount0' : 'amount1']}</Label>
          </FlexContainer>
          <Label>{token0}</Label>
        </FlexContainer>
        <Label fontSize={13}>{`1 ${token0} = ${reduceBalance(1 / pact.ratio)} ${token1}`}</Label>

        {/* TO VALUES */}
        {!isSingleSideLiquidity && (
          <>
            <FlexContainer className="align-ce justify-sb">
              <FlexContainer>
                <CryptoContainer size={30}>{getTokenIconById(token1)}</CryptoContainer>
                <Label>{swap?.localRes?.result?.data?.[token1 === pair.token1 ? 'amount1' : 'amount0']}</Label>
              </FlexContainer>
              <Label>{token1}</Label>
            </FlexContainer>
            <Label fontSize={13}>{`1 ${token1} =  ${reduceBalance(pact.ratio)} ${token0}`}</Label>
          </>
        )}
      </FlexContainer>
    </SuccesViewContainer>
  );
};

export const SuccessRemoveView = ({ token0, token1, loading, onClick }) => {
  const swap = useSwapContext();
  return (
    <SuccesViewContainer swap={swap} loading={loading} onClick={onClick} hideSubtitle icon={<KaddexOutlineIcon />}>
      <FlexContainer className="w-100 column" gap={12}>
        <Label>Are you sure you want to remove your liquidity?</Label>

        <CustomDivider style={{ margin: '16px 0' }} />

        <div className="flex align-ce justify-sb">
          <Label fontSize={16}>Amount</Label>
          <Label fontSize={16}>Rewards</Label>
        </div>

        <div className="flex align-ce justify-sb">
          <div className="flex align-ce">
            <CryptoContainer size={24}>{getTokenIconById(token0)}</CryptoContainer>
            <Label>
              {swap?.localRes?.result?.data?.amount0} {token0}
            </Label>
          </div>
          <Label>{token0}</Label>
        </div>
        <div className="flex align-ce justify-sb">
          <div className="flex align-ce">
            <CryptoContainer size={24}>{getTokenIconById(token1)}</CryptoContainer>
            <Label>
              {swap?.localRes?.result?.data?.amount1} {token1}
            </Label>
          </div>

          <Label>{token1}</Label>
        </div>
      </FlexContainer>
    </SuccesViewContainer>
  );
};
export const SuccessRemoveWithBoosterView = ({ token0, token1, loading, onClick }) => {
  const swap = useSwapContext();
  const [checked, setChecked] = useState(false);
  return (
    <SuccesViewContainer
      swap={swap}
      loading={loading}
      onClick={onClick}
      hideSubtitle
      icon={<KaddexOutlineIcon />}
      footer={
        <CheckboxContainer checked={checked}>
          <Label fontFamily="syncopate" fontSize={16}>
            stake my rewards
          </Label>
          <Checkbox checked={checked} onChange={() => setChecked((prev) => !prev)} />
        </CheckboxContainer>
      }
    >
      <FlexContainer className="w-100 column" gap={12}>
        <Label labelStyle={{ lineHeight: '19px' }}>Booster rewards will unlock in 72 hours from the moment the user removes liquidity.</Label>

        <div className="flex align-ce justify-sb">
          <Label>Rewards Booster Unlock Date</Label>
          <Label>{moment().add(72, 'hours').format('DD/MM/YYYY HH:mm')}</Label>
        </div>

        <CustomDivider style={{ margin: '16px 0' }} />

        <Label fontSize={16}>Amount</Label>

        <div className="flex align-ce justify-sb">
          <div className="flex align-ce">
            <CryptoContainer size={24}>{getTokenIconById(token0)}</CryptoContainer>
            <Label>
              {swap?.localRes?.result?.data?.amount0} {token0}
            </Label>
          </div>
          <Label>{token0}</Label>
        </div>
        <div className="flex align-ce justify-sb">
          <div className="flex align-ce">
            <CryptoContainer size={24}>{getTokenIconById(token1)}</CryptoContainer>
            <Label>
              {swap?.localRes?.result?.data?.amount1} {token1}
            </Label>
          </div>

          <Label>{token1}</Label>
        </div>

        <Label fontSize={16}>Rewards</Label>

        <div className="flex align-ce justify-sb">
          <div className="flex align-ce">
            insert-token-logo-rewards
            {/* <CryptoContainer size={24}>{getTokenIconById(token0)}</CryptoContainer> */}
            <Label>insert-amount-rewards</Label>
          </div>
          <Label>insert-token-name-rewards</Label>
        </div>
      </FlexContainer>
    </SuccesViewContainer>
  );
};

const CheckboxContainer = styled.div`
  border-radius: 10px;
  margin-top: 24px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: ${({ theme: { colors } }) => `1px solid ${colors.white}`};
  background-color: ${({ theme: { colors }, checked }) => (checked ? colors.white : 'transparent')};

  span {
    color: ${({ theme: { colors }, checked }) => (checked ? colors.primary : colors.white)};
  }
`;
