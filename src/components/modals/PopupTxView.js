import React from 'react';
import { Icon } from 'semantic-ui-react';
import CopyPopup from '../shared/CopyPopup';
import CustomPopup from '../shared/CustomPopup';
import { theme } from '../../styles/theme';
import Label from '../shared/Label';
import { useAccountContext, useApplicationContext, useGameEditionContext } from '../../contexts';

const PopupTxView = ({ isAccountPopup, popupStyle, offset }) => {
  const { gameEditionView } = useGameEditionContext();
  const { account } = useAccountContext();
  const { themeMode } = useApplicationContext();

  const containerStyle = gameEditionView
    ? {
        padding: 8,
        border: '2px dashed #ffffff',
        borderRadius: 0,
        backgroundColor: '#000000',
      }
    : { color: `${theme(themeMode).colors.white}` };

  return isAccountPopup ? (
    <CustomPopup
      containerStyle={containerStyle}
      hideGradient={gameEditionView}
      trigger={<Icon name="info circle" style={{ margin: ' 0px 0px 0px 4px' }} />}
      position="top right"
      on="click"
    >
      <Label
        fontFamily="syncopate"
        labelStyle={{
          padding: '12px 12px 4px 12px',
          display: 'flex',
        }}
        geColor="yellow"
        geLabelStyle={{ marginBottom: 8 }}
      >
        Public Key
        <CopyPopup textToCopy={account.account} />
      </Label>
      <Label
        geLabelStyle={{ inlineSize: 270, display: 'block', overflowWrap: 'break-word', width: 'unset' }}
        labelStyle={{
          inlineSize: 270,
          display: 'block',
          overflowWrap: 'break-word',
          padding: '4px 12px 12px',
        }}
      >
        {account.account}
      </Label>
    </CustomPopup>
  ) : (
    <CustomPopup
      trigger={
        <Icon
          onClick={() => {
            window.open(
              'https://medium.com/kadena-io/the-first-crypto-gas-station-is-now-on-kadenas-blockchain-6dc43b4b3836',
              '_blank',
              'noopener,noreferrer'
            );
          }}
          name="help circle"
          style={{ marginLeft: '2px', marginRight: 0, color: theme(themeMode).colors.white }}
        />
      }
      offset={offset}
      position="top right"
      popupStyle={popupStyle}
      containerStyle={containerStyle}
      hideGradient={gameEditionView}
    >
      <Label
        geColor="yellow"
        fontFamily="syncopate"
        geLabelStyle={{ marginBottom: 8 }}
        labelStyle={{
          padding: '8px 8px 4px 8px',
        }}
      >
        Why is Gas free?
      </Label>
      <Label
        geCenter
        labelStyle={{
          padding: '8px 4px 8px 8px',
        }}
      >
        Kadena has a novel concept called gas stations that allows smart contracts to pay for users' gas. This means you do not need to hold KDA to
        trade any token pair!
      </Label>
    </CustomPopup>
  );
};

export default PopupTxView;
