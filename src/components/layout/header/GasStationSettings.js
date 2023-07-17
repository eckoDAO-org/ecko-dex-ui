/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components/macro';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
import { useApplicationContext, usePactContext } from '../../../contexts';
import Input from '../../../components/shared/Input';
import Label from '../../shared/Label';
import { PumpIcon, WarningIcon } from '../../../assets';
import { FlexContainer } from '../../shared/FlexContainer';
import Toggle from '../../liquidity/Toggle';
import { GAS_OPTIONS, PATH_CONFIGURATION } from '../../../constants/gasConfiguration';
import { useLocation } from 'react-router-dom';
import { commonColors } from '../../../styles/theme';
import { getDecimalPlaces } from '../../../utils/reduceBalance';
import CustomDivider from '../../shared/CustomDivider';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  position: relative;
  align-items: center;
  z-index: 2;
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
  ${({ resolutionConfiguration }) => {
    if (resolutionConfiguration && resolutionConfiguration['normal-mode'].scale < 1) {
      const zoomScaleDiff = 1 - resolutionConfiguration['normal-mode'].scale;
      return css`
        zoom: calc(1 + ${zoomScaleDiff});
      `;
    }
  }};
`;
const PopupContainer = styled(FlexContainer)`
  display: flex;
  align-items: center;
  flex-direction: column;
  border-radius: 10px;
  position: absolute;

  right: 80px;
  top: -20px;
  &.header-item {
    top: 40px;
    right: 0px;
    @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
      right: -40px;
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  background: transparent;
  min-width: 270px;
`;

const GasButton = styled.div`
  border-radius: 16px;
  border: ${({ theme: { colors } }) => `1px solid ${colors.white}`};
  color: ${({ isSelected, theme: { colors } }) => (isSelected ? colors.primary : colors.white)};
  font-family: ${({ theme: { fontFamily } }) => fontFamily.syncopate};
  font-size: 12px;
  padding: 6.5px 8.5px;
  min-width: 62px;
  min-height: 32px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background-color: ${({ isSelected, theme: { colors } }) => isSelected && colors.white};
  cursor: pointer;
`;

const ContainerInputTypeNumber = styled.div`
  display: flex;
  align-items: center;
  min-height: 32px;
  justify-content: center;
  min-width: 120px;
  padding: 0px 8.5px;
  border-radius: 16px;
  border: ${({ theme: { colors } }) => `1px solid ${colors.info}`};
  color: ${({ theme: { colors } }) => colors.white};
  .ui.input > input {
    border: unset;
    padding: 0px;
    text-align: right;
    font-size: 14px;
    margin: 0px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;

  .restrictedInput {
    @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
      .ui.fluid.input > input {
        width: 30px !important;
      }
    }
  }
`;

const PumpIconContainer = styled.div`
  svg {
    path {
      fill: ${({ theme: { colors }, isGasOn }) => (isGasOn ? colors.green : colors.white)};
    }
  }
`;

const WarningAnimated = styled(WarningIcon)`
  position: absolute;
  cursor: pointer;
  width: 15px;
  height: 15px;
  bottom: 2px;
  right: -6px;
  animation: hithere 1s ease infinite;

  @keyframes hithere {
    30% {
      transform: scale(1.2);
    }
    40%,
    60% {
      transform: rotate(-20deg) scale(1.2);
    }
    50% {
      transform: rotate(20deg) scale(1.2);
    }
    70% {
      transform: rotate(0deg) scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const GasStationSettings = ({ className, hasNotification }) => {
  const pact = usePactContext();
  const { resolutionConfiguration } = useApplicationContext();
  const [showGasStationSettings, setShowGasStationSettings] = useState(false);
  const [currentSection, setCurrentSection] = useState('SWAP');
  const [clickedButton, setClickedButton] = useState('NORMAL');
  const { pathname } = useLocation();

  const ref = useRef();
  useOnClickOutside(ref, () => setShowGasStationSettings(false));

  useEffect(() => {
    const section = Object.values(PATH_CONFIGURATION).find((path) => path.route === pathname)?.name;
    if (section) {
      setCurrentSection(section);
      setClickedButton('NORMAL');
      if (pact.enableGasStation) {
        pact.setGasConfiguration(GAS_OPTIONS.DEFAULT[section]);
      } else pact.setGasConfiguration(GAS_OPTIONS.NORMAL[section]);
    } else {
      pact.setGasConfiguration(GAS_OPTIONS.NORMAL.SWAP);
      setClickedButton('NORMAL');
    }
  }, [pact.enableGasStation, pathname]);

  useEffect(() => {
    if (!pact.enableGasStation && pact.networkGasData.networkCongested) {
      handleSuggestedPrice(clickedButton);
    }
  }, [
    pact.networkGasData.networkCongested,
    pact.networkGasData.suggestedGasPrice,
    pact.networkGasData.highestGasPrice,
    pact.networkGasData.lowestGasPrice,
  ]);

  const handleSuggestedPrice = (type) => {
    let networkGas =
      type === 'ECONOMY'
        ? pact.networkGasData.lowestGasPrice
        : type === 'NORMAL'
        ? pact.networkGasData.suggestedGasPrice
        : pact.networkGasData.highestGasPrice;

    pact.networkGasData.networkCongested && networkGas > GAS_OPTIONS[type][currentSection].gasPrice
      ? pact.handleGasConfiguration('gasPrice', networkGas)
      : pact.setGasConfiguration(GAS_OPTIONS[type][currentSection]);
  };

  return (
    <Wrapper ref={ref} resolutionConfiguration={resolutionConfiguration}>
      <PumpIconContainer className="flex" onClick={() => setShowGasStationSettings((prev) => !prev)} isGasOn={pact.enableGasStation}>
        <PumpIcon style={{ cursor: 'pointer', width: 34, height: 34, marginLeft: -8, marginRight: -10 }} />
        {hasNotification && <WarningAnimated />}
      </PumpIconContainer>
      {showGasStationSettings && (
        <PopupContainer outOfGameEdition withGradient className={`background-fill ${className}`} style={{ width: 'unset', zIndex: 1 }}>
          <Container>
            <Label fontSize={13} outGameEditionView fontFamily="syncopate">
              Gas Station
            </Label>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Label labelStyle={{ marginRight: 8, marginTop: 8 }}>Off</Label>
              <Row style={{ marginTop: 8 }}>
                <Toggle initialState={pact.enableGasStation} onClick={pact.setEnableGasStation} />
              </Row>
              <Label labelStyle={{ marginLeft: 8, marginTop: 8 }}>On</Label>
            </div>
            {!pact.enableGasStation ? (
              <>
                <CustomDivider style={{ marginTop: 16 }} />
                <Label fontSize={13} outGameEditionView labelStyle={{ marginTop: 16 }} fontFamily="syncopate">
                  Gas Configuration
                </Label>
                <Row style={{ marginTop: 8 }}>
                  <ContainerInputTypeNumber>
                    <Input
                      outGameEditionView
                      noInputBackground
                      containerStyle={{
                        border: 'none',
                        boxShadow: 'none !important',
                        padding: '0px',
                      }}
                      placeholder={`${pact.gasConfiguration?.gasLimit}`}
                      numberOnly
                      value={pact.gasConfiguration?.gasLimit}
                      onChange={(e, { value }) => pact.handleGasConfiguration('gasLimit', value)}
                    />
                  </ContainerInputTypeNumber>
                  <Label fontSize={13} outGameEditionView labelStyle={{ marginLeft: 8 }}>
                    Gas Limit
                  </Label>
                </Row>
                <Row style={{ marginTop: 8 }}>
                  <ContainerInputTypeNumber>
                    <Input
                      outGameEditionView
                      noInputBackground
                      containerStyle={{
                        border: 'none',
                        boxShadow: 'none !important',
                        padding: '0px',
                      }}
                      placeholder={`${pact.gasConfiguration?.gasPrice}`}
                      numberOnly
                      value={pact.gasConfiguration?.gasPrice}
                      onChange={(e, { value }) => pact.handleGasConfiguration('gasPrice', value)}
                    />
                  </ContainerInputTypeNumber>
                  <Label fontSize={13} outGameEditionView labelStyle={{ marginLeft: 8 }}>
                    Gas Price
                  </Label>
                </Row>
                <Row className="w-100 justify-sb" style={{ marginTop: 16 }}>
                  <GasButton
                    isSelected={clickedButton === 'ECONOMY'}
                    onClick={() => {
                      handleSuggestedPrice('ECONOMY');
                      setClickedButton('ECONOMY');
                    }}
                  >
                    LOW
                  </GasButton>
                  <GasButton
                    isSelected={clickedButton === 'NORMAL'}
                    style={{ marginLeft: 4, marginRight: 4 }}
                    onClick={() => {
                      handleSuggestedPrice('NORMAL');
                      setClickedButton('NORMAL');
                    }}
                  >
                    NORMAL
                  </GasButton>
                  <GasButton
                    isSelected={clickedButton === 'FAST'}
                    style={{ marginRight: 8 }}
                    onClick={() => {
                      handleSuggestedPrice('FAST');
                      setClickedButton('FAST');
                    }}
                  >
                    FAST
                  </GasButton>
                </Row>
                <Label labelStyle={{ marginTop: 16 }}>Potential gas cost for transaction failure:</Label>
                <Label
                  labelStyle={{ marginTop: 8 }}
                  fontSize={16}
                  color={
                    pact.gasConfiguration?.gasPrice * pact.gasConfiguration?.gasLimit > 0.5
                      ? commonColors.error
                      : pact.gasConfiguration?.gasPrice * pact.gasConfiguration?.gasLimit <= 0.5 &&
                        pact.gasConfiguration?.gasPrice * pact.gasConfiguration?.gasLimit > 0.01
                      ? commonColors.orange
                      : commonColors.green
                  }
                >
                  {getDecimalPlaces(pact.gasConfiguration?.gasPrice * pact.gasConfiguration?.gasLimit)} KDA
                </Label>
              </>
            ) : null}

            {pact.networkGasData.networkCongested && (
              <>
                <Label color={commonColors.error} fontSize={16} outGameEditionView labelStyle={{ marginTop: 16 }}>
                  Speed up your transaction!
                </Label>
                <Label fontSize={13} outGameEditionView labelStyle={{ marginTop: 4 }}>
                  By disabling eckoDEX's free gas station, gas limit and gas price amounts will update automatically to meet gas requirements for a
                  successful transaction.
                </Label>
              </>
            )}
          </Container>
        </PopupContainer>
      )}
    </Wrapper>
  );
};

export default GasStationSettings;
