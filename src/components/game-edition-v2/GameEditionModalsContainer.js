/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import { CloseGe } from '../../assets';
import { FadeIn } from '../shared/animations';
import modalBackground from '../../assets/images/game-edition/modal-background.png';
import arcadeBackground from '../../assets/images/game-edition/arcade-background.png';
import arcadeDarkBackground from '../../assets/images/game-edition/arcade-dark-background.png';
import GameEditionLabel from './components/GameEditionLabel';
import useButtonScrollEvent from '../../hooks/useButtonScrollEvent';
import useLazyImage from '../../hooks/useLazyImage';
import { GameEditionLoader } from '../shared/Loader';
import { useGameEditionContext } from '../../contexts';

const getBackground = (type) => {
  switch (type) {
    case 'arcade':
      return arcadeBackground;
    case 'arcade-dark':
      return arcadeDarkBackground;
    default:
      return modalBackground;
  }
};

const GEModalContainer = styled(FadeIn)`
  z-index: 20;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 19px;
  background-image: ${({ type }) => `url(${getBackground(type)})`};
  position: absolute;
  display: flex;
  justify-content: center;
  flex-flow: column;
  color: ${({ theme: { colors } }) => colors.white};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding: 16px;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

const TitleContainer = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  text-transform: capitalize;
`;

const ContentModalContainer = styled.div`
  display: flex;

  & > *:not(:last-child) {
    margin-bottom: 16px;
  }

  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const GameEditionModalsContainer = ({
  title,
  description,
  content,
  hideOnClose,
  onClose,
  containerStyle,
  titleContainerStyle,
  titleFontSize = 52,
  type,
}) => {
  const { closeModal, buttons, setButtons, showTokens } = useGameEditionContext();

  useButtonScrollEvent('game-edition-modal-container');

  useEffect(() => {
    const oldButtons = buttons;

    return () => {
      setButtons({ ...oldButtons });
    };
  }, []);

  const [modalLoaded] = useLazyImage([arcadeBackground, arcadeDarkBackground, modalBackground]);

  return (
    <GEModalContainer type={type} style={containerStyle} id="game-edition-modal-container">
      {!modalLoaded ? (
        <GameEditionLoader />
      ) : (
        <>
          <TitleContainer style={titleContainerStyle}>
            <GameEditionLabel fontSize={titleFontSize} style={{ textAlign: 'center', flex: 1, display: 'block' }}>
              {title}
            </GameEditionLabel>
            {!hideOnClose && (
              <CloseGe
                style={{ cursor: showTokens ? 'default' : 'pointer', position: 'absolute', right: 20, top: '62%', transform: 'translate(0px, -62%)' }}
                onClick={() => {
                  if (!showTokens) {
                    if (onClose) {
                      onClose();
                    }
                    closeModal();
                  }
                }}
              />
            )}
          </TitleContainer>
          {description && <GameEditionLabel fontSize={20}>{description}</GameEditionLabel>}
          <ContentModalContainer>{content}</ContentModalContainer>
        </>
      )}
    </GEModalContainer>
  );
};

export default GameEditionModalsContainer;

GameEditionModalsContainer.propTypes = {
  titleFontSize: PropTypes.number,
  type: PropTypes.oneOf(['modal', 'arcade', 'arcade-dark']),
};

GameEditionModalsContainer.defaultProps = {
  titleFontSize: 52,
  type: 'modal',
};
