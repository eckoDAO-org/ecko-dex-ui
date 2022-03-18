import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useApplicationContext } from '../../contexts';
import { theme } from '../../styles/theme';
import CustomPopup from './CustomPopup';
import Label from './Label';

const InfoPopup = ({ children }) => {
  const { themeMode } = useApplicationContext();
  return (
    <CustomPopup
      offset={[0, -5]}
      trigger={<Icon name="info circle" style={{ margin: ' 0px 0px 0px 4px', cursor: 'pointer', color: theme(themeMode).colors.white }} />}
      position="bottom center"
      on="click"
    >
      <Label>{children}</Label>
    </CustomPopup>
  );
};

export default InfoPopup;
