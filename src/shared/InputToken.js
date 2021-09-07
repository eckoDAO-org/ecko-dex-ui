import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import { ArrowDown } from "../assets";
import CustomButton from "./CustomButton";

const Container = styled.div`
  position: absolute;
  top: 13%;
  right: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: ${({ theme: { inputTokenWidth } }) => `${inputTokenWidth}px`};
`;

const ElementsContainer = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  svg:first-child {
    margin-right: 8px;
  }

  span {
    font-size: 16px;
    margin-right: 13px;
    color: #fff;
  }
`;

const InputToken = ({ icon, code, onClick, onClickButton, disabledButton }) => {
  return (
    <Container>
      <ElementsContainer onClick={onClick}>
        {icon}

        <span>{code}</span>
      </ElementsContainer>
      <ArrowDown />
      <CustomButton
        buttonStyle={{
          padding: 12,
          marginLeft: 12,
        }}
        fontSize="8px"
        onClick={onClickButton}
        disabled={disabledButton}
      >
        MAX
      </CustomButton>
    </Container>
  );
};

InputToken.propTypes = {
  icon: PropTypes.element,
  code: PropTypes.string,
};

InputToken.defaultProps = {
  icon: null,
  code: "",
};

export default InputToken;
