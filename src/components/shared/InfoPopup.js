import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useApplicationContext, useRightModalContext } from '../../contexts';
import { theme } from '../../styles/theme';
import CustomPopup from './CustomPopup';
import Label from './Label';

const InfoPopup = ({ centerIcon, title, children, type, size }) => {
  const { themeMode } = useApplicationContext();
  const rightModalContext = useRightModalContext();
  return type === 'modal' ? (
    <Icon
      size={size}
      name="info circle"
      style={{ marginLeft: 4, marginRight: 0, marginBottom: centerIcon ? 3 : 0, cursor: 'pointer', color: theme(themeMode).colors.white }}
      onClick={() => rightModalContext.openModal({ className: 'info-popup', title, content: children, contentStyle: { padding: 16, paddingTop: 0 } })}
    />
  ) : (
    <CustomPopup
      offset={[0, -5]}
      trigger={
        <Icon
          name="info circle"
          style={{ marginLeft: 4, marginRight: 0, marginBottom: centerIcon ? 3 : 0, cursor: 'pointer', color: theme(themeMode).colors.white }}
        />
      }
      position="bottom center"
      on="click"
    >
      <Label>{children}</Label>
    </CustomPopup>
  );
};

export default InfoPopup;
