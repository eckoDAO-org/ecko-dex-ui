import React from 'react';
import { CoinKaddexIcon } from '../../assets';
import { useAccountContext, useModalContext, usePactContext } from '../../contexts';
import { humanReadableNumber, limitDecimalPlaces } from '../../utils/reduceBalance';
import ConnectWalletModal from '../modals/kdaModals/ConnectWalletModal';
import CustomButton from '../shared/CustomButton';
import CustomDivider from '../shared/CustomDivider';
import { FlexContainer } from '../shared/FlexContainer';
import Input from '../shared/Input';
import Label from '../shared/Label';
import CommonWrapper from './CommonWrapper';

const Position = ({ buttonLabel, amount, pendingAmount, topRightLabel, inputAmount, isInputDisabled, setKdxAmount, onClickMax, onSubmitStake }) => {
  const modalContext = useModalContext();
  const { kdxPrice } = usePactContext();
  const { account } = useAccountContext();
  return (
    <CommonWrapper
      title="position (p)"
      popup="“Position” accrues your KDX holdings from both the Vaulting and the Staking Programs. Please note that all Second Sale participants are automatically staking their KDX while it is being vesting."
      centerIcon
    >
      <div>
        <Label>My Stake</Label>
        <Label fontSize={32}>{humanReadableNumber(amount)} KDX</Label>
        <Label fontSize={24} labelStyle={{ marginTop: 8 }}>
          {humanReadableNumber(kdxPrice * amount)} USD
        </Label>
        {pendingAmount && <Label fontSize={15}>(Pending {humanReadableNumber(pendingAmount)})</Label>}
      </div>
      <CustomDivider style={{ margin: '40px 0' }} />

      <Input
        disabled={isInputDisabled}
        topLeftLabel="amount"
        topRightLabel={topRightLabel}
        placeholder="0.0"
        maxLength="15"
        numberOnly
        value={inputAmount}
        inputRightComponent={
          <FlexContainer className="pointer align-ce" gap={16} onClick={onClickMax}>
            <Label>MAX </Label>

            <CoinKaddexIcon />

            <Label>KDX</Label>
          </FlexContainer>
        }
        onChange={(e, { value }) => {
          setKdxAmount(limitDecimalPlaces(value, 12));
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
          } else {
            onSubmitStake();
          }
        }}
      >
        {!account.account ? 'Connect Wallet' : buttonLabel}
      </CustomButton>
    </CommonWrapper>
  );
};

export default Position;
