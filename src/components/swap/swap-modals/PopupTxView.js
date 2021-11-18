import React, { useContext } from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import { AccountContext } from '../../../contexts/AccountContext';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import CustomPopup from '../../../shared/CustomPopup';
import theme from '../../../styles/theme';

const PopupTxView = ({ isAccountPopup }) => {
  const gameEditionView = useContext(GameEditionContext);
  const { account } = useContext(AccountContext);
  return isAccountPopup ? (
    <CustomPopup
      trigger={
        <Icon
          name='inverted info circle'
          style={{ margin: ' 0px 0px 0px 4px' }}
        />
      }
      position='top center'
      style={{
        color: gameEditionView && `${theme.colors.black} !important`,
      }}
    >
      <Popup.Header
        style={{
          padding: '8px 8px 4px 8px',
        }}
      >
        Complete Public Key
      </Popup.Header>
      <Popup.Content
        style={{
          inlineSize: '150px',
          overflowWrap: ' break-word',
          padding: '8px 4px 8px 8px',
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
      style={{ color: gameEditionView && `${theme.colors.black} !important` }}
    >
      <Popup.Header
        style={{
          padding: '8px 8px 4px 8px',
        }}
      >
        Why is Gas free?
      </Popup.Header>
      <Popup.Content
        style={{
          padding: '8px 4px 8px 8px',
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
