import React, { useContext } from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import { LightModeContext } from '../../contexts/LightModeContext';
import { theme } from '../../styles/theme';
import CustomPopup from './CustomPopup';
import Label from './Label';

const CopyPopup = ({ textToCopy, title, containerStyle }) => {
  const { themeMode } = useContext(LightModeContext);

  return (
    <CustomPopup
      on="click"
      position="bottom right"
      pinned
      trigger={
        <div
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', ...containerStyle }}
          onClick={() => {
            navigator.clipboard.writeText(textToCopy);
          }}
        >
          <Icon
            name="copy"
            style={{ marginLeft: '8px' }}
            onClick={() => {
              navigator.clipboard.writeText(textToCopy);
            }}
          />
          {title && <Label geFontSize={20}>{title}</Label>}
        </div>
      }
    >
      <Popup.Content
        style={{
          padding: '8px',
          color: theme(themeMode).colors.white,
        }}
      >
        <Label fontSize={14} geFontSize={18}>
          Copied!
        </Label>
      </Popup.Content>
    </CustomPopup>
  );
};

export default CopyPopup;
