import React from 'react';
import {
  LockLogo,
  ZelcoreLogo,
  WireChainweaverIcon,
  WireXwalletIcon,
  WireZelcoreIcon,
  LogoZelcoreIcon,
  LogoChainweaverIcon,
  XWalletLogo,
} from '../assets';

export const WALLET = {
  KADDEX_WALLET: {
    id: 'KADDEX_WALLET',
    name: 'X-Wallet',
    logo: <XWalletLogo style={{ width: 45 }} />,
    wireIcon: <WireXwalletIcon />,
    notificationLogo: <XWalletLogo />,
  },
  ZELCORE: {
    id: 'ZELCORE',
    name: 'Zelcore',
    logo: <ZelcoreLogo />,
    signMethod: 'wallet',
    getAccountsUrl: 'http://127.0.0.1:9467/v1/accounts',
    wireIcon: <WireZelcoreIcon />,
    notificationLogo: <LogoZelcoreIcon />,
  },
  CHAINWEAVER: {
    id: 'CHAINWEAVER',
    name: 'Chainweaver',
    logo: <LockLogo />,
    signMethod: 'wallet',
    getAccountsUrl: 'http://127.0.0.1:9467/v1/accounts',
    wireIcon: <WireChainweaverIcon />,
    notificationLogo: <LogoChainweaverIcon />,
  },
};
