import React, { useContext } from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import { useGameEditionContext } from '../../contexts';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { theme } from '../../styles/theme';
import CustomPopup from './CustomPopup';
import Label from './Label';

const CopyPopup = ({ textToCopy, title, containerStyle }) => {
  const { themeMode } = useContext(ApplicationContext);
  const { gameEditionView } = useGameEditionContext();
  return (
    <CustomPopup
      containerStyle={gameEditionView ? { padding: 8, border: '2px dashed #ffffff', borderRadius: 0, backgroundColor: '#000000' } : { padding: 8 }}
      hideGradient={gameEditionView}
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
            style={{ marginLeft: 8, color: gameEditionView && '#fff' }}
            onClick={() => {
              navigator.clipboard.writeText(textToCopy);
            }}
          />
          {title && (
            <Label fontFamily="bold" geFontSize={20}>
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
