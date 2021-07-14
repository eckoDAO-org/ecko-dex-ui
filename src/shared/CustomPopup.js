import React from "react";
import { Popup } from "semantic-ui-react";
import theme from "../styles/theme";

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
        padding: "13px 13px 4px 13px",
        background: `${theme.colors.purple} 0% 0% no-repeat padding-box`,
        border: "2px solid #FFFFFF",
        boxShadow: "0 0 5px #FFFFFF",
        ...popupStyle,
      }}
      {...props}
    >
      {children}
    </Popup>
  );
};

export default CustomPopup;
