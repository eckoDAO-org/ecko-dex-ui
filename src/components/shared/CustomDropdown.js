import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import styled from 'styled-components/macro';
import { ArrowDown } from '../../assets';
import Label from './Label';

const CustomDropdown = ({ title, options, onChange, value, placeholder, containerStyle, dropdownStyle }) => {
  return (
    <Container className="column" style={containerStyle}>
      {title && (
        <Label fontSize={12} labelStyle={{ marginBottom: '2px' }} fontFamily="syncopate">
          {title}
        </Label>
      )}
      <Dropdown
        placeholder={placeholder}
        fluid
        style={dropdownStyle}
        selection
        closeOnChange
        icon={<ArrowDown className="svg-app-color" />}
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
    min-width: 110px;
    align-items: center;
    background: ${({ theme: { backgroundContainer } }) => backgroundContainer};
    border-radius: 20px;
    padding-right: 10px;
    border: ${({ theme: { colors } }) => `1px solid ${colors.white}99`} !important;

    .arrow {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }

  .ui.selection.dropdown {
    color: ${({ theme: { colors } }) => colors.white};
  }
  .ui.dropdown .menu > .item {
    color: ${({ theme: { colors } }) => colors.white};
  }

  .ui.dropdown .menu .selected.item,
  .ui.dropdown.selected {
    //for selected item
  }

  .ui.selection.visible.dropdown > .text:not(.default) {
    color: ${({ theme: { colors } }) => colors.white};
  }
  .ui.selection.active.dropdown .menu {
    border-radius: 0px 0px 20px 20px;
  }

  .menu {
    border: ${({ theme: { colors } }) => `1px solid ${colors.white}99`} !important;
    background: ${({ theme: { backgroundContainer } }) => backgroundContainer} !important;
  }
`;
