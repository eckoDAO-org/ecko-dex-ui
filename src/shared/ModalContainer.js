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
    gameEditionView ? `2px dashed ${colors.black}` : ' 2px solid transparent'};
  background-clip: ${({ gameEditionView }) =>
    !gameEditionView && `padding-box`};
  opacity: 1;
  background: ${({ gameEditionView }) =>
    gameEditionView ? 'trasparent' : '#240b2f 0% 0% no-repeat padding-box'};
  background: ${({ gameEditionView }) =>
    gameEditionView
      ? `transparent`
      : `transparent linear-gradient(122deg, #070610 0%, #4c125a 100%) 0%
    0% no-repeat padding-box`};
  color: ${({ gameEditionView, theme: { colors } }) =>
    gameEditionView ? colors.black : ' #ffffff'};

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
      margin: -2px;
      border-radius: inherit;
      background: linear-gradient(to right, #ed1cb5, #ffa900, #39fffc);
    }`}

  ::-webkit-scrollbar {
    display: none;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Title = styled.span`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold};
  font-size: 24px;
  text-transform: capitalize;
  color: 'white';
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
}) => {
  const { gameEditionView } = useContext(GameEditionContext);

  console.log('withoutRainbowBackground', withoutRainbowBackground);
  return (
    <Container
      style={containerStyle}
      gameEditionView={gameEditionView}
      withoutRainbowBackground={withoutRainbowBackground}
    >
      <HeaderContainer>
        {onBack ? (
          <ArrowBack
            style={{
              cursor: 'pointer',
              color: '#FFFFFF 0% 0% no-repeat padding-box',
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

        {onClose && (
          <CloseIcon
            style={{
              cursor: 'pointer',
              opacity: 1,
            }}
            onClick={onClose}
          />
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
