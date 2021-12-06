import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';
import { ArrowBack, CloseIcon } from '../assets';
import { GameEditionContext } from '../contexts/GameEditionContext';
import GradientBorder from './GradientBorder';
import browserDetection from '../utils/browserDetection';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  padding: ${({ gameEditionView }) => (gameEditionView ? '16px' : '32px')};
  width: 100%;
  min-width: 550px;
  border-radius: 10px;
  border: ${({ gameEditionView, theme: { colors } }) => gameEditionView && `2px dashed ${colors.black}`};
  background-clip: ${({ gameEditionView }) => !gameEditionView && `padding-box`};
  opacity: 1;
  background: ${({ gameEditionView, theme: { backgroundContainer }, backgroundNotChangebleWithTheme }) =>
    backgroundNotChangebleWithTheme || gameEditionView ? 'transparent' : backgroundContainer};
  backdrop-filter: ${({ gameEditionView, withoutRainbowBackground }) => !gameEditionView && !withoutRainbowBackground && `blur(50px)`};
  color: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? colors.black : colors.white)};

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    min-width: 50px;
  }
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }

  ${({ withoutRainbowBackground }) => {
    if (browserDetection() === 'FIREFOX' && !withoutRainbowBackground) {
      return css`
        margin: auto;
        background: #4c125a;
        box-sizing: border-box;
        background-clip: padding-box; /* !importanté */
        border: 1px solid transparent; /* !importanté */

        &:before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: -1;
          margin: -1px;
          border-radius: 10px;
          background: linear-gradient(to right, #ed1cb5, #ffa900, #39fffc);
        }
      `;
    }
  }}
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  /* margin-bottom: ${({ gameEditionView }) => !gameEditionView && '12px'}; */
  align-items: center;
  width: 100%;

  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const Title = styled.span`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) => (gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold)};

  font-size: 24px;

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobileSmallPixel}px`}) {
    width: min-content;
    font-size: 16px;
  }
  text-transform: capitalize;
  white-space: nowrap;
  ${({ theme: { colors } }) => colors.white};
`;

const Description = styled.span`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.regular};
  font-size: 16px;
  margin: 24px 0px;
`;

const ModalContainer = ({
  title,
  description,
  containerStyle,
  titleStyle,
  descriptionStyle,
  children,
  onBack,
  onClose,
  withoutRainbowBackground = false,
  backgroundNotChangebleWithTheme,
}) => {
  const { gameEditionView } = useContext(GameEditionContext);

  return (
    <Container
      style={containerStyle}
      gameEditionView={gameEditionView}
      withoutRainbowBackground={withoutRainbowBackground}
      backgroundNotChangebleWithTheme={backgroundNotChangebleWithTheme}
    >
      {!gameEditionView && !withoutRainbowBackground && <GradientBorder />}
      <HeaderContainer style={{ justifyContent: !onBack && !onClose && 'center' }}>
        {onBack ? (
          <ArrowBack
            style={{
              cursor: 'pointer',
            }}
            onClick={onBack}
          />
        ) : (
          <></>
        )}

        {title && (
          <Title style={titleStyle} gameEditionView={gameEditionView}>
            {title}
          </Title>
        )}

        {onClose ? (
          <CloseIcon
            style={{
              cursor: 'pointer',
              opacity: 1,
            }}
            onClick={onClose}
          />
        ) : (
          <div></div>
        )}
      </HeaderContainer>

      {description && <Description style={descriptionStyle}>{description}</Description>}
      {children}
    </Container>
  );
};

ModalContainer.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
};

ModalContainer.defaultProps = {
  title: '',
  onClose: null,
};

export default ModalContainer;
