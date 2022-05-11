import React from 'react';
import CustomButton from '../../shared/CustomButton';
import CustomDivider from '../../shared/CustomDivider';
import { CoinKaddexIcon } from '../../../assets';
import { KaddexOutlineIcon } from '../../../assets';
import { StakeModalRow, IconSubTitle } from './AddStakeModal';
import Label from '../../shared/Label';
import { FlexContainer } from '../../shared/FlexContainer';
import { getDecimalPlaces } from '../../../utils/reduceBalance';
import { usePactContext } from '../../../contexts';

export const ClaimModal = ({ onConfirm, estimateUnstakeData }) => {
  const { kdxPrice } = usePactContext();

  return (
    <div>
      <IconSubTitle>
        <KaddexOutlineIcon />
      </IconSubTitle>
      <CustomDivider style={{ margin: '15px 0' }} />
      <Label fontSize={16}>Staking Rewards Collected</Label>
      <StakeModalRow style={{ marginBottom: 20 }}>
        <FlexContainer className="w-100">
          <CoinKaddexIcon className="kaddex-price" style={{ marginRight: 16, height: 30, width: 30 }} />
          <FlexContainer className="column w-100">
            <FlexContainer className="justify-sb w-100">
              <Label>{getDecimalPlaces(estimateUnstakeData['reward-accrued'])} </Label>
              <Label>KDX</Label>
            </FlexContainer>
            <FlexContainer className="justify-sb w-100">
              <Label labelStyle={{ opacity: 0.7, fontSize: 13 }}>{(estimateUnstakeData['reward-accrued'] * kdxPrice).toFixed(2)}</Label>
              <Label labelStyle={{ opacity: 0.7, fontSize: 13 }}>USD</Label>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </StakeModalRow>

      {estimateUnstakeData['reward-penalty'] ? (
        <>
          <Label fontSize={16}>
            Rewards Penalty
            <Label fontSize={16} labelStyle={{ opacity: 0.7, marginLeft: 8 }}>
              - {((100 * estimateUnstakeData['reward-penalty']) / estimateUnstakeData['reward-accrued']).toFixed(2)} %
            </Label>
          </Label>
          <StakeModalRow>
            <FlexContainer className="w-100">
              <CoinKaddexIcon className="kaddex-price" style={{ marginRight: 16, height: 30, width: 30 }} />
              <FlexContainer className="column w-100">
                <FlexContainer className="justify-sb w-100">
                  <Label>{getDecimalPlaces(estimateUnstakeData['reward-penalty'])} </Label>
                  <Label>KDX</Label>
                </FlexContainer>
                <FlexContainer className="justify-sb w-100">
                  <Label labelStyle={{ opacity: 0.7, fontSize: 13 }}>{(estimateUnstakeData['reward-penalty'] * kdxPrice).toFixed(2)}</Label>
                  <Label labelStyle={{ opacity: 0.7, fontSize: 13 }}>USD</Label>
                </FlexContainer>
              </FlexContainer>
            </FlexContainer>
          </StakeModalRow>
        </>
      ) : null}
      <CustomButton type="gradient" buttonStyle={{ marginTop: 40 }} onClick={onConfirm}>
        WITHDRAW
      </CustomButton>
    </div>
  );
};
