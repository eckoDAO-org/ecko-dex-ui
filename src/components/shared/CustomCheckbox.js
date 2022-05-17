import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import styled from 'styled-components';
import { FlexContainer } from './FlexContainer';
import Label from './Label';

const CheckboxContainer = styled(FlexContainer)`
  //check
  .ui.checkbox input:checked ~ .box:after,
  .ui.checkbox input:checked ~ label:after {
    color: ${({ theme: { colors } }) => colors.appColor};
  }

  // border
  .ui.checkbox label:before,
  .ui.checkbox input:checked ~ .box:before,
  .ui.checkbox input:checked ~ label:before {
    border-color: ${({ theme: { colors } }) => colors.white};
  }

  // active & focus
  .ui.checkbox input:focus ~ .box:before,
  .ui.checkbox input:focus ~ label:before,
  .ui.checkbox input:checked:focus ~ .box:before,
  .ui.checkbox input:checked:focus ~ label:before,
  .ui.checkbox input:not([type='radio']):indeterminate:focus ~ .box:before,
  .ui.checkbox input:not([type='radio']):indeterminate:focus ~ label:before {
    border-color: ${({ theme: { colors } }) => colors.white};
  }
`;

const CustomCheckbox = ({ children, onClick }) => {
  return (
    <CheckboxContainer>
      <Checkbox onClick={onClick} />
      <Label labelStyle={{ marginLeft: 8 }}>{children}</Label>
    </CheckboxContainer>
  );
};

export default CustomCheckbox;
