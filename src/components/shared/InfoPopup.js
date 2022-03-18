import React from 'react';
import { Icon } from 'semantic-ui-react';
import CustomPopup from './CustomPopup';
import Label from './Label';

const InfoPopup = ({ children }) => {
  return (
    <CustomPopup
      offset={[0, -5]}
      trigger={<Icon name="info circle" style={{ margin: ' 0px 0px 0px 4px', cursor: 'pointer' }} />}
      position="bottom center"
      on="click"
    >
      <Label>{children}</Label>
    </CustomPopup>
  );
};

export default InfoPopup;
