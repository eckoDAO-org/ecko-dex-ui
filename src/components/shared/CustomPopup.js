import React from 'react';
import { Popup as SUIPopup } from 'semantic-ui-react';
import styled, { css } from 'styled-components/macro';
import { useApplicationContext } from '../../contexts';
import browserDetection from '../../utils/browserDetection';
import PopupLayout from './PopupLayout';

const Popup = styled(SUIPopup)`
  max-width: ${browserDetection() === 'SAFARI' && 'unset !important'};
`;

const PopupContainer = styled(({ ...rest }) => <PopupLayout {...rest} />)`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  border-radius: 10px;
  background: ${({ theme: { backgroundContainer } }) => backgroundContainer};

  backdrop-filter: blur(50px);
  opacity: 1;

  ${({ themeMode }) => {
    if ((browserDetection() === 'BRAVE' || browserDetection() === 'FIREFOX') && themeMode === 'dark') {
      return css`
        background: ${({ theme: { colors } }) => colors.primary};
      `;
    }
  }}

  i.inverted.icon {
    color: none;
  }
`;

const CustomPopup = ({ popupStyle, position, trigger, on, offset, children, containerStyle, hideGradient, ...props }) => {
  const { themeMode } = useApplicationContext();
  return (
    <Popup
      basic
      trigger={trigger}
      on={on}
      offset={offset}
      position={position}
      style={{
        ...popupStyle,
      }}
      {...props}
    >
      <PopupContainer style={containerStyle} themeMode={themeMode} hideGradient={hideGradient}>
        {children}
      </PopupContainer>
    </Popup>
  );
};

export default CustomPopup;
