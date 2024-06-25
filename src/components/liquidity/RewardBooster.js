/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { getKdxRewardsAvailable, getPairMultiplier } from '../../api/liquidity-rewards';
import { BoosterIcon, CoinEckoIcon, CoinsIcon, EckoOutlineIcon } from '../../assets';
import { KDX_TOTAL_SUPPLY } from '../../constants/contextConstants';
import { LIQUIDITY_VIEW } from '../../constants/liquidityView';
import { useLiquidityContext, usePactContext } from '../../contexts';
import theme from '../../styles/theme';
import { extractDecimal, getDecimalPlaces, humanReadableNumber } from '../../utils/reduceBalance';
import { FlexContainer } from '../shared/FlexContainer';
import InfoPopup from '../shared/InfoPopup';
import Label from '../shared/Label';
import Toggle from './Toggle';

const RewardBooster = ({ type, apr, handleState, previewObject, pair, isBoosted }) => {
  const { wantsKdxRewards, setWantsKdxRewards } = useLiquidityContext();
  const { tokensUsdPrice, allTokens } = usePactContext();
  const [, setLoading] = useState(false);

  const [multiplier, setMultiplier] = useState(null);
  const [rewardsAvailable, setRewardsAvailable] = useState(null);

  const fetchData = async () => {
    const res = await getKdxRewardsAvailable();
    if (!res.errorMessage) {
      setRewardsAvailable(extractDecimal(res));
    }
    if (pair && pair?.isBoosted) {
      const result = await getPairMultiplier(allTokens[pair?.token0].code, allTokens[pair?.token1].code);
      if (!result.errorMessage) {
        setMultiplier(result);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    handleState(isBoosted);
    fetchData();
  }, [pair]);

  useEffect(() => {
    if (isBoosted) {
      setWantsKdxRewards(isBoosted);
    } else {
      setWantsKdxRewards(false);
    }
  }, [isBoosted]);

  return (
    <>
      <Label fontFamily="syncopate">
        {wantsKdxRewards ? (
          <>
            <BoosterIcon className="svg-app-color" style={{ marginRight: 10 }} /> KDX MULTIPLIER
          </>
        ) : (
          'STANDARD REWARDS'
        )}
      </Label>
      <Wrapper gap={16} withGradient className="background-fill w-100 column" style={{ padding: 24 }}>
        <div className="flex justify-sb align-fs">
          <FlexContainer gap={16} className="align-ce">
            <CoinsIcon className="coins-icon" />
            <Toggle
              initialState={isBoosted}
              onClick={(active) => {
                if (active) {
                  handleState(true);
                } else {
                  handleState(false);
                }
              }}
              disabled={!isBoosted}
            />
            {wantsKdxRewards ? (
              <CoinEckoIcon width={24} height={24} />
            ) : (
              <EckoOutlineIcon
                className="svg-app-color"
                style={{ border: `1px solid ${theme.colors.white}`, borderRadius: '100%' }}
                width={24}
                height={24}
              />
            )}
          </FlexContainer>
          {wantsKdxRewards && multiplier ? (
            <div className="flex column">
              <Label fontSize={24}>APR {(apr * extractDecimal(multiplier))?.toFixed(2)} %</Label>
              <Label className="justify-fe" fontSize={13} withShade labelStyle={{ marginTop: 4 }}>
                {extractDecimal(multiplier)?.toFixed(2)} x
              </Label>
            </div>
          ) : (
            <div className="flex column">
              <Label fontSize={24}> APR {apr?.toFixed(2)} %</Label>
            </div>
          )}
        </div>

        {wantsKdxRewards && (
          <div className="flex justify-sb align-ce">
            <div>
              <Label fontSize={13}>
                KDX Rewards Available
                <InfoPopup size={16} type="modal" title="KDX Rewards Available">
                  <Label>
                    Accounting for 40 % of the overall supply, Network Rewards serve a crucial function of both attracting liquidity and mitigating
                    impermanent loss. Their emission is programmatical, diminishing and time oriented.
                  </Label>
                  <Label labelStyle={{ marginTop: 8 }}>
                    <a href="https://dex.ecko.finance/liquidity-mining-2.0.pdf" target="_blank" rel="noopener noreferrer">
                      Read the documentation
                    </a>
                  </Label>
                </InfoPopup>
              </Label>
            </div>
            <Label fontSize={13}>{((rewardsAvailable * 100) / (KDX_TOTAL_SUPPLY * 0.4)).toFixed(2)} %</Label>
          </div>
        )}
        {type === LIQUIDITY_VIEW.REMOVE_LIQUIDITY && isBoosted && (
          <div className="flex justify-sb align-fs">
            <Label fontSize={16}>Fees Collected</Label>
            {wantsKdxRewards ? (
              <div className="column">
                <Label className="justify-fe" fontSize={16}>
                  ~ {previewObject ? getDecimalPlaces(extractDecimal(previewObject?.['estimated-kdx-rewards'])) : '-'} KDX
                </Label>
                <Label fontSize={13} className="justify-fe" withShade labelStyle={{ marginTop: 4 }}>
                  {tokensUsdPrice && previewObject
                    ? `$ ${humanReadableNumber(tokensUsdPrice?.KDX * extractDecimal(previewObject['estimated-kdx-rewards']))}`
                    : ''}
                </Label>
              </div>
            ) : (
              <div className="column">
                <Label className="justify-fe" fontSize={16}>
                  {previewObject ? getDecimalPlaces(extractDecimal(previewObject['tokenA-fees-received'])) : '-'} {pair?.token0}
                </Label>
                <Label fontSize={13} className="justify-fe" withShade labelStyle={{ marginTop: 4 }}>
                  {tokensUsdPrice && previewObject
                    ? `$ ${humanReadableNumber(tokensUsdPrice[pair?.token0] * extractDecimal(previewObject['tokenA-fees-received']))}`
                    : ''}
                </Label>
                <Label className="justify-fe" fontSize={16} labelStyle={{ marginTop: 10 }}>
                  {previewObject ? getDecimalPlaces(extractDecimal(previewObject['tokenB-fees-received'])) : '-'} {pair?.token1}
                </Label>
                <Label fontSize={13} className="justify-fe" withShade labelStyle={{ marginTop: 4 }}>
                  {tokensUsdPrice && previewObject
                    ? `$ ${humanReadableNumber(tokensUsdPrice[pair?.token1] * extractDecimal(previewObject['tokenB-fees-received']))}`
                    : ''}
                </Label>
              </div>
            )}
          </div>
        )}
      </Wrapper>
    </>
  );
};

export default RewardBooster;

const Wrapper = styled(FlexContainer)`
  .coins-icon {
    path,
    ellipse {
      stroke: ${({ theme: { colors } }) => colors.white};
    }
  }
`;
