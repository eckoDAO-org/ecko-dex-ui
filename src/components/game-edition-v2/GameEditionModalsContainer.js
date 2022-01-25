import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { CloseGe } from '../../assets';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { FadeIn } from '../shared/animations';
import modalBackground from '../../assets/images/game-edition/modal-background.png';
import GameEditionLabel from './components/GameEditionLabel';
import useButtonScrollEvent from '../../hooks/useButtonScrollEvent';

const GEModalContainer = styled(FadeIn)`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 19px;
  background-image: url(${modalBackground});
  position: absolute;
  display: flex;
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

const GameEditionModalsContainer = ({ title, description, content, hideOnClose, onClose, modalStyle, titleFontSize = 52 }) => {
  const { closeModal } = useContext(GameEditionContext);

  useButtonScrollEvent('game-edition-modal-container');
  return (
    <GEModalContainer style={modalStyle} id="game-edition-modal-container">
      <TitleContainer>
        <GameEditionLabel fontSize={titleFontSize} style={{ textAlign: 'center', flex: 1, display: 'block' }}>
          {title}
        </GameEditionLabel>
        {!hideOnClose && (
          <CloseGe
            style={{ cursor: 'pointer', position: 'absolute', right: 20, top: '50%', transform: 'translate(0px, -50%)' }}
            onClick={() => {
              if (onClose) {
                onClose();
              }
              closeModal();
            }}
          />
        )}
      </TitleContainer>
      {description && <GameEditionLabel fontSize={20}>{description}</GameEditionLabel>}
      <ContentModalContainer>{content}</ContentModalContainer>
    </GEModalContainer>
  );
};

export default GameEditionModalsContainer;
