/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { ENABLE_GAS_STATION, GAS_PRICE } from '../../../constants/contextConstants';
import { extractDecimal, gasUnit } from '../../../utils/reduceBalance';
import { getTokenIcon, showTicker } from '../../../utils/token-utils';
import GameEditionLabel from '../../game-edition-v2/components/GameEditionLabel';
import Label from '../../shared/Label';
import { Row, SuccessViewContainerGE, SuccesViewContainer } from '../../modals/swap-modals/common-result-components';
import { useGameEditionContext } from '../../../contexts';

export const SuccessAddRemoveViewGE = ({ token0, token1, swap, label, onBPress }) => {
  const { setButtons } = useGameEditionContext();
  useEffect(() => {
    setButtons({ B: onBPress });
  }, []);

  return (
    <SuccessViewContainerGE
      hideIcon
      title={label}
      leftItem={
        <>
          <GameEditionLabel fontSize={32} color="blue">
            {showTicker(token0)}
          </GameEditionLabel>
          <Row className="fs">
            {getTokenIcon(token0)}
            <GameEditionLabel fontSize={22} color="blue-grey">
              {extractDecimal(swap?.localRes?.result?.data?.amount0)}
            </GameEditionLabel>
          </Row>
        </>
      }
      rightItem={
        <>
          <GameEditionLabel fontSize={32} color="blue">
            {showTicker(token1)}
          </GameEditionLabel>

          <Row className="fs">
            {getTokenIcon(token1)}
            <GameEditionLabel fontSize={22} color="blue-grey">
              {extractDecimal(swap?.localRes?.result?.data?.amount1)}
            </GameEditionLabel>
          </Row>
        </>
      }
      infoItems={[
        {
          label: 'gas cost KDA',
          value: ENABLE_GAS_STATION ? (
            <>
              <GameEditionLabel geColor="white">{gasUnit(GAS_PRICE * swap?.localRes?.gas)} KDA</GameEditionLabel>
              <GameEditionLabel geColor="white" labelStyle={{ marginLeft: 5 }}>
                FREE!
              </GameEditionLabel>
            </>
          ) : (
            <GameEditionLabel geColor="white">{gasUnit(GAS_PRICE * swap?.localRes?.gas)} KDA</GameEditionLabel>
          ),
        },
      ]}
    />
  );
};

export const SuccessAddRemoveView = ({ token0, token1, swap, loading, label, onClick }) => {
  return (
    <SuccesViewContainer swap={swap} loading={loading} onClick={onClick}>
      <Row className="fs">
        <Label fontFamily="bold">{label}</Label>
      </Row>
      <Row className="sb">
        <Row className="fs">
          {getTokenIcon(token0)}
          <Label fontFamily="bold">{extractDecimal(swap?.localRes?.result?.data?.amount0)}</Label>
        </Row>
        <Label fontFamily="bold">{showTicker(token0)}</Label>
      </Row>
      <Row className="fs">
        <Label fontFamily="bold">{label}</Label>
      </Row>
      <Row className="sb">
        <Row className="fs">
          {getTokenIcon(token1)}
          <Label fontFamily="bold">{extractDecimal(swap?.localRes?.result?.data?.amount1)}</Label>
        </Row>
        <Label fontFamily="bold">{showTicker(token1)}</Label>
      </Row>
    </SuccesViewContainer>
  );
};
