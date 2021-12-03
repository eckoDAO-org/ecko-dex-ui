import React, { useContext } from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import { GameEditionContext } from '../contexts/GameEditionContext';
import { LightModeContext } from '../contexts/LightModeContext';
import { theme } from '../styles/theme';
import CustomPopup from './CustomPopup';

const CopyPopup = ({ textToCopy, title, containerStyle }) => {
  const { themeMode } = useContext(LightModeContext);
  const { gameEditionView } = useContext(GameEditionContext);

  return (
    <CustomPopup
      on="click"
      position="bottom right"
      pinned
      trigger={
        <div
          style={{ cursor: 'pointer', ...containerStyle }}
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
          {title ? title : null}
        </div>
      }
    >
      <Popup.Content
        style={{
          padding: '8px',
          color: gameEditionView ? `${theme(themeMode).colors.black}` : `${theme(themeMode).colors.white}`,
        }}
      >
        Copied!
      </Popup.Content>
    </CustomPopup>
  );
};

export default CopyPopup;
