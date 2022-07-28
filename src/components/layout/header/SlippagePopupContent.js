/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components/macro';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
import { useApplicationContext, usePactContext } from '../../../contexts';
import Input from '../../../components/shared/Input';
import Label from '../../shared/Label';
import { CogIcon } from '../../../assets';
import { FlexContainer } from '../../shared/FlexContainer';

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

  right: 28px;
  top: -20px;
  &.header-item {
    top: 40px;
    right: 0px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  background: transparent;
`;

const SlippageTolleranceValue = styled.div`
  border-radius: 16px;
  border: ${({ theme: { colors } }) => `1px solid ${colors.white}`};
  color: ${({ isSelected, theme: { colors } }) => (isSelected ? colors.primary : colors.white)};
  font-family: ${({ isSelected, theme: { fontFamily } }) => (isSelected ? fontFamily.syncopate : fontFamily.basier)};
  font-size: 14px;
  padding: 6.5px 8.5px;
  min-width: 62px;
  min-height: 32px;
  display: flex;
  justify-content: center;
  background-color: ${({ isSelected, theme: { colors } }) => isSelected && colors.white};
  cursor: pointer;
`;

const ContainerInputTypeNumber = styled.div`
  display: flex;
  align-items: center;
  min-height: 32px;
  justify-content: center;
  padding: 0px 8.5px;
  border-radius: 16px;
  border: ${({ theme: { colors } }) => `1px solid ${colors.info}`};
  color: ${({ theme: { colors } }) => colors.white};
  min-width: 62px;
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

const SlippagePopupContent = ({ className }) => {
  const pact = usePactContext();
  const { resolutionConfiguration } = useApplicationContext();
  const [showSplippageContent, setShowSlippageContent] = useState(false);

  const ref = useRef();
  useOnClickOutside(ref, () => setShowSlippageContent(false));

  const [slp, setSlp] = useState(pact.slippage * 100);
  const [tl, setTl] = useState(pact.ttl / 60);
  useEffect(() => {
    if (slp) (async () => pact.storeSlippage(slp / 100))();
  }, [slp]);
  useEffect(() => {
    if (tl) (async () => pact.storeTtl(tl * 60))();
  }, [tl]);

  return (
    <Wrapper ref={ref} resolutionConfiguration={resolutionConfiguration}>
      <CogIcon onClick={() => setShowSlippageContent((prev) => !prev)} style={{ cursor: 'pointer' }} />
      {showSplippageContent && (
        <PopupContainer outOfGameEdition withGradient className={`background-fill ${className}`} style={{ width: 'unset', zIndex: 1 }}>
          <Container>
            <Label outGameEditionView fontSize={13} fontFamily="syncopate">
              Transactions Settings
            </Label>

            <Label outGameEditionView fontSize={13} labelStyle={{ marginTop: 16 }}>
              Slippage Tolerance
            </Label>

            <Row style={{ marginTop: 8 }}>
              <SlippageTolleranceValue isSelected={Number(slp) === 0.1} onClick={() => setSlp(0.1)}>
                0.1%
              </SlippageTolleranceValue>
              <SlippageTolleranceValue isSelected={Number(slp) === 0.5} style={{ marginLeft: 4, marginRight: 4 }} onClick={() => setSlp(0.5)}>
                0.5%
              </SlippageTolleranceValue>
              <SlippageTolleranceValue isSelected={Number(slp) === 1} style={{ marginRight: 8 }} onClick={() => setSlp(1)}>
                1%
              </SlippageTolleranceValue>

              <ContainerInputTypeNumber className="restrictedInput">
                <Input
                  noInputBackground
                  outGameEditionView
                  containerStyle={{
                    border: 'none ',
                    boxShadow: 'none !important',
                    padding: '0px',
                    margin: 0,
                  }}
                  placeholder={`${slp}`}
                  numberOnly
                  value={slp}
                  onChange={(e, { value }) => {
                    if (value >= 0 && value <= 100) {
                      setSlp(value);
                    }
                  }}
                />
                %
              </ContainerInputTypeNumber>
            </Row>

            <Label fontSize={13} outGameEditionView labelStyle={{ marginTop: 16 }}>
              Transaction Deadline
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
                  placeholder={`${tl}`}
                  numberOnly
                  value={tl}
                  onChange={(e, { value }) => {
                    if (value >= 0 && value <= 60) {
                      setTl(value);
                    }
                  }}
                />
              </ContainerInputTypeNumber>
              <Label fontSize={13} outGameEditionView labelStyle={{ marginLeft: 8 }}>
                minutes
              </Label>
            </Row>
          </Container>
        </PopupContainer>
      )}
    </Wrapper>
  );
};

export default SlippagePopupContent;
