import React from 'react';
import { CoinKaddexIcon } from '../../assets';
import { useAccountContext, useModalContext } from '../../contexts';
import { humanReadableNumber, limitDecimalPlaces } from '../../utils/reduceBalance';
import ConnectWalletModal from '../modals/kdaModals/ConnectWalletModal';
import CustomButton from '../shared/CustomButton';
import CustomDivider from '../shared/CustomDivider';
import { FlexContainer } from '../shared/FlexContainer';
import Input from '../shared/Input';
import Label from '../shared/Label';
import CommonWrapper from './CommonWrapper';

const Position = ({ buttonLabel, amount, stakeKdxAmout, setStakeKdxAmount }) => {
  const modalContext = useModalContext();
  const { account } = useAccountContext();
  return (
    <CommonWrapper
      title="position (p)"
      popup="“Position” accrues your KDX holdings from both the Vaulting and the Staking Programs. Please note that all Second Sale participants are automatically staking their KDX while it is being vesting."
      centerIcon
    >
      <div>
        <Label>Amount</Label>
        <Label fontSize={32}>{humanReadableNumber(amount)}</Label>
      </div>
      <CustomDivider style={{ margin: '40px 0' }} />

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

      <CustomButton
        type="gradient"
        buttonStyle={{ marginTop: 40 }}
        onClick={() => {
          if (!account.account) {
            modalContext.openModal({
              title: 'connect wallet',
              description: 'Connect a wallet using one of the methods below',
              content: <ConnectWalletModal />,
            });
          }
        }}
      >
        {!account.account ? 'Connect Wallet' : buttonLabel}
      </CustomButton>
    </CommonWrapper>
  );
};

export default Position;
