import React from 'react';
import { Popup as SUIPopup } from 'semantic-ui-react';
import styled from 'styled-components';
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
  /* border: ${({ gameEditionView }) =>
    gameEditionView ? `none` : ` 1px solid transparent`}; */

  backdrop-filter: ${({ gameEditionView }) => !gameEditionView && `blur(50px)`};
  opacity: 1;
  background: ${({ theme: { backgroundContainer } }) => backgroundContainer};

  i.inverted.icon {
    color: none;
  }
`;

const CustomPopup = ({
  popupStyle,
  position,
  trigger,
  on,
  offset,
  children,
  containerStyle,
  ...props
}) => {
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
      <PopupContainer style={containerStyle}>
        <GradientBorder />
        {children}
      </PopupContainer>
    </Popup>
  );
};

export default CustomPopup;
