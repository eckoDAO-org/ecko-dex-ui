import React from 'react';
import CustomButton from '../../shared/CustomButton';
import { StakeModalRow } from './AddStakeModal';
import Label from '../../shared/Label';
import { usePactContext } from '../../../contexts';
import RowTokenInfoPrice from '../../shared/RowTokenInfoPrice';
import { getTokenIconByCode } from '../../../utils/token-utils';
import { KADDEX_NAMESPACE } from '../../../constants/contextConstants';

export const ClaimModal = ({ onConfirm, estimateUnstakeData }) => {
  const pact = usePactContext();

  return (
    <div>
      <Label fontSize={16}>Staking Rewards Collected</Label>
      <StakeModalRow style={{ marginBottom: 20 }}>
        <RowTokenInfoPrice
          tokenIcon={getTokenIconByCode(`${KADDEX_NAMESPACE}.kdx`, pact.allTokens)}
          tokenName="KDX"
          amount={estimateUnstakeData['reward-accrued']}
          tokenPrice={pact.tokensUsdPrice?.KDX}
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
              tokenIcon={getTokenIconByCode(`${KADDEX_NAMESPACE}.kdx`, pact.allTokens)}
              tokenName="KDX"
              amount={estimateUnstakeData['reward-penalty']}
              tokenPrice={pact.tokensUsdPrice?.KDX}
            />
          </StakeModalRow>
        </>
      ) : null}
      <CustomButton type="secondary" buttonStyle={{ marginTop: 32 }} onClick={onConfirm}>
        WITHDRAW
      </CustomButton>
    </div>
  );
};
