import React from 'react';
import { useAccountContext, usePactContext, useSwapContext } from '../../../contexts';
import { extractDecimal, reduceBalance } from '../../../utils/reduceBalance';
import reduceToken from '../../../utils/reduceToken';
import { getTokenIconByCode, getTokenName } from '../../../utils/token-utils';
import GameEditionLabel from '../../game-edition-v2/components/GameEditionLabel';
import { ChainIcon } from '../../../assets';
import { CHAIN_ID, ENABLE_GAS_STATION, GAS_PRICE } from '../../../constants/contextConstants';
import Label from '../../shared/Label';
import { CryptoContainer, FlexContainer } from '../../shared/FlexContainer';
import CopyPopup from '../../shared/CopyPopup';
import CustomDivider from '../../shared/CustomDivider';
import { SuccessViewContainerGE, SuccesViewContainer } from '../TxView';

export const SwapSuccessViewGE = () => {
  const { account } = useAccountContext();

  const pact = usePactContext();
  const swap = useSwapContext();
  return (
    <SuccessViewContainerGE
      containerStyle={{ marginTop: 16 }}
      leftItem={
        <>
          <div className="flex justify-fs align-ce">
            {getTokenIconByCode(swap?.localRes?.result?.data[0]?.token)}
            <GameEditionLabel fontSize={32} color="black" fontFamily="syncopate">
              {extractDecimal(swap?.localRes?.result?.data[0]?.amount)}
            </GameEditionLabel>
          </div>

          <GameEditionLabel color="blue">From</GameEditionLabel>
          <div className="flex justify-fs">
            <GameEditionLabel fontSize={22} color="blue-grey">
              {reduceToken(account.account)}
            </GameEditionLabel>
            <ChainIcon className="chain-icon" />
            <GameEditionLabel fontSize={22} color="blue-grey">
              {swap?.localRes?.metaData?.publicMeta?.chainId}
            </GameEditionLabel>
          </div>
        </>
      }
      rightItem={
        <>
          <div className="flex justify-fs align-ce">
            {getTokenIconByCode(swap?.localRes?.result?.data[1]?.token)}
            <GameEditionLabel fontSize={32} color="black" fontFamily="syncopate">
              {extractDecimal(swap?.localRes?.result?.data[1]?.amount)}
            </GameEditionLabel>
          </div>
          <GameEditionLabel color="blue">From</GameEditionLabel>
          <div className="flex justify-fs">
            <GameEditionLabel fontSize={22} color="blue-grey">
              {reduceToken(account.account)}
            </GameEditionLabel>
            <ChainIcon className="chain-icon" />
            <GameEditionLabel fontSize={22} color="blue-grey">
              {swap?.localRes?.metaData?.publicMeta?.chainId}
            </GameEditionLabel>
          </div>
        </>
      }
      infoItems={[
        {
          label: `${getTokenName(swap?.localRes?.result?.data[0]?.token)}/${getTokenName(swap?.localRes?.result?.data[1]?.token)}`,
          value: `1 = ${reduceBalance(pact?.computeOut(1), 6)}`,
        },
        {
          label: 'gas cost KDA',
          value: ENABLE_GAS_STATION ? (
            <>
              <GameEditionLabel geColor="white">{(GAS_PRICE * swap?.localRes?.gas).toPrecision(4)} KDA</GameEditionLabel>
              <GameEditionLabel geColor="white" labelStyle={{ marginLeft: 5 }}>
                FREE!
              </GameEditionLabel>
            </>
          ) : (
            <GameEditionLabel geColor="white">{(GAS_PRICE * swap?.localRes?.gas).toPrecision(4)} KDA</GameEditionLabel>
          ),
        },
      ]}
    />
  );
};

export const SwapSuccessView = ({ loading, sendTransaction }) => {
  const { account } = useAccountContext();
  const pact = usePactContext();

  const swap = useSwapContext();
  return (
    <SuccesViewContainer
      swap={swap}
      loading={loading}
      onClick={() => {
        sendTransaction();
      }}
    >
      <FlexContainer className="w-100 column" gap={12}>
        <Label>From</Label>

        {/* ACCOUNT */}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Account</Label>
          <Label fontSize={13}>
            <CopyPopup textToCopy={account.account} />
            {reduceToken(account.account)}
          </Label>
        </FlexContainer>
        {/* CHAIN */}
        <FlexContainer className="align-ce justify-sb">
          <Label fontSize={13}>Chain Id</Label>
          <Label fontSize={13}>{CHAIN_ID}</Label>
        </FlexContainer>

        <CustomDivider style={{ margin: '16px 0' }} />

        <Label>Amount</Label>

        {/* FROM VALUES */}
        <FlexContainer className="align-ce justify-sb">
          <FlexContainer>
            <CryptoContainer size={30}>{getTokenIconByCode(swap?.localRes?.result?.data[0]?.token)}</CryptoContainer>
            <Label>{extractDecimal(swap?.localRes?.result?.data[0]?.amount).toFixed(6)}</Label>
          </FlexContainer>
          <Label>{getTokenName(swap?.localRes?.result?.data[0]?.token)}</Label>
        </FlexContainer>
        <Label fontSize={13}>{`1 ${getTokenName(swap?.localRes?.result?.data[0]?.token)} = ${reduceBalance(pact?.computeOut(1), 12)} ${getTokenName(
          swap?.localRes?.result?.data[1]?.token
        )}`}</Label>
        {/* TO VALUES */}
        <FlexContainer className="align-ce justify-sb">
          <FlexContainer>
            <CryptoContainer size={30}>{getTokenIconByCode(swap?.localRes?.result?.data[1]?.token)}</CryptoContainer>
            <Label>{extractDecimal(swap?.localRes?.result?.data[1]?.amount).toFixed(6)}</Label>
          </FlexContainer>
          <Label>{getTokenName(swap?.localRes?.result?.data[1]?.token)}</Label>
        </FlexContainer>
        <Label fontSize={13}>{`1 ${getTokenName(swap?.localRes?.result?.data[1]?.token)} =  ${
          1 / reduceBalance(pact?.computeOut(1), 12)
        } ${getTokenName(swap?.localRes?.result?.data[0]?.token)}`}</Label>
      </FlexContainer>
    </SuccesViewContainer>
  );
};
