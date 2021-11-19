import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { ArrowBack, CloseIcon } from '../assets';
import { GameEditionContext } from '../contexts/GameEditionContext';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  padding: 20px 20px;
  width: 100%;
  border-radius: 10px;
  border: ${({ gameEditionView, theme: { colors } }) =>
    gameEditionView ? `2px dashed ${colors.black}` : `2px solid transparent`};
  background-clip: ${({ gameEditionView }) =>
    !gameEditionView && `padding-box`};
  opacity: 1;
  background: ${({
    theme: { backgroundContainer },
    backgroundNotChangebleWithTheme,
  }) =>
    backgroundNotChangebleWithTheme ? 'transparent' : backgroundContainer};
  backdrop-filter: ${({ gameEditionView }) => !gameEditionView && `blur(50px)`};
  color: ${({ gameEditionView, theme: { colors } }) =>
    gameEditionView ? colors.black : colors.white};

  ${({ withoutRainbowBackground, gameEditionView }) =>
    !withoutRainbowBackground &&
    !gameEditionView &&
    `::before {
      content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1000;
    margin: -1px;
    border-radius: 10px;
    border-left: 1px solid #ed1cb5;
    border-right: 1px solid #39fffc;
    background-image: linear-gradient(to right, #ed1cb5, #ffa900, #39fffc),
      linear-gradient(to right, #ed1cb5, #ffa900, #39fffc);
    /* background: ${({ gameEditionView }) =>
      !gameEditionView &&
      'linear-gradient(to right, #ed1cb5, #ffa900, #39fffc)'}; */
    background-position: 0 0, 0 100%;
    background-size: 100% 1px;
    background-repeat: no-repeat;
    }`}

  ::-webkit-scrollbar {
    display: none;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  margin-bottom: ${({ gameEditionView }) => !gameEditionView && '12px'};
  align-items: center;
  width: 100%;

  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const Title = styled.span`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold};

  font-size: 24px;

  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobileSmallPixel}px`}) {
    width: min-content;
    font-size: 16px;
  }
  text-transform: capitalize;
  ${({ theme: { colors } }) => colors.white};
`;

const Description = styled.span`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.regular};
  font-size: 16px;
  margin-bottom: 24px;
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
      <HeaderContainer>
        {onBack ? (
          <ArrowBack
            style={{
              cursor: 'pointer',
              // color: `${theme().colors.white} 0% 0% no-repeat padding-box`,
            }}
            onClick={onBack}
          />
        ) : (
          <div></div>
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

      {description && (
        <Description style={descriptionStyle}>{description}</Description>
      )}
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
