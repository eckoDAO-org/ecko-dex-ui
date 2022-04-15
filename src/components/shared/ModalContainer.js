import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { ArrowBack, CloseIcon } from '../../assets';
import { GameEditionContext } from '../../contexts/GameEditionContext';

import Label from './Label';
import { FlexContainer } from './FlexContainer';

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

const Description = styled.span`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.basier};
  font-size: 16px;
  margin: 24px 0px;
`;

const ModalContainer = ({ title, description, containerStyle, titleStyle, descriptionStyle, children, onBack, onClose }) => {
  const { gameEditionView } = useContext(GameEditionContext);
  const containerRef = useRef(null);

  useEffect(() => {
    console.log('container', containerRef?.current?.clientHeight);
  }, []);

  return (
    <FlexContainer
      withGradient
      className="relative column justify-sb w-100 background-fill"
      style={{ padding: 32, maxHeight: '90%', overflowY: 'auto', ...containerStyle }}
    >
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

      {description && <Description style={descriptionStyle}>{description}</Description>}
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
