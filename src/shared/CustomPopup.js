import React from 'react';
import { Popup as SUIPopup } from 'semantic-ui-react';
import styled from 'styled-components';

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
  border: ${({ gameEditionView }) =>
    gameEditionView ? `none` : ` 1px solid transparent`};

  backdrop-filter: ${({ gameEditionView }) => !gameEditionView && `blur(50px)`};
  opacity: 1;
  background: transparent;
`;

const Gradient = styled.div`
  border-radius: 10px; /*1*/
  border: 1px solid transparent; /*2*/
  background: linear-gradient(90deg, #ed1cb5, #ffa900, #39fffc) border-box; /*3*/
  -webkit-mask: /*4*/ linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out; /*5'*/
  mask-composite: exclude; /*5*/
  position: absolute;
  top: -2px;
  left: -2px;
  /* right: -10px;
  bottom: -10px; */
  width: calc(100% + 4px);
  height: calc(100% + 3px);
`;

const CustomPopup = ({
  popupStyle,
  position,
  trigger,
  on,
  offset,
  children,
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
      <PopupContainer>
        <Gradient />
        {children}
      </PopupContainer>
    </Popup>
  );
};

export default CustomPopup;
