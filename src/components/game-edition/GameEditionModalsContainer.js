import React, { useContext } from 'react';
import styled from 'styled-components';
import { CloseGe } from '../../assets';
import { GameEditionContext } from '../../contexts/GameEditionContext';

const GEModalContainer = styled.div`
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(254, 251, 102, 1) 35%, rgba(255, 54, 208, 1) 100%);
  position: absolute;
  border-radius: 20px;
  display: flex;
  flex-flow: column;
  color: ${({ theme: { colors } }) => colors.black};
`;

const TitleContainer = styled.div`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.pressStartRegular};
  font-size: '16px';
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  width: 100%;
  position: absolute;
  top: 10px;
  padding: 10px;
  text-transform: capitalize;
`;

const DescriptionContainer = styled.div`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.pressStartRegular};
  font-size: '16px';
  display: flex;
  justify-content: flex-start;
  text-align: left;
  position: absolute;
  top: 60px;
  margin-bottom: 10px;
  width: 100%;
  padding: 10px;
`;
const ContentModalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 10px;
  width: 100%;
  height: 65%;
  position: absolute;
  top: 145px;
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
      <DescriptionContainer>{description}</DescriptionContainer>
      <ContentModalContainer>{content}</ContentModalContainer>
    </GEModalContainer>
  );
};

export default GameEditionModalsContainer;
