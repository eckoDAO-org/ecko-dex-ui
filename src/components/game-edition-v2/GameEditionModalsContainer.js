import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { CloseGe } from '../../assets';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { FadeIn } from '../shared/animations';
import modalBackground from '../../assets/images/game-edition/modal-background.png';

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
`;

const TitleContainer = styled.div`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.pressStartRegular};
  font-size: '16px';
  display: flex;
  justify-content: space-between;

  width: 100%;
  padding: 10px;
  text-transform: capitalize;
`;

const DescriptionContainer = styled.div`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.pressStartRegular};
  font-size: '16px';
  display: flex;
  justify-content: flex-start;
  text-align: left;
  margin-bottom: 10px;
  width: 100%;
  padding: 10px;
`;
const ContentModalContainer = styled.div`
  display: flex;
  @media (min-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel}px`}) {
    justify-content: space-between;
  }
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
    & > *:not(:last-child) {
      margin-bottom: 16px;
    }
  }
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 10px;
`;

const GameEditionModalsContainer = ({ title, description, content, onClose, modalStyle }) => {
  const { closeModal } = useContext(GameEditionContext);
  return (
    <GEModalContainer style={modalStyle}>
      <TitleContainer>
        {title}
        <CloseGe
          style={{ cursor: 'pointer' }}
          onClick={() => {
            if (onClose) {
              onClose();
            } else {
              closeModal();
            }
          }}
        />
      </TitleContainer>
      {description && <DescriptionContainer>{description}</DescriptionContainer>}
      <ContentModalContainer>{content}</ContentModalContainer>
    </GEModalContainer>
  );
};

export default GameEditionModalsContainer;
