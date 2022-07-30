import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import styled from 'styled-components/macro';
import { useApplicationContext } from '../../contexts';
import Label from './Label';

const ToggleContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  color: ${({ theme: { colors } }) => colors.white};
  justify-content: center;
  flex-direction: row;
  border-radius: 20px;
  font-family: ${({ theme: { fontFamily } }) => `${fontFamily.syncopate}`};

  .ui.checkbox {
    margin-bottom: 4px;
  }

  .ui.toggle.checkbox .box:before,
  .ui.toggle.checkbox label:before,
  .ui.toggle.checkbox input:checked ~ .box:before,
  .ui.toggle.checkbox input:checked ~ label:before {
    background-color: ${({ theme: { colors } }) => colors.white} !important;
    height: 1.8em;
  }

  .ui.toggle.checkbox .box:after,
  .ui.toggle.checkbox label:after {
    background: ${({ theme: { colors } }) => colors.primary} 0% 0% no-repeat padding-box !important;
    box-shadow: inset 2px 5px 9px ${({ theme: { colors } }) => colors.primary}29 !important;
  }

  .ui.toggle.checkbox input ~ .box:after,
  .ui.toggle.checkbox input ~ label:after {
    top: 0.15rem;
    left: 0.2rem;
  }

  .ui.toggle.checkbox input:checked ~ .box:after,
  .ui.toggle.checkbox input:checked ~ label:after {
    left: 1.8rem;
  }
`;

const LightModeToggle = ({ animation, style }) => {
  const { themeMode, themeToggler } = useApplicationContext();

  const getModeLabel = () => {
    return themeMode === 'light' ? 'dark' : 'light';
  };
  return (
    <ToggleContainer animation={animation} style={style}>
      <Label className="capitalize" labelStyle={{ marginRight: 8 }} outGameEditionView>{`${getModeLabel()}`}</Label>
      <Checkbox
        toggle
        onChange={() => {
          themeToggler();
        }}
      />
    </ToggleContainer>
  );
};

export default LightModeToggle;
