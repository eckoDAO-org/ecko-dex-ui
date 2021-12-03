import React from 'react';
import { Popup as SUIPopup } from 'semantic-ui-react';
import styled, { css } from 'styled-components';
import { useGameEditionContext, useLightModeContext } from '../contexts';
import browserDetection from '../utils/browserDetection';
import GradientBorder from './GradientBorder';

const Popup = styled(SUIPopup)`
  & .ui.visible.popup {
  }
`;

const PopupContainer = styled.div`
  position: ${({ gameEditionView }) => !gameEditionView && `relative`};
  display: flex;
  align-items: center;
  flex-direction: column;

  width: 100%;
  border-radius: 10px;
  background: ${({ theme: { backgroundContainer } }) => backgroundContainer};

  backdrop-filter: blur(50px);
  opacity: 1;

  ${() => {
    if (browserDetection() === 'FIREFOX') {
      return css`
        margin: auto;
        background: #4c125a;
        box-sizing: border-box;
        background-clip: padding-box; /* !importanté */
        border: 1px solid transparent; /* !importanté */

        &:before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: -1;
          margin: -1px;
          border-radius: 10px;
          background: linear-gradient(to right, #ed1cb5, #ffa900, #39fffc);
        }
      `;
    }
  }}

  ${({ themeMode, gameEditionView }) => {
    if (browserDetection() === 'BRAVE' && themeMode === 'dark' && gameEditionView) {
      return css`
        background: #4c125a;
      `;
    }
  }}

  i.inverted.icon {
    color: none;
  }
`;

const CustomPopup = ({ popupStyle, position, trigger, on, offset, children, containerStyle, ...props }) => {
  const { themeMode } = useLightModeContext();
  const { gameEditionView } = useGameEditionContext();

  return (
    <Popup
      basic
      trigger={trigger}
      on={on}
      offset={offset}
      position={position}
      style={{
        padding: 0,
        // background: `${theme.colors.purple} 0% 0% no-repeat padding-box`,
        ...popupStyle,
      }}
      {...props}
    >
      <PopupContainer style={containerStyle} themeMode={themeMode} gameEditionView={gameEditionView}>
        <GradientBorder />
        {children}
      </PopupContainer>
    </Popup>
  );
};

export default CustomPopup;
