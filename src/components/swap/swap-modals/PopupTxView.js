import React, { useContext } from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import { AccountContext } from '../../../contexts/AccountContext';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import { LightModeContext } from '../../../contexts/LightModeContext';
import CopyPopup from '../../../shared/CopyPopup';
import CustomPopup from '../../../shared/CustomPopup';
import { theme } from '../../../styles/theme';

const PopupTxView = ({ isAccountPopup }) => {
  const { gameEditionView } = useContext(GameEditionContext);
  const { account } = useContext(AccountContext);
  const { themeMode } = useContext(LightModeContext);

  return isAccountPopup ? (
    <CustomPopup
      trigger={
        <Icon name=' info circle' style={{ margin: ' 0px 0px 0px 4px' }} />
      }
      position='top right'
      on='click'
      containerStyle={{
        color: gameEditionView
          ? `${theme(themeMode).colors.black}`
          : `${theme(themeMode).colors.white}`,
      }}
    >
      <Popup.Header
        style={{
          padding: '12px 12px 4px 12px',
          color: gameEditionView
            ? `${theme(themeMode).colors.black}`
            : `${theme(themeMode).colors.white}`,
        }}
      >
        Public Key
        <CopyPopup textToCopy={account.account} />
      </Popup.Header>
      <Popup.Content
        style={{
          inlineSize: '270px',
          overflowWrap: ' break-word',
          padding: '4px 12px 12px 12px',
          color: gameEditionView
            ? `${theme(themeMode).colors.black}`
            : `${theme(themeMode).colors.white}`,
        }}
      >
        {account.account}
      </Popup.Content>
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
          name='help circle'
          style={{ marginLeft: '2px', marginRight: 0 }}
        />
      }
      position='top center'
      containerStyle={{
        color: gameEditionView
          ? `${theme(themeMode).colors.black} !important`
          : `${theme(themeMode).colors.white} !important`,
      }}
    >
      <Popup.Header
        style={{
          padding: '8px 8px 4px 8px',
          color: gameEditionView
            ? `${theme(themeMode).colors.black} !important`
            : `${theme(themeMode).colors.white} !important`,
        }}
      >
        Why is Gas free?
      </Popup.Header>
      <Popup.Content
        style={{
          padding: '8px 4px 8px 8px',
          color: gameEditionView
            ? `${theme(themeMode).colors.black} !important`
            : `${theme(themeMode).colors.white} !important`,
        }}
      >
        Kadena has a novel concept called gas stations that allows smart
        contracts to pay for users' gas. This means you do not need to hold KDA
        to trade any token pair!
      </Popup.Content>
    </CustomPopup>
  );
};

export default PopupTxView;
