import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import theme from '../../styles/theme';
import browserDetection from '../../utils/browserDetection';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  width: 100%;
  height: ${({ $gameEditionView }) => $gameEditionView && `100%`};
  border-radius: 10px;
  border: ${({ $gameEditionView, withGameEditionBorder, theme: { colors } }) =>
    $gameEditionView && withGameEditionBorder && `2px dashed ${colors.black}`};

  opacity: 1;
  background: ${({ $gameEditionView, theme: { backgroundContainer } }) => ($gameEditionView ? 'transparent' : backgroundContainer)};
  backdrop-filter: ${({ $gameEditionView }) => !$gameEditionView && `blur(50px)`};
  padding: ${({ $gameEditionView }) => ($gameEditionView ? `0px 10px 10px` : `32px 32px`)};
  /* & > *:not(:last-child) {
    margin-bottom: 32px;
  }
 */
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  }
`;

const Content = styled.div`
  /* position: relative;
  display: flex;
  flex-flow: column;
  width: 100%;  */

  height: ${({ gameEditionView }) => !gameEditionView && `100%`};

  /* & > *:not(:last-child) {
    margin-right: 32px;
  } */

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
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  font-size: 24px;
  text-transform: capitalize;
  color: ${theme.colors.white};
`;

const FormContainer = ({ id, containerStyle, title, titleStyle, children, footer, withGameEditionBorder }) => {
  const { gameEditionView } = useContext(GameEditionContext);

  return (
    <Container $gameEditionView={gameEditionView} style={containerStyle} withGameEditionBorder={withGameEditionBorder}>
      <>
        {title && (
          <HeaderContainer>
            <Title style={titleStyle}>{title}</Title>
          </HeaderContainer>
        )}
        <Content id="form-container-content">{children}</Content>
      </>
      {footer && <FooterContainer>{footer}</FooterContainer>}
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
