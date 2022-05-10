import moment from 'moment';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { CoinKaddexIcon } from '../../assets';
import { useAccountContext, useModalContext, usePactContext } from '../../contexts';
import { ROUTE_UNSTAKE } from '../../router/routes';
import { commonColors } from '../../styles/theme';
import { extractDecimal, humanReadableNumber, limitDecimalPlaces } from '../../utils/reduceBalance';
import ConnectWalletModal from '../modals/kdaModals/ConnectWalletModal';
import CustomButton from '../shared/CustomButton';
import CustomDivider from '../shared/CustomDivider';
import { FlexContainer } from '../shared/FlexContainer';
import Input from '../shared/Input';
import Label from '../shared/Label';
import CommonWrapper from './CommonWrapper';

const Position = ({
  buttonLabel,
  amount,
  stakedTimeStart,
  pendingAmount,
  topRightLabel,
  inputAmount,
  isInputDisabled,
  setKdxAmount,
  onClickMax,
  onSubmitStake,
}) => {
  const modalContext = useModalContext();
  const { kdxPrice } = usePactContext();
  const { account } = useAccountContext();
  const { pathname } = useLocation();

  return (
    <CommonWrapper
      title="position (p)"
      popup={
        <Label>
          Position accrues your KDX holdings from both the Vaulting and the Staking Programs. Please note that all Second Sale participants are
          automatically staking their KDX while it is being vesting.
        </Label>
      }
      popupTitle="Position"
      centerIcon
    >
      <div>
        <Label>My Stake</Label>
        <Label fontSize={30}>{humanReadableNumber(amount)} KDX</Label>
        <Label fontSize={16} labelStyle={{ marginTop: 4, opacity: 0.7 }}>
          {humanReadableNumber(extractDecimal(kdxPrice) * extractDecimal(amount))} USD
        </Label>
        {pendingAmount && (
          <Label fontSize={15} labelStyle={{ marginTop: 8, color: commonColors.info }}>
            (Pending {humanReadableNumber(pendingAmount)})
          </Label>
        )}
      </div>
      <CustomDivider style={{ margin: '24px 0' }} />
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
          setKdxAmount(limitDecimalPlaces(value, 7));
        }}
      />
      {pathname === ROUTE_UNSTAKE && stakedTimeStart && moment().diff(stakedTimeStart, 'hours') < 72 && (
        <div style={{ marginTop: 16 }}>
          <div className="flex align-ce">
            <Label>Position Penalty</Label>
          </div>
          <Label fontSize={24} color={commonColors.red}>
            3%
          </Label>
          <Label fontSize={16} color={commonColors.red}>
            {`${(stakedTimeStart && 72 - moment().diff(stakedTimeStart, 'hours')) || '-'} ${
              stakedTimeStart && (72 - moment().diff(stakedTimeStart, 'hours') > 1 ? 'hours' : 'hour')
            } `}
            left
          </Label>
        </div>
      )}
      <CustomButton
        type="gradient"
        buttonStyle={{ marginTop: pathname === ROUTE_UNSTAKE && stakedTimeStart && moment().diff(stakedTimeStart, 'hours') < 72 ? 16 : 24 }}
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
