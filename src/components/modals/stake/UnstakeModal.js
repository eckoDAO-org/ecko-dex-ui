import React, { useState } from 'react';
import moment from 'moment';
import CustomButton from '../../shared/CustomButton';
import CustomDivider from '../../shared/CustomDivider';
import { usePactContext } from '../../../contexts';
import { StakeModalRow } from './AddStakeModal';
import Label from '../../shared/Label';
import CustomCheckbox from '../../shared/CustomCheckbox';
import { extractDecimal, getDecimalPlaces, humanReadableNumber } from '../../../utils/reduceBalance';
import RowTokenInfoPrice from '../../shared/RowTokenInfoPrice';
import { getTokenIconByCode } from '../../../utils/token-utils';
import { STAKING_CONSTANTS } from '../../../constants/stakingConstants';
import { commonColors } from '../../../styles/theme';
import { KADDEX_NAMESPACE } from '../../../constants/contextConstants';

export const UnstakeModal = ({ onConfirm, isRewardsAvailable, estimateUnstakeData, toUnstakeAmount, stakedTimeStart }) => {
  const [checked, setChecked] = useState(false);

  const pact = usePactContext();
  const isThreePercentPenaltyActive = () => stakedTimeStart && moment().diff(stakedTimeStart, 'hours') < STAKING_CONSTANTS.percentagePenaltyHours;
  const isDynamicPenaltyActive = () => stakedTimeStart && moment().diff(stakedTimeStart, 'hours') < STAKING_CONSTANTS.rewardsPenaltyHoursToWait;

  const getUnstakeModalContent = () => {
    if (isThreePercentPenaltyActive()) {
      return (
        <>
          <Label>
            Removing KDX from your staking amount will incur a penalty of 3% of the unstaked amount. All the KDX penalties are going to be burnt in
            order to reduce the overall supply.
          </Label>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontSize: 16 }}>
              <Label>Position Penalty</Label>
              <Label>3%</Label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontSize: 16 }}>
              <Label>Amount </Label>
              <div style={{ textAlign: 'right' }}>
                <Label>{getDecimalPlaces(toUnstakeAmount * 0.03)} KDX</Label>
                <Label className="justify-fe" labelStyle={{ opacity: 0.7, fontSize: 13, marginTop: 4 }}>
                  $ {(toUnstakeAmount * 0.03 * pact.tokensUsdPrice?.KDX).toFixed(2)}
                </Label>
              </div>
            </div>
          </div>
          <CustomDivider style={{ margin: '15px 0' }} />
        </>
      );
    } else if (isDynamicPenaltyActive()) {
      const rewardPenalty = (100 * estimateUnstakeData['reward-penalty']) / estimateUnstakeData['reward-accrued'];
      return (
        <>
          <Label>
            {`Unstaking KDX will reset the rewards penalty timer to ${
              STAKING_CONSTANTS.rewardsPenaltyHoursToWait < 24
                ? `${STAKING_CONSTANTS.rewardsPenaltyHoursToWait} hours`
                : `${STAKING_CONSTANTS.rewardsPenaltyHoursToWait / 24} days`
            }. The rewards penalty will occur only if the user chooses to claim their
            rewards at their current penalty rate.`}
          </Label>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontSize: 16 }}>
              <Label>Rewards Penalty</Label>
              <Label>{rewardPenalty.toFixed(2)} %</Label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontSize: 16 }}>
              <Label>Amount </Label>
              <div style={{ textAlign: 'right' }}>
                <Label>{estimateUnstakeData['reward-penalty'].toFixed(2)} KDX</Label>
                <Label className="justify-fe" style={{ color: 'grey', fontSize: 13, marginTop: 4 }}>
                  $ {(estimateUnstakeData['reward-penalty'] * pact.tokensUsdPrice?.KDX).toFixed(2)}
                </Label>
              </div>
            </div>
          </div>
          <CustomDivider style={{ margin: '15px 0' }} />
        </>
      );
    } else {
      return (
        <>
          <Label fontSize={13} labelStyle={{ marginBottom: 20 }}>
            Are you sure you want to close your staking plan? Partially or completely removing your staking position will have a negative effect on
            your Voting power.
          </Label>
        </>
      );
    }
  };

  return (
    <div>
      {getUnstakeModalContent()}
      <Label fontSize={16}>Unstaked Amount</Label>
      <StakeModalRow>
        <RowTokenInfoPrice
          tokenIcon={getTokenIconByCode(`${KADDEX_NAMESPACE}.kdx`, pact.allTokens)}
          tokenName="KDX"
          amount={toUnstakeAmount}
          tokenPrice={pact.okensUsdPrice?.KDX}
        />
      </StakeModalRow>
      {isThreePercentPenaltyActive() ? (
        <StakeModalRow>
          <Label color={commonColors.red}>Position penalty</Label>
          <Label color={commonColors.red}>{getDecimalPlaces(toUnstakeAmount * 0.03)} KDX</Label>
        </StakeModalRow>
      ) : (
        ''
      )}
      {isRewardsAvailable ? (
        <StakeModalRow style={{ margin: '8px 0px 0px 4px' }}>
          <CustomCheckbox onClick={() => setChecked(!checked)}>Withdraw your KDX staking rewards</CustomCheckbox>
        </StakeModalRow>
      ) : (
        ''
      )}

      {checked && (
        <div style={{ marginTop: 15 }}>
          <Label fontSize={16}>Rewards Amount</Label>
          <StakeModalRow>
            <RowTokenInfoPrice
              tokenIcon={getTokenIconByCode(`${KADDEX_NAMESPACE}.kdx`, pact.allTokens)}
              tokenName="KDX"
              amount={(estimateUnstakeData && estimateUnstakeData?.['reward-accrued']) || 0}
              tokenPrice={pact.tokensUsdPrice?.KDX}
            />
          </StakeModalRow>
          {estimateUnstakeData && estimateUnstakeData?.['reward-penalty'] ? (
            <StakeModalRow>
              <Label color={commonColors.red}>Rewards penalty</Label>
              <Label color={commonColors.red}>{humanReadableNumber(extractDecimal(estimateUnstakeData?.['reward-penalty']))} KDX</Label>
            </StakeModalRow>
          ) : (
            ''
          )}
        </div>
      )}
      <CustomButton type="secondary" buttonStyle={{ marginTop: 32 }} onClick={() => onConfirm(checked)}>
        CONFIRM
      </CustomButton>
    </div>
  );
};
