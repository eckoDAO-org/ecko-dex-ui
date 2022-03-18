import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import styled from 'styled-components/macro';
import { ArrowDown } from '../../assets';
import Label from './Label';

const CustomDropdown = ({ title, options, onChange, value, placeholder }) => {
  return (
    <Container className="column">
      {title && <Label fontSize={13}>{title}</Label>}
      <Dropdown
        placeholder={placeholder}
        fluid
        selection
        closeOnChange
        icon={<ArrowDown className="arrow" />}
        options={options}
        onChange={onChange}
        value={value}
      />
    </Container>
  );
};

export default CustomDropdown;

const Container = styled.div`
  .ui.dropdown {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: transparent;
    border-radius: 4px;
    padding-right: 10px;
    border: ${({ theme: { colors } }) => `1px solid ${colors.white}99`} !important;

    .arrow {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
  .ui.selection.visible.dropdown > .text:not(.default) {
    color: ${({ theme: { colors } }) => colors.white};
  }
  .ui.selection.dropdown .menu > .item {
    height: 40px;
    border-color: ${({ theme: { colors } }) => `${colors.white}99`};
  }

  .menu {
    border: ${({ theme: { colors } }) => `1px solid ${colors.white}99`} !important;

    background: ${({ theme: { backgroundContainer } }) => backgroundContainer} !important;
  }
`;
