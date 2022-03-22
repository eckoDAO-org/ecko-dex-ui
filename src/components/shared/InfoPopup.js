import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useApplicationContext, useRightModalContext } from '../../contexts';
import { theme } from '../../styles/theme';
import CustomPopup from './CustomPopup';
import Label from './Label';

const InfoPopup = ({ title, children, type }) => {
  const { themeMode } = useApplicationContext();
  const rightModalContext = useRightModalContext();
  return type === 'modal' ? (
    <Icon
      name="info circle"
      style={{ margin: ' 0px 0px 0px 4px', cursor: 'pointer', color: theme(themeMode).colors.white }}
      onClick={() => rightModalContext.openModal({ title, content: children, contentStyle: { padding: 16 } })}
    />
  ) : (
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
