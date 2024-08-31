import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';
import { ArrowDown, PixeledArrowDownIcon, UnknownLogo } from '../../assets';
import CustomButton from './CustomButton';
import Label from './Label';
import { useApplicationContext, useGameEditionContext, usePactContext } from '../../contexts';
import { theme, commonColors } from '../../styles/theme';
import {DEFAULT_ICON_URL} from '../../constants/cryptoCurrencies';

const Container = styled.div`
  ${({ $gameEditionView, coin }) => {
    if ($gameEditionView) {
      return css`
        position: absolute;
        right: 20px;
        top: ${({ coin }) => (coin ? 9 : 4)}px;
      `;
    }
  }}
  display: flex;
  align-items: center;
  cursor: pointer;

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
    top: ${({ $gameEditionView }) => $gameEditionView && '0px'};
  }
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobileSmallPixel}px`}) {
    button {
      padding: 12px 4px !important;
    }
  }
`;

const ElementsContainer = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .dropdown {
    margin-left: 8px;
    margin-right: 0px;
    width: 13px !important;
    path {
      fill: ${({ $gameEditionView, theme: { colors }, geColor }) => {
        if ($gameEditionView && geColor) return `${geColor} !important`;
        if (!$gameEditionView) return `${colors.white} !important`;
      }};
    }
  }

  svg {
    width: ${({ size = 20 }) => `${size}px`};
    height: ${({ size = 20 }) => `${size}px`};
    margin: 0px 8px 0px 0px;
    path {
      fill: ${({ commonColors }) => commonColors.appColor}!important;
    }
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobileSmallPixel}px`}) {
    img {
      margin-right: 0px !important;
    }
    span {
      margin-right: 4px;
    }
  }
`;

const InputToken = ({ values, disabledButton, onClick, onMaxClickButton, geColor, withoutMAX }) => {
  const { gameEditionView } = useGameEditionContext();
  const { themeMode } = useApplicationContext();
  const { allTokens } = usePactContext();

  const getTokenData = (tokenIdentifier) => {
    return Object.values(allTokens).find(
      token => token.code === tokenIdentifier || token.name === tokenIdentifier
    );
  };

  const tokenData = getTokenData(values.coin || values.address);
  return (
    <Container $gameEditionView={gameEditionView} geColor={geColor} coin={values?.coin}>
      {values?.coin ? (
        <>
          {!gameEditionView && !withoutMAX && (
            <CustomButton
              buttonStyle={{
                padding: '12px 8px',
              }}
              fontFamily="basier"
              labelStyle={{ textTransform: 'uppercase' }}
              type="basic"
              fontSize={13}
              onClick={onMaxClickButton}
              disabled={disabledButton}
            >
              Max
            </CustomButton>
          )}
          <ElementsContainer
            commonColors={commonColors}
            $gameEditionView={gameEditionView}
            geColor={geColor}
            onClick={onClick}
            style={{
              background: !gameEditionView && `${theme(themeMode).colors.white}33`,
              borderRadius: !gameEditionView && '20px',
              padding: !gameEditionView && '4px 8px',
            }}
          >
            {tokenData?.icon ? (
              <img
                alt={`${tokenData.name} icon`}
                src={tokenData.icon}
                style={{ width: 20, height: 20, marginRight: '8px' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_ICON_URL; 
                }}
              />
            ) : (
              <UnknownLogo className="cmm" />
            )}
            <Label geFontSize={24} geColor={geColor} style={{ opacity: 1 }}>
              {tokenData?.name || 'Unknown'}
            </Label>
            {gameEditionView ? (
              <PixeledArrowDownIcon className="dropdown" geColor={geColor} />
            ) : (
              <ArrowDown className="dropdown" style={{ opacity: 1 }} />
            )}
          </ElementsContainer>
        </>
      ) : (
        <>
          <CustomButton
            type="basic"
            geBasic
            fontFamily="basier"
            geColor={geColor}
            onClick={onClick}
            geFontSize={24}
            buttonStyle={{
              background: !gameEditionView && `${theme(themeMode).colors.white}33`,
              borderRadius: !gameEditionView && '20px',
              padding: !gameEditionView && '4px 8px',
              marginRight: 0,
              height: !gameEditionView && '28px',
            }}
          >
            <Label geColor={geColor} fontSize={13}>
              Select
            </Label>
            {gameEditionView ? (
              <PixeledArrowDownIcon style={{ marginLeft: 8, marginRight: 0 }} />
            ) : (
              <ArrowDown style={{ marginRight: 0, marginLeft: 8 }} />
            )}
          </CustomButton>
        </>
      )}
    </Container>
  );
};

InputToken.propTypes = {
  icon: PropTypes.element,
  code: PropTypes.string,
};

InputToken.defaultProps = {
  icon: null,
  code: '',
};

export default InputToken;
