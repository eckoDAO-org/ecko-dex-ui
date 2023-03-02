import React from 'react';
import {
  LockLogo,
  ZelcoreLogo,
  WireChainweaverIcon,
  WireEckoWalletIcon,
  WireZelcoreIcon,
  LogoZelcoreIcon,
  LogoChainweaverIcon,
  EckoWalletLogo,
  WalletConnectLogo,
  WireWalletConnectIcon,
  LogoWalletConnectIcon,
} from '../assets';

export const WALLET = {
  ECKOWALLET: {
    id: 'ECKOWALLET',
    name: 'eckoWALLET',
    logo: <EckoWalletLogo style={{ width: 45 }} />,
    wireIcon: <WireEckoWalletIcon />,
    notificationLogo: <EckoWalletLogo />,
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
  WALLETCONNECT: {
    id: 'WALLETCONNECT',
    name: 'WalletConnect',
    logo: <WalletConnectLogo width={18} height={18} />,
    signMethod: 'wallet',
    wireIcon: <WireWalletConnectIcon />,
    notificationLogo: <LogoWalletConnectIcon />,
  },
};
