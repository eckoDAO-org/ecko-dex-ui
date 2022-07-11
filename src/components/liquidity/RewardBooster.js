import React from 'react';
import styled from 'styled-components/macro';
import { BoosterIcon, CoinKaddexIcon, CoinsIcon, KaddexOutlineIcon } from '../../assets';
import { LIQUIDITY_VIEW } from '../../constants/liquidityView';
import { useLiquidityContext, usePactContext } from '../../contexts';
import theme from '../../styles/theme';
import { extractDecimal, getDecimalPlaces, humanReadableNumber } from '../../utils/reduceBalance';
import { FlexContainer } from '../shared/FlexContainer';
import InfoPopup from '../shared/InfoPopup';
import Label from '../shared/Label';
import Toggle from './Toggle';

const RewardBooster = ({ type, apr, handleState, previewObject, pair }) => {
  const { wantsKdxRewards } = useLiquidityContext();
  const { tokensUsdPrice } = usePactContext();
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
      <Wrapper gap={28} withGradient className="background-fill w-100 column" style={{ padding: 24 }}>
        <div className="flex justify-sb align-ce">
          <FlexContainer gap={16} className="align-ce">
            <CoinsIcon className="coins-icon" />
            <Toggle
              initialState={true}
              onClick={(active) => {
                if (active) {
                  handleState(true);
                } else {
                  handleState(false);
                }
              }}
            />
            {wantsKdxRewards ? (
              <CoinKaddexIcon width={24} height={24} />
            ) : (
              <KaddexOutlineIcon
                className="svg-app-color"
                style={{ border: `1px solid ${theme.colors.white}`, borderRadius: '100%' }}
                width={24}
                height={24}
              />
            )}
          </FlexContainer>
          <div className="flex column">
            <Label fontSize={24}> APR {apr?.toFixed(2)} %</Label>
            {wantsKdxRewards && (
              <Label className="justify-fe" fontSize={13} withShade labelStyle={{ marginTop: 4 }}>
                3.00 x
              </Label>
            )}
          </div>
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
                    <a href="https://drive.google.com/file/d/1DS_Nr0raqzpHW_gBolorJ-4lTNSrLdLB/view" target="_blank" rel="noopener noreferrer">
                      Read the documentation
                    </a>
                  </Label>
                </InfoPopup>
              </Label>
            </div>
            <Label fontSize={13}>{apr?.toFixed(2)} %</Label>
          </div>
        )}
        {type === LIQUIDITY_VIEW.REMOVE_LIQUIDITY && (
          <div className="flex justify-sb align-fs">
            <Label fontSize={16}>Fees Collected</Label>
            {wantsKdxRewards ? (
              <div className="column">
                <Label className="justify-fe" fontSize={16}>
                  {getDecimalPlaces(extractDecimal(previewObject['estimated-kdx-rewards']))} KDX
                </Label>
                <Label fontSize={13} className="justify-fe" withShade labelStyle={{ marginTop: 4 }}>
                  {tokensUsdPrice ? `$ ${humanReadableNumber(tokensUsdPrice?.KDX * extractDecimal(previewObject['estimated-kdx-rewards']))}` : ''}
                </Label>
              </div>
            ) : (
              <div className="column">
                <Label className="justify-fe" fontSize={16}>
                  {getDecimalPlaces(extractDecimal(previewObject['tokenA-fees-received']))} {pair?.token0}
                </Label>
                <Label fontSize={13} className="justify-fe" withShade labelStyle={{ marginTop: 4 }}>
                  {tokensUsdPrice
                    ? `$ ${humanReadableNumber(tokensUsdPrice[pair?.token0] * extractDecimal(previewObject['tokenA-fees-received']))}`
                    : ''}
                </Label>
                <Label className="justify-fe" fontSize={16} labelStyle={{ marginTop: 10 }}>
                  {getDecimalPlaces(extractDecimal(previewObject['tokenB-fees-received']))} {pair?.token1}
                </Label>
                <Label fontSize={13} className="justify-fe" withShade labelStyle={{ marginTop: 4 }}>
                  {tokensUsdPrice
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
