import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import theme from '../../styles/theme';
import browserDetection from '../../utils/browserDetection';
import { FlexContainer } from './FlexContainer';

const Content = styled.div`
  height: ${({ gameEditionView }) => !gameEditionView && `100%`};

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
    gap: 0px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  width: 100%;
`;

const FooterContainer = styled.div`
  display: flex;
  width: 100%;
  flex: ${browserDetection() !== 'SAFARI' && 1};
  display: flex;
  align-items: ${browserDetection() !== 'SAFARI' && 'end'};
`;

const Title = styled.span`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.syncopate};
  font-size: 24px;
  text-transform: capitalize;
  color: ${theme.colors.white};
`;

const FormContainer = ({ containerStyle, title, titleStyle, children, footer, withGameEditionBorder }) => {
  return (
    <FlexContainer
      withGradient
      className="relative column justify-sb w-100 background-fill"
      gameEditionClassName="relative column justify-sb w-100 h-100"
      style={{ padding: 24, ...containerStyle }}
    >
      <>
        {title && (
          <HeaderContainer>
            <Title style={titleStyle}>{title}</Title>
          </HeaderContainer>
        )}
        <Content id="form-container-content">{children}</Content>
        {footer && <FooterContainer>{footer}</FooterContainer>}
      </>
    </FlexContainer>
  );
};

FormContainer.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
};

FormContainer.defaultProps = {
  title: '',
  onClose: null,
};

export default FormContainer;
