import moment from 'moment';
import React from 'react';
import { Divider } from 'semantic-ui-react';
import { usePactContext } from '../../contexts';
import { extractDecimal, humanReadableNumber } from '../../utils/reduceBalance';
import { getTimeByBlockchain } from '../../utils/string-utils';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import List from '../shared/List';

const MyStakeDetails = ({ stakeData }) => {
  const { tokensUsdPrice } = usePactContext();
  const filteredLocks = stakeData?.['stake-record']?.locks?.filter((x) => moment(getTimeByBlockchain(x?.until)) > moment());

  const totalLocks = () => {
    return filteredLocks?.reduce((accum, t) => accum + extractDecimal(t.amount), 0);
  };
  const nextUnlock = () => {
    return filteredLocks?.sort((x, y) => moment(getTimeByBlockchain(x?.['until'])) - moment(getTimeByBlockchain(y?.['until'])))[0];
  };

  nextUnlock();
  return (
    <FlexContainer className="column" gap={8}>
      {/* MY STAKE */}
      <FlexContainer className="column" gap={16}>
        <FlexContainer className="column" gap={4}>
          <Label>MyStake</Label>
          <Label fontSize={24}>{humanReadableNumber(stakeData?.['stake-record']?.['amount'])} KDX</Label>
          {tokensUsdPrice && (
            <Label fontSize={12} mobileFontSize={12} labelStyle={{ opacity: 0.7 }}>
              $ {humanReadableNumber(extractDecimal(tokensUsdPrice?.KDX) * extractDecimal(stakeData?.['stake-record']?.['amount']))}
            </Label>
          )}
        </FlexContainer>
        {/* AVAILABLE */}
        <FlexContainer className="column" gap={4}>
          <Label>Available</Label>
          <Label fontSize={16}>
            {humanReadableNumber(extractDecimal(stakeData?.staked) + extractDecimal(stakeData?.['stake-record']?.['pending-add']))} KDX
          </Label>
          {tokensUsdPrice && (
            <Label fontSize={12} mobileFontSize={12} labelStyle={{ opacity: 0.7 }}>
              ${' '}
              {humanReadableNumber(
                extractDecimal(tokensUsdPrice?.KDX) * extractDecimal(stakeData?.staked) + extractDecimal(stakeData?.['stake-record']?.['pending-add'])
              )}
            </Label>
          )}
        </FlexContainer>
        {/* LOCKED */}
        <FlexContainer className="column" gap={4}>
          <Label>Locked</Label>
          {totalLocks() ? (
            <>
              <Label fontSize={16}>{humanReadableNumber(totalLocks())} KDX</Label>
              {tokensUsdPrice && (
                <Label fontSize={12} mobileFontSize={12} labelStyle={{ opacity: 0.7 }}>
                  $ {humanReadableNumber(extractDecimal(tokensUsdPrice?.KDX) * extractDecimal(totalLocks()))}
                </Label>
              )}
            </>
          ) : (
            <Label>-</Label>
          )}
        </FlexContainer>
        {/* NEXT UNLOCK */}

        <FlexContainer className="column" gap={4}>
          <Label>Next Unlock</Label>
          {nextUnlock() ? (
            <>
              <div className="flex justify-sb">
                <Label fontSize={16}>{humanReadableNumber(nextUnlock()?.amount)} KDX</Label>
                <Label fontSize={16}>{moment(getTimeByBlockchain(nextUnlock()?.until)).format('YYYY/MM/DD')}</Label>
              </div>
              {tokensUsdPrice && (
                <Label fontSize={12} mobileFontSize={12} labelStyle={{ opacity: 0.7 }}>
                  $ {humanReadableNumber(extractDecimal(tokensUsdPrice?.KDX) * extractDecimal(nextUnlock()?.amount))}
                </Label>
              )}
            </>
          ) : (
            <Label fontSize={16}>-</Label>
          )}
        </FlexContainer>
      </FlexContainer>
      <Divider style={{ margin: '8px 0px' }} />
      <FlexContainer className="column" gap={16}>
        <Label fontSize={16}>My Stake</Label>
        <Label>Shows the total amount of your staked KDX. It takes into account both your unlocked and locked KDX.</Label>
      </FlexContainer>
      <Divider style={{ margin: '8px 0px' }} />

      <FlexContainer className="column" gap={16}>
        <Label fontSize={16}>Available</Label>
        <Label>Refers to the portion of your total “My Stake” position that is available to use.</Label>
      </FlexContainer>
      <Divider style={{ margin: '8px 0px' }} />

      <FlexContainer className="column" gap={16}>
        <Label fontSize={16}>Locked</Label>
        <Label>Shows the amount of KDX you purchased that have not yet been unlocked.</Label>
      </FlexContainer>
      <Divider style={{ margin: '8px 0px' }} />

      <FlexContainer className="column" gap={16}>
        <Label fontSize={16}>Next Unlock</Label>
        <FlexContainer className="column" gap={4}>
          <Label>Refers to the portion of KDX that will become available on the date displayed on the right side.</Label>
          <Label>Please note that each quantity will unlock according to the following schedule:</Label>
          <List
            listType="circle"
            items={['50 % - in 6 months from purchase time', '25 % - in 9 months from purchase time', '25 % - in 12 months from purchase time']}
          />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default MyStakeDetails;
