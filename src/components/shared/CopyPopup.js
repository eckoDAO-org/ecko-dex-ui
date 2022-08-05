import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import { useApplicationContext, useGameEditionContext } from '../../contexts';
import { theme } from '../../styles/theme';
import CustomPopup from './CustomPopup';
import Label from './Label';

const CopyPopup = ({ textToCopy, title, containerStyle, popupStyle, position = 'left center' }) => {
  const { themeMode } = useApplicationContext();
  const { gameEditionView } = useGameEditionContext();
  return (
    <CustomPopup
      containerStyle={
        gameEditionView
          ? { padding: 8, border: '2px dashed #ffffff', borderRadius: 0, backgroundColor: '#000000' }
          : {
              ...popupStyle,
              padding: 8,
            }
      }
      hideGradient={gameEditionView}
      on="click"
      position={position}
      trigger={
        <div
          style={{ marginRight: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', ...containerStyle }}
          onClick={() => {
            navigator.clipboard.writeText(textToCopy);
          }}
        >
          <Icon
            name="copy"
            style={{ color: gameEditionView ? '#fff' : theme(themeMode).colors.white, marginRight: 0 }}
            onClick={() => {
              navigator.clipboard.writeText(textToCopy);
            }}
          />
          {title && (
            <Label geFontSize={20} labelStyle={{ marginLeft: 8 }}>
              {title}
            </Label>
          )}
        </div>
      }
    >
      <Popup.Content
        style={{
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
