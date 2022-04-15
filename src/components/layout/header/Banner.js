import React from 'react';
import styled from 'styled-components';
import { AlertIcon } from '../../../assets';
import Label from '../../shared/Label';

const STYBannerContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  position: sticky;
  top: 0;
  width: auto;
  justify-content: center;
  background-color: ${({ theme: { colors } }) => colors.white};
  border-radius: 10px;
  margin: ${({ theme: { layout } }) => `0 ${layout.desktopPadding}px`};
  margin-top: 16px;
  padding: 8px;
  svg {
    margin-right: 8px;
    path {
      fill: ${({ theme: { colors } }) => colors.primary};
    }
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel - 1}px`}) {
    margin: ${({ theme: { layout } }) => `0 ${layout.mobilePadding}px`};
    margin-top: 0px;
    padding: 16px;
    text-align: center;
    flex-direction: column;
    svg {
      margin-bottom: 8px;
      margin-right: 0px;
    }
  }
`;

const Banner = () => {
  return (
    <STYBannerContainer>
      <AlertIcon className="mobile-none" />
      <Label inverted fontSize={13} labelStyle={{ display: 'inline-block' }}>
        When using Kaddex, first, make sure to have your Kadena native assets on chain 2.
      </Label>
    </STYBannerContainer>
  );
};

export default Banner;
