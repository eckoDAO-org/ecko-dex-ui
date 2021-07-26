import React from "react";
import styled from "styled-components";
import theme from "../styles/theme";

const Label = styled.span`
  color: #ffffff;
  text-transform: capitalize;
`;

const CustomLabel = ({ children, bold, fontSize, labelStyle }) => {
  return (
    <Label
      style={{
        fontFamily: bold ? theme.fontFamily.bold : theme.fontFamily.regular,
        fontSize: fontSize ? fontSize : 13,
        ...labelStyle,
      }}
    >
      {children}
    </Label>
  );
};

export default CustomLabel;
