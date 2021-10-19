import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { GameEditionContext } from '../contexts/GameEditionContext';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  padding: 20px 20px;
  width: 100%;
  border-radius: 10px;
  border: ${({ gameEditionView, theme: { colors } }) =>
    gameEditionView ? `2px dashed ${colors.black}` : ' 2px solid #ffffff'};
  box-shadow: ${({ gameEditionView, theme: { colors } }) =>
    gameEditionView ? `none` : ' 0 0 5px #ffffff'};
  opacity: 1;
  background: transparent;

  & > *:not(:last-child) {
    margin-bottom: 32px;
  }

  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  }
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex-flow: row;
  width: 100%;

  & > *:not(:last-child) {
    margin-right: 32px;
  }

  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
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

const Title = styled.span`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  font-size: 24px;
  text-transform: capitalize;
  color: #ffffff;
`;

const FormContainer = ({ containerStyle, title, titleStyle, children }) => {
  const { gameEditionView } = useContext(GameEditionContext);

  return (
    <Container gameEditionView={gameEditionView} style={containerStyle}>
      {title && (
        <HeaderContainer>
          <Title style={titleStyle}>{title}</Title>
        </HeaderContainer>
      )}
      <Content>{children}</Content>
    </Container>
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
