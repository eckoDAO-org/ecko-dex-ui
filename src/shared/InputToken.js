import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import { ArrowDown } from "../assets";
import CustomButton from "./CustomButton";

const Container = styled.div`
  cursor: pointer;
  position: absolute;
  top: 13%;
  right: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: ${({ theme: { inputTokenWidth } }) => `${inputTokenWidth}px`};

  svg:first-child {
    margin-right: 8px;
  }

  span {
    font-size: 16px;
    margin-right: 13px;
    color: #fff;
  }
`;

const InputToken = ({ icon, code, onClick, disabled }) => {
  return (
    <Container onClick={onClick}>
      {icon}

      <span>{code}</span>
      <ArrowDown />
      <CustomButton
        buttonStyle={{
          padding: 12,
          marginLeft: 12,
        }}
        fontSize="8px"
        onClick={() => {}}
        disabled={disabled}
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
