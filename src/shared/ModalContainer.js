import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import { ArrowBack, CloseIcon } from "../assets";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  padding: 20px 20px;
  width: 100%;
  border-radius: 10px;
  border: 2px solid #ffffff;
  box-shadow: 0 0 5px #ffffff;
  opacity: 1;
  background: #240b2f 0% 0% no-repeat padding-box;
  color: #ffffff;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 24px;
`;

const Title = styled.span`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  font-size: 24px;
  text-transform: capitalize;
  color: "white";
`;

const Description = styled.span`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.regular};
  font-size: 16px;
  margin-bottom: 24px;
`;

const ModalContainer = ({
  title,
  description,
  containerStyle,
  titleStyle,
  descriptionStyle,
  children,
  onBack,
  onClose,
}) => {
  return (
    <Container style={containerStyle}>
      <HeaderContainer>
        {onBack && (
          <ArrowBack
            style={{
              cursor: "pointer",
              color: "#FFFFFF 0% 0% no-repeat padding-box",
            }}
            onClick={onBack}
          />
        )}

        {title && <Title style={titleStyle}>{title}</Title>}

        {onClose && (
          <CloseIcon
            style={{
              cursor: "pointer",
              opacity: 1,
            }}
            onClick={onClose}
          />
        )}
      </HeaderContainer>

      {description && (
        <Description style={descriptionStyle}>{description}</Description>
      )}
      {children}
    </Container>
  );
};

ModalContainer.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
};

ModalContainer.defaultProps = {
  title: "",
  onClose: null,
};

export default ModalContainer;
