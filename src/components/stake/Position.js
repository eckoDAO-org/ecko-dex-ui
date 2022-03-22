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
      popup="Our DAO aggregator smart contract will allow three different avenues for $KDX holders to accrue a higher position. These three avenues are - First sale investor that choose to migrate to vaulting/lockup program, second sale investors during the vesting period, and all users that stake KDX from platform launch."
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
