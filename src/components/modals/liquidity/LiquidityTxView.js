/* eslint-disable react-hooks/exhaustive-deps */
import { isNumber } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Checkbox } from 'semantic-ui-react';
import styled from 'styled-components/macro';
import { ArrowIcon, EckoOutlineIcon } from '../../../assets';
import { CHAIN_ID } from '../../../constants/contextConstants';
import { useAccountContext, useGameEditionContext, useLiquidityContext, usePactContext, useSwapContext } from '../../../contexts';
import { extractDecimal, getDecimalPlaces, reduceBalance } from '../../../utils/reduceBalance';
import reduceToken from '../../../utils/reduceToken';
import { getPairByTokensName, getTokenIconByCode, getTokenIconById, getTokenName } from '../../../utils/token-utils';
import GameEditionLabel from '../../game-edition-v2/components/GameEditionLabel';
import CopyPopup from '../../shared/CopyPopup';
import CustomDivider from '../../shared/CustomDivider';
import DisclaimerUnverifiedTokens from '../../shared/DisclaimerUnverifiedTokens';
import { CryptoContainer, FlexContainer } from '../../shared/FlexContainer';
import Label from '../../shared/Label';
import RowTokenInfoPrice from '../../shared/RowTokenInfoPrice';
import { SuccessViewContainerGE, SuccesViewContainer } from '../TxView';
import {DEFAULT_ICON_URL} from '../../../constants/cryptoCurrencies';

export const SuccessAddRemoveViewGE = ({ token0, token1, swap, label, onBPress }) => {
  const { setButtons } = useGameEditionContext();
  const pact = usePactContext();
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
            {getTokenName(token0, pact.allTokens)}
          </GameEditionLabel>
          <div className="flex justify-fs">
            {getTokenIconById(token0, pact.allTokens)}
            <GameEditionLabel fontSize={22} color="blue-grey">
              {extractDecimal(swap?.localRes?.result?.data?.amount0)}
            </GameEditionLabel>
          </div>
        </>
      }
      rightItem={
        <>
          <GameEditionLabel fontSize={32} color="blue">
            {getTokenName(token1, pact.allTokens)}
          </GameEditionLabel>

          <div className="flex justify-fs">
            {getTokenIconById(token1, pact.allTokens)}
            <GameEditionLabel fontSize={22} color="blue-grey">
              {extractDecimal(swap?.localRes?.result?.data?.amount1)}
            </GameEditionLabel>
          </div>
        </>
      }
      infoItems={[
        {
          label: 'gas cost KDA',
          value: pact.enableGasStation ? (
            <>
              <GameEditionLabel geColor="white">{(pact.gasConfiguration.gasPrice * swap?.localRes?.gas).toPrecision(4)} KDA</GameEditionLabel>
              <GameEditionLabel geColor="white" labelStyle={{ marginLeft: 5 }}>
                FREE
              </GameEditionLabel>
            </>
          ) : (
            <GameEditionLabel geColor="white">{(pact.gasConfiguration.gasPrice * swap?.localRes?.gas).toPrecision(4)} KDA</GameEditionLabel>
          ),
        },
      ]}
    />
  );
};

export const SuccessAddView = ({ token0, token1, token0Name, token1Name, loading, onClick, apr }) => {
  const { account } = useAccountContext();
  const pact = usePactContext();
  const swap = useSwapContext();
  const pair = getPairByTokensName(token0, token1, pact.allPairs);

  const fromValues = extractDecimal(swap?.localRes?.result?.data?.[token0 === pair.token0 ? 'amount0' : 'amount1']);

  return (
    <SuccesViewContainer swap={swap} loading={loading} onClick={onClick} hideSubtitle>
      <FlexContainer className="w-100 column" gap={12}>
        {/* DISCLAIMER */}
         <DisclaimerUnverifiedTokens />
        {/* ACCOUNT */}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Account</Label>
          <Label fontSize={13}>
            <CopyPopup textToCopy={account.account} />
            {reduceToken(account.account)}
          </Label>
        </FlexContainer>
        {/* CHAIN */}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Chain ID</Label>
          <Label fontSize={13}>{CHAIN_ID}</Label>
        </FlexContainer>
        {/* POOL */}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Pool</Label>
          <FlexContainer>
            <CryptoContainer style={{ zIndex: 2 }}>
            <img
                  alt={`${token0} icon`}
                  src={getTokenIconById(token0Name, pact.allTokens)}
                  style={{ width: 20, height: 20, marginRight: '8px' }}
                  onError={(e) => {
                    console.error(`Failed to load icon for ${token0}:`, e);
                    e.target.onerror = null;
                    e.target.src = DEFAULT_ICON_URL;
                  }}
                />
            </CryptoContainer>
            <CryptoContainer style={{ marginLeft: -12, zIndex: 1 }}>
            <img
                  alt={`${token1} icon`}
                  src={getTokenIconById(token1Name, pact.allTokens)}
                  style={{ width: 20, height: 20, marginRight: '8px' }}
                  onError={(e) => {
                    console.error(`Failed to load icon for ${token1}:`, e);
                    e.target.onerror = null;
                    e.target.src = DEFAULT_ICON_URL;
                  }}
                />            
                </CryptoContainer>

            <Label fontSize={13}>
              {pair?.token0}/{pair?.token1}
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
          <Label fontSize={13}>{(pact.share(extractDecimal(fromValues)) * 100).toPrecision(4)} %</Label>
        </FlexContainer>

        <CustomDivider style={{ margin: '4px 0' }} />

        <Label>Amount</Label>
        {/* FROM VALUES */}
        <RowTokenInfoPrice
          tokenIcon={getTokenIconById(token0Name, pact.allTokens)}
          tokenName={token0}
          amount={fromValues}
          tokenPrice={pact.tokensUsdPrice?.[token0] || null}
          contract={token0Name}
        />

        {/* TO VALUES */}

        <RowTokenInfoPrice
          tokenIcon={getTokenIconById(token1Name, pact.allTokens)}
          tokenName={token1}
          amount={
            fromValues 
              ? fromValues * reduceBalance(pact?.computeOut(fromValues) / fromValues, 12)
              : swap?.localRes?.result?.data?.[token1 === pair.token1 ? 'amount1' : 'amount0']
          }
          tokenPrice={pact.tokensUsdPrice?.[token1] || null}
          contract={token1Name}

        />

        <FlexContainer className="row justify-sb">
          <Label>Ratio</Label>
          {pact.pairReserve?.token0 !== 0 && pact.pairReserve?.token1 !== 0 ? (
            <Label fontSize={13}>{`1 ${pair?.token0} = ${
              getDecimalPlaces(pact?.computeOut(fromValues) / fromValues) < 0.000001
                ? '< 0.000001'
                : getDecimalPlaces(pact?.computeOut(fromValues) / fromValues)
            } ${pair?.token1}`}</Label>
          ) : (
            <Label fontSize={13}>{`1 ${token0} = ${
              getDecimalPlaces(
                pact?.getRatioFirstAddLiquidity(
                  token1,
                  swap?.localRes?.result?.data?.[token1 === pair.token1 ? 'amount1' : 'amount0'],
                  token0,
                  fromValues
                )
              ) < 0.000001
                ? '< 0.000001'
                : getDecimalPlaces(
                    pact?.getRatioFirstAddLiquidity(
                      token1,
                      swap?.localRes?.result?.data?.[token1 === pair.token1 ? 'amount1' : 'amount0'],
                      token0,
                      fromValues
                    )
                  )
            } ${token1}`}</Label>
          )}
        </FlexContainer>
      </FlexContainer>
    </SuccesViewContainer>
  );
};
export const SuccessAddSigleSideView = ({ apr, multiplier, initialAmount, token0, token0Name, token1, token1Name, loading, onClick  }) => {

  const { account } = useAccountContext();
  const pact = usePactContext();
  const swap = useSwapContext();
  const pair = getPairByTokensName(token0, token1, pact.allPairs);
  const fromValues = extractDecimal(swap?.localRes?.result?.data?.[token0 === pair.token0 ? 'amount0' : 'amount1']);

  return (
    <SuccesViewContainer swap={swap} loading={loading} onClick={onClick} hideSubtitle>
      <FlexContainer className="w-100 column" gap={12}>
        {/* ACCOUNT */}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Account</Label>
          <Label fontSize={13}>
            <CopyPopup textToCopy={account.account} />
            {reduceToken(account.account)}
          </Label>
        </FlexContainer>
        {/* CHAIN */}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Chain ID</Label>
          <Label fontSize={13}>{CHAIN_ID}</Label>
        </FlexContainer>
        {/* POOL */}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Pool</Label>
          <FlexContainer>
            <CryptoContainer size={24} style={{ zIndex: 2 }}>
            <img 
          src={getTokenIconById(token0Name, pact.allTokens)}
          alt={token0}
          style={{ width: 20, height: 20 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_ICON_URL;
          }}
        />
              
            </CryptoContainer>
            <CryptoContainer size={24} style={{ marginLeft: -12, zIndex: 1 }}>
            <img 
          src={getTokenIconById(token1Name, pact.allTokens)}
          alt={token0}
          style={{ width: 20, height: 20 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_ICON_URL;
          }}
        />
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
            <Label fontSize={13}>{`${multiplier ? (apr * multiplier)?.toFixed(2) : apr?.toFixed(2)} %`}</Label>
          </FlexContainer>
        )}
        {/* POOL SHARE*/}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Pool Share</Label>
          <Label fontSize={13}>{(pact.share(extractDecimal(fromValues)) * 100).toPrecision(4)} %</Label>
        </FlexContainer>

        <CustomDivider style={{ margin: '4px 0' }} />

        <Label>Amount</Label>
        <FlexContainer mobileClassName="column" gap={16}>
          {/* LEFT */}
          <FlexContainer className="w-100 justify-ce align-ce">
            <RowTokenInfoPrice
              tokenIcon={getTokenIconById(token0Name, pact.allTokens)}
              tokenName={token0}
              amount={initialAmount}
              tokenPrice={pact.tokensUsdPrice?.[token0] || null}
              contract={token0Name}

            />
          </FlexContainer>
          <FlexContainer className="align-ce justify-ce" mobileClassName="w-100">
            <ArrowIcon className="mobile-none" style={{ transform: 'rotate(-90deg)' }} />
            <ArrowIcon className="mobile-only" />
          </FlexContainer>
          {/* RIGHT */}
          <FlexContainer className="justify-ce column w-100" gap={14}>
            <RowTokenInfoPrice
              tokenIcon={getTokenIconById(token0Name, pact.allTokens)}
              tokenName={token0}
              amount={fromValues}
              tokenPrice={pact.tokensUsdPrice?.[token0] || null}
              contract={token0Name}

            />
            <RowTokenInfoPrice
              tokenIcon={getTokenIconById(token1Name, pact.allTokens)}
              tokenName={token1}
              amount={extractDecimal(swap?.localRes?.result?.data?.[token1 === pair.token1 ? 'amount1' : 'amount0'])}
              tokenPrice={pact.tokensUsdPrice?.[token1] || null}
              contract={token1Name}
            />
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </SuccesViewContainer>
  );
};

export const SuccessDoubleSideRemoveView = ({ token0, token0Name, token1, token1Name, loading, onClick, pair }) => {
  const swap = useSwapContext();
  const { wantsKdxRewards } = useLiquidityContext();
  const pact = usePactContext();
  return (
    <SuccesViewContainer swap={swap} loading={loading} onClick={onClick} hideSubtitle>
      <FlexContainer className="w-100 column" gap={12}>
        {/* DISCLAIMER */}
         <DisclaimerUnverifiedTokens />
        <Label>Are you sure you want to remove your liquidity?</Label>

        <CustomDivider style={{ margin: '16px 0' }} />

        <div className="flex">
          <Label fontSize={16}>Amount</Label>
        </div>

        <RowTokenInfoPrice
          tokenIcon={getTokenIconById(token0Name, pact.allTokens)}
          tokenName={token0}
          amount={pair.isBoosted ? swap?.localRes?.result?.data?.amountA : swap?.localRes?.result?.data?.amount0}
          tokenPrice={pact.tokensUsdPrice?.[token0] || null}
          contract={token0Name}
        
        />
        <RowTokenInfoPrice
          tokenIcon={getTokenIconById(token1Name, pact.allTokens)}
          tokenName={token1}
          amount={pair.isBoosted ? swap?.localRes?.result?.data?.amountB : swap?.localRes?.result?.data?.amount1}
          tokenPrice={pact.tokensUsdPrice?.[token1] || null}
          contract={token1Name}
        />
        {wantsKdxRewards && pair.isBoosted && (
          <>
            <div className="flex" style={{ marginTop: 6 }}>
              <Label fontSize={16}>Estimated Rewards</Label>
            </div>
            <RowTokenInfoPrice
              tokenIcon={getTokenIconById('kaddex.kdx', pact.allTokens)}
              tokenName={'KDX'}
              amount={swap?.localRes?.resPreview?.['estimated-kdx-rewards']}
              tokenPrice={pact.tokensUsdPrice?.KDX || null}
              contract={"kaddex.kdx"}
            />
          </>
        )}
      </FlexContainer>
    </SuccesViewContainer>
  );
};
export const SuccessSingleSideRemoveView = ({ token0, token0Name, token1, token1Name, loading, onClick, pair }) => {
  const swap = useSwapContext();
  const { wantsKdxRewards } = useLiquidityContext();
  const pact = usePactContext();
  return (
    <SuccesViewContainer swap={swap} loading={loading} onClick={onClick} hideSubtitle>
      <FlexContainer className="w-100 column" gap={12}>
        {/* DISCLAIMER */}
        {(!pact.allTokens[token0].isVerified || !pact.allTokens[token1].isVerified) && <DisclaimerUnverifiedTokens />}
        <Label>Are you sure you want to remove your liquidity?</Label>

        <CustomDivider style={{ margin: '16px 0' }} />

        <div className="flex justify-sb mobile-none">
          <Label fontSize={16}>Amount</Label>
          <Label fontSize={16}>Receive</Label>
        </div>

        <FlexContainer mobileClassName="column" gap={16}>
          {/* LEFT */}
          <Label className="mobile-only" fontSize={16}>
            Amount
          </Label>

          <FlexContainer className="justify-ce column w-100" gap={14}>
            <RowTokenInfoPrice
              tokenIcon={getTokenIconById(token0Name, pact.allTokens)}
              tokenName={token0}
              amount={
                pair.isBoosted ? swap?.localRes?.result?.data?.['remove-result']?.amountA : swap?.localRes?.result?.data?.['remove-result']?.amount0
              }
              tokenPrice={pact.tokensUsdPrice?.[token0] || null}
              contract={token0Name}
            />
            <RowTokenInfoPrice
              tokenIcon={getTokenIconById(token1Name, pact.allTokens)}
              tokenName={token1}
              amount={
                pair.isBoosted ? swap?.localRes?.result?.data?.['remove-result']?.amountB : swap?.localRes?.result?.data?.['remove-result']?.amount1
              }
              tokenPrice={pact.tokensUsdPrice?.[token1] || null}
              contract={token1Name}
            />
          </FlexContainer>

          <FlexContainer className="align-ce justify-ce" mobileClassName="w-100">
            <ArrowIcon className="mobile-none" style={{ transform: 'rotate(-90deg)' }} />
            <ArrowIcon className="mobile-only" />
          </FlexContainer>
          {/* RIGHT */}
          <Label className="mobile-only" fontSize={16}>
            Receive 
          </Label>

          <FlexContainer className="w-100 justify-ce align-ce">
            <RowTokenInfoPrice
              tokenIcon={getTokenIconByCode(swap?.localRes?.result?.data?.['swap-result']?.[1].token, pact.allTokens)}
              tokenName={getTokenName(swap?.localRes?.result?.data?.['swap-result']?.[1].token, pact.allTokens)}
              amount={swap?.localRes?.result?.data?.['total-amount']}
              tokenPrice={pact.tokensUsdPrice?.[getTokenName(swap?.localRes?.result?.data?.['swap-result']?.[1].token, pact.allTokens)] || null}
            />
          </FlexContainer>
        </FlexContainer>
        {wantsKdxRewards && pair.isBoosted && (
          <>
            <div className="flex" style={{ marginTop: 6 }}>
              <Label fontSize={16}>Estimated Rewards</Label>
            </div>
            <RowTokenInfoPrice
              tokenIcon={getTokenIconById('kaddex.kdx', pact.allTokens)}
              tokenName={'KDX'}
              amount={swap?.localRes?.resPreview?.['estimated-kdx-rewards']}
              tokenPrice={pact.tokensUsdPrice?.KDX || null}
            />
          </>
        )}
      </FlexContainer>
    </SuccesViewContainer>
  );
};
export const SuccessRemoveWithBoosterView = ({ token0, token0Name, token1, token1Name, loading, onClick }) => {
  const swap = useSwapContext();
  const pact = usePactContext();
  const [checked, setChecked] = useState(false);
  return (
    <SuccesViewContainer
      swap={swap}
      loading={loading}
      onClick={onClick}
      hideSubtitle
      icon={<EckoOutlineIcon />}
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
        <Label labelStyle={{ lineHeight: '19px' }}>KDX Multiplier will unlock in 72 hours from the moment the user removes liquidity.</Label>

        <div className="flex align-ce justify-sb">
          <Label>KDX Multiplier Unlock Date</Label>
          <Label>{moment().add(72, 'hours').format('DD/MM/YYYY HH:mm')}</Label>
        </div>

        <CustomDivider style={{ margin: '16px 0' }} />

        <Label fontSize={16}>Amount</Label>

        <div className="flex align-ce justify-sb">
          <div className="flex align-ce">
            <CryptoContainer size={24}>{getTokenIconById(token0, pact.allTokens)}</CryptoContainer>
            <Label>
              {extractDecimal(swap?.localRes?.result?.data?.amount0)} {token0}
            </Label>
          </div>
          <Label>{token0}</Label>
        </div>
        <div className="flex align-ce justify-sb">
          <div className="flex align-ce">
            <CryptoContainer size={24}>{getTokenIconById(token1, pact.allTokens)}</CryptoContainer>
            <Label>
              {extractDecimal(swap?.localRes?.result?.data?.amount1)} {token1}
            </Label>
          </div>

          <Label>{token1}</Label>
        </div>

        <Label fontSize={16}>Rewards</Label>

        <div className="flex align-ce justify-sb">
          <div className="flex align-ce">
            insert-token-logo-rewards
            {/* <CryptoContainer size={24}>{getTokenIconById(token0,pact.allTokens)}</CryptoContainer> */}
            <Label>insert-amount-rewards</Label>
          </div>
          <Label>insert-token-name-rewards</Label>
        </div>
      </FlexContainer>
    </SuccesViewContainer>
  );
};

export const CheckboxContainer = styled.div`
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
