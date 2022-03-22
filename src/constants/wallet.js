import React from 'react';
import {
  LockLogo,
  ZelcoreLogo,
  KaddexWhite,
  WireChainweaverIcon,
  WireXwalletIcon,
  WireZelcoreIcon,
  LogoZelcoreIcon,
  LogoChainweaverIcon,
  LogoXwalletIcon,
} from '../assets';

export const WALLET = {
  KADDEX_WALLET: {
    id: 'KADDEX_WALLET',
    name: 'X-Wallet',
    logo: <KaddexWhite style={{ width: 45 }} />,
    wireIcon: <WireXwalletIcon />,
    notificationLogo: <LogoXwalletIcon />,
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
