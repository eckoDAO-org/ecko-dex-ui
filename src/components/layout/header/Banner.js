import React from 'react';
import styled from 'styled-components';
import { AlertIcon } from '../../../assets';
import theme from '../../../styles/theme';
import { FlexContainer } from '../../shared/FlexContainer';
import Label from '../../shared/Label';

const STYBannerContainer = styled(FlexContainer)`
  display: flex;
  align-items: center;
  width: 100%;
  position: ${({ position }) => position || 'sticky'};
  top: 0;
  width: auto;
  justify-content: center;
  background-color: ${({ theme: { colors } }) => colors.white};
  border-radius: 10px;
  margin: ${({ theme: { layout } }) => `0 ${layout.desktopPadding}px`};
  padding: 8px;
  svg {
    margin-right: 8px;
    path {
      fill: ${({ theme: { colors } }) => colors.primary};
    }
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel - 1}px`}) {
    padding: 16px;
    text-align: center;
    flex-direction: column;
    svg {
      margin-bottom: 8px;
      margin-right: 0px;
    }
  }
`;

const Banner = ({ text, position }) => {
  return (
    <STYBannerContainer
      desktopStyle={{ margin: `16px ${theme.layout.desktopPadding}px 0px` }}
      tabletStyle={{ margin: `16px ${theme.layout.tabletPadding}px 0px` }}
      mobileStyle={{ margin: `16px ${theme.layout.mobilePadding}px 0px` }}
      position={position}
    >
      <AlertIcon className="mobile-none" />
      <Label inverted fontSize={13} labelStyle={{ display: 'inline-block' }}>
        {text || 'Welcome to our devnet environment, first, make sure to have devnet network information added to eckoWALLET, and funds on chain 0.'}
      </Label>
    </STYBannerContainer>
  );
};

export default Banner;
