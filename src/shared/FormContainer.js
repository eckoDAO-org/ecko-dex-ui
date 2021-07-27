import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  gap: 32px;
  padding: 20px 20px;
  width: 100%;
  border-radius: 10px;
  border: 2px solid #ffffff;
  box-shadow: 0 0 5px #ffffff;
  opacity: 1;
  background: transparent;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  }
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex-flow: row;
  gap: 32px;
  width: 100%;
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
  return (
    <Container style={containerStyle}>
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
  title: "",
  onClose: null,
};

export default FormContainer;
