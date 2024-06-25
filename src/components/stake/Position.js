import moment from 'moment';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { CoinEckoIcon } from '../../assets';
import { STAKING_CONSTANTS } from '../../constants/stakingConstants';
import { useAccountContext, useApplicationContext, useModalContext, usePactContext, useRightModalContext } from '../../contexts';
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
import MyStakeDetails from './MyStakeDetails';

const Position = ({
  stakeData,
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
  const rightModalContext = useRightModalContext();
  const modalContext = useModalContext();
  const { tokensUsdPrice } = usePactContext();
  const { account } = useAccountContext();
  const { themeMode } = useApplicationContext();
  const { pathname } = useLocation();

  const getButtonLabel = () => {
    if (!account.account) {
      return 'Connect Wallet';
    } else {
      if (inputAmount === '' || !(inputAmount > 0)) {
        return 'enter amount';
      } else {
        if (pathname === ROUTE_UNSTAKE) {
          if (inputAmount > amount) {
            return 'insufficient kdx amount';
          } else {
            return buttonLabel;
          }
        } else {
          if (inputAmount > kdxAccountBalance) {
            return 'insufficient kdx amount';
          } else {
            return buttonLabel;
          }
        }
      }
    }
  };

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
        <div className="flex justify-sb">
          <Label fontSize={13}>My Stake</Label>
          <CustomButton
            buttonStyle={{ padding: '4px 8px', width: 'min-content', height: 'min-content' }}
            fontSize={8}
            disabled={!stakeData}
            onClick={() =>
              rightModalContext.openModal({
                className: 'info-popup',
                title: 'details',
                content: <MyStakeDetails stakeData={stakeData} />,
                contentStyle: { padding: 16, paddingTop: 0 },
              })
            }
          >
            details
          </CustomButton>
        </div>
        <Label fontSize={24}>{humanReadableNumber(amount)} KDX</Label>
        {tokensUsdPrice?.KDX ? (
          <Label fontSize={12} mobileFontSize={12} labelStyle={{ marginTop: 4, opacity: 0.7 }}>
            $ {humanReadableNumber(extractDecimal(tokensUsdPrice?.KDX) * extractDecimal(amount))}
          </Label>
        ) : (
          ''
        )}
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
              <CoinEckoIcon />
              <Label>KDX</Label>
            </FlexContainer>
          </FlexContainer>
        }
        bottomContent={
          inputAmount && (
            <Label labelStyle={{ margin: '-10px 0px 10px 2px', opacity: 0.7 }}>
              $ {humanReadableNumber(extractDecimal(tokensUsdPrice?.KDX) * extractDecimal(inputAmount))}
            </Label>
          )
        }
        onChange={(e, { value }) => {
          setKdxAmount(limitDecimalPlaces(value, 12));
        }}
      />
      {pathname === ROUTE_UNSTAKE &&
        stakedTimeStart &&
        moment().diff(stakedTimeStart, 'hours') < STAKING_CONSTANTS.percentagePenaltyHours &&
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
              {`${(stakedTimeStart && STAKING_CONSTANTS.percentagePenaltyHours - moment().diff(stakedTimeStart, 'hours')) || '-'} ${
                stakedTimeStart && (STAKING_CONSTANTS.percentagePenaltyHours - moment().diff(stakedTimeStart, 'hours') > 1 ? 'hours' : 'hour')
              } `}
              left
            </Label>
          </div>
        )}
      <CustomButton
        type="secondary"
        disabled={getButtonLabel() !== buttonLabel}
        buttonStyle={{
          marginTop:
            pathname === ROUTE_UNSTAKE &&
            stakedTimeStart &&
            moment().diff(stakedTimeStart, 'hours') < STAKING_CONSTANTS.percentagePenaltyHours &&
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
        {getButtonLabel()}
      </CustomButton>
    </CommonWrapper>
  );
};

export default Position;
