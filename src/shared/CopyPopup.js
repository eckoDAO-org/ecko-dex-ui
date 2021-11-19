import React, { useContext } from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import { LightModeContext } from '../contexts/LightModeContext';
import { theme } from '../styles/theme';
import CustomPopup from './CustomPopup';

const CopyPopup = ({ textToCopy }) => {
  const { themeMode } = useContext(LightModeContext);
  return (
    <CustomPopup
      on='click'
      position='bottom right'
      pinned
      trigger={
        <Icon
          name='copy'
          style={{ marginLeft: '8px' }}
          onClick={() => {
            navigator.clipboard.writeText(textToCopy);
          }}
        />
      }
    >
      <Popup.Content
        style={{
          padding: '8px',
          color: theme(themeMode).colors.white,
        }}
      >
        Copied!
      </Popup.Content>
    </CustomPopup>
  );
};

export default CopyPopup;
