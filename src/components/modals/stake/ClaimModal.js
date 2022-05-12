import React from 'react';
import CustomButton from '../../shared/CustomButton';
import CustomDivider from '../../shared/CustomDivider';
import { KaddexOutlineIcon } from '../../../assets';
import { StakeModalRow, IconSubTitle } from './AddStakeModal';
import Label from '../../shared/Label';
import { usePactContext } from '../../../contexts';
import RowTokenInfoPrice from '../../shared/RowTokenInfoPrice';
import { getTokenIconByCode } from '../../../utils/token-utils';

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
        <RowTokenInfoPrice
          tokenIcon={getTokenIconByCode('kaddex.kdx')}
          tokenName="KDX"
          amount={estimateUnstakeData['reward-accrued']}
          tokenPrice={kdxPrice}
        />
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
            <RowTokenInfoPrice
              tokenIcon={getTokenIconByCode('kaddex.kdx')}
              tokenName="KDX"
              amount={estimateUnstakeData['reward-penalty']}
              tokenPrice={kdxPrice}
            />
          </StakeModalRow>
        </>
      ) : null}
      <CustomButton type="gradient" buttonStyle={{ marginTop: 40 }} onClick={onConfirm}>
        WITHDRAW
      </CustomButton>
    </div>
  );
};
