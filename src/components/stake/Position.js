import React from 'react';
import { CoinKaddexIcon } from '../../assets';
import { humanReadableNumber, limitDecimalPlaces } from '../../utils/reduceBalance';
import CustomButton from '../shared/CustomButton';
import CustomDivider from '../shared/CustomDivider';
import { FlexContainer } from '../shared/FlexContainer';
import Input from '../shared/Input';
import Label from '../shared/Label';
import CommonWrapper from './CommonWrapper';

const Position = ({ buttonLabel, amount, stakeKdxAmout, setStakeKdxAmount }) => {
  return (
    <CommonWrapper title="position (p)" popup="asd">
      <div>
        <Label>Amount</Label>
        <Label fontSize={32}>{humanReadableNumber(amount)}</Label>
      </div>
      <CustomDivider />

      <Input
        topLeftLabel="amount"
        topRightLabel={`balance: ${0 ?? '-'}`}
        placeholder="0.0"
        maxLength="15"
        numberOnly
        value={stakeKdxAmout}
        inputRightComponent={
          <FlexContainer className="pointer align-ce" gap={16} onClick={() => console.log('max')}>
            <Label>MAX</Label>

            <CoinKaddexIcon />

            <Label>KDX</Label>
          </FlexContainer>
        }
        onChange={(e, { value }) => {
          setStakeKdxAmount(limitDecimalPlaces(value, 12));
        }}
      />
      <CustomButton type="gradient">{buttonLabel}</CustomButton>
    </CommonWrapper>
  );
};

export default Position;
