import React from 'react';
import { Popup as SUIPopup } from 'semantic-ui-react';
import styled from 'styled-components';

const Popup = styled(SUIPopup)`
  & .ui.visible.popup {
  }
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
        padding: '13px 13px 4px 13px',
        // background: `${theme.colors.purple} 0% 0% no-repeat padding-box`,
        ...popupStyle,
      }}
      {...props}
    >
      {children}
    </Popup>
  );
};

export default CustomPopup;
