import moment from 'moment';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { CoinKaddexIcon } from '../../assets';
import { useAccountContext, useApplicationContext, useModalContext, usePactContext } from '../../contexts';
import { ROUTE_UNSTAKE } from '../../router/routes';
import { theme, commonColors } from '../../styles/theme';
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
  kdxAccountBalance,
  inputAmount,
  isInputDisabled,
  setKdxAmount,
  onClickMax,
  onSubmitStake,
}) => {
  const modalContext = useModalContext();
  const { tokensUsdPrice } = usePactContext();
  const { account } = useAccountContext();
  const { themeMode } = useApplicationContext();
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
    >
      <div>
        <Label>My Stake</Label>
        <Label fontSize={30}>{humanReadableNumber(amount)} KDX</Label>
        <Label fontSize={16} labelStyle={{ marginTop: 4, opacity: 0.7 }}>
          $ {humanReadableNumber(extractDecimal(tokensUsdPrice?.KDX) * extractDecimal(amount))}
        </Label>
        {pendingAmount && (
          <Label fontSize={15} labelStyle={{ marginTop: 8, color: commonColors.info }}>
            (Pending {humanReadableNumber(pendingAmount)} KDX)
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
          <FlexContainer className="align-ce" gap={8}>
            <Label className="pointer" onClick={onClickMax}>
              MAX
            </Label>

            <FlexContainer
              gap={10}
              className="flex"
              style={{ background: `${theme(themeMode).colors.white}33`, borderRadius: '20px', padding: '4px 8px' }}
            >
              <CoinKaddexIcon />
              <Label>KDX</Label>
            </FlexContainer>
          </FlexContainer>
        }
        bottomContent={
          inputAmount && (
            <Label fontSize={16} labelStyle={{ margin: '-10px 0px 10px 2px', opacity: 0.7 }}>
              $ {humanReadableNumber(extractDecimal(tokensUsdPrice?.KDX) * extractDecimal(inputAmount))}
            </Label>
          )
        }
        onChange={(e, { value }) => {
          setKdxAmount(limitDecimalPlaces(value, 7));
        }}
      />
      {pathname === ROUTE_UNSTAKE &&
        stakedTimeStart &&
        /*change back to: moment().diff(stakedTimeStart, 'hours') < 72 */ moment().diff(stakedTimeStart, 'hours') < 1 &&
        extractDecimal(amount) > 0 && (
          <div style={{ marginTop: 16 }}>
            <div className="flex align-ce">
              <Label>Position Penalty</Label>
            </div>
            <Label fontSize={24} color={commonColors.red}>
              3 %
            </Label>
            <Label fontSize={16} color={commonColors.red}>
              {/* change back to 72 (3days) */}
              {`${(stakedTimeStart && 1 - moment().diff(stakedTimeStart, 'hours')) || '-'} ${
                stakedTimeStart && (1 - moment().diff(stakedTimeStart, 'hours') > 1 ? 'hours' : 'hour')
              } `}
              left
            </Label>
          </div>
        )}
      <CustomButton
        type="gradient"
        buttonStyle={{
          marginTop:
            pathname === ROUTE_UNSTAKE &&
            stakedTimeStart &&
            /*change back to: moment().diff(stakedTimeStart, 'hours') < 72 */ moment().diff(stakedTimeStart, 'hours') < 1 &&
            extractDecimal(amount) > 0
              ? 16
              : 24,
        }}
        onClick={() => {
          if (!account.account) {
            modalContext.openModal({
              title: 'connect wallet',
              description: '',
              content: <ConnectWalletModal />,
            });
          } else {
            onSubmitStake();
          }
        }}
      >
        {!account.account
          ? 'Connect Wallet'
          : inputAmount === '' || !(inputAmount > 0)
          ? 'enter amount'
          : pathname === ROUTE_UNSTAKE
          ? inputAmount > amount
            ? 'insufficient kdx amount'
            : buttonLabel
          : inputAmount > kdxAccountBalance
          ? 'insufficient kdx amount'
          : buttonLabel}
      </CustomButton>
    </CommonWrapper>
  );
};

export default Position;
