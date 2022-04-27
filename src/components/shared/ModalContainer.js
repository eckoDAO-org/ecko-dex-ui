import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { ArrowBack, CloseIcon } from '../../assets';
import Label from './Label';
import { FlexContainer } from './FlexContainer';
import { useGameEditionContext } from '../../contexts';

const HeaderContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  /* margin-bottom: ${({ gameEditionView }) => !gameEditionView && '12px'}; */
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const ModalContainer = ({ title, description, containerStyle, titleStyle, descriptionStyle, children, onBack, onClose }) => {
  const { gameEditionView } = useContext(GameEditionContext);

  return (
    <FlexContainer
      withGradient
      className="relative column justify-sb w-100 background-fill"
      style={{ padding: 32, maxHeight: '90%', overflowY: 'auto', ...containerStyle }}
    >
      <HeaderContainer style={{ justifyContent: !onBack && !onClose && 'center' }}>
        {onBack && (
          <ArrowBack
            style={{
              cursor: 'pointer',
            }}
            onClick={onBack}
          />
        )}

        {title && (
          <Label
            fontFamily="syncopate"
            className="capitalize"
            fontSize={24}
            labelStyle={{ marginRight: 25, ...titleStyle }}
            gameEditionView={gameEditionView}
          >
            {title}
          </Label>
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
        <Label fontSize={16} outGameEditionView labelStyle={{ margin: '16px 0', ...descriptionStyle }}>
          {description}
        </Label>
      )}
      {children}
    </FlexContainer>
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
