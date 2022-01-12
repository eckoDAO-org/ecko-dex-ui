import React from 'react';
import { LockLogo, ZelcoreLogo, TorusLogo, KaddexLogoWhite, WireChainweaverIcon, WireTorusIcon, WireXwalletIcon, WireZelcoreIcon } from '../assets';

export const WALLET = {
  ZELCORE: {
    id: 'ZELCORE',
    name: 'Zelcore',
    logo: <ZelcoreLogo />,
    signMethod: 'wallet',
    getAccountsUrl: 'http://127.0.0.1:9467/v1/accounts',
    wireIcon: <WireZelcoreIcon />,
  },
  CHAINWEAVER: {
    id: 'CHAINWEAVER',
    name: 'Chainweaver',
    logo: <LockLogo />,
    signMethod: 'wallet',
    getAccountsUrl: 'http://127.0.0.1:9467/v1/accounts',
    wireIcon: <WireChainweaverIcon />,
  },
  TORUS: { id: 'TORUS', name: 'Torus', logo: <TorusLogo />, signMethod: 'sign_required', wireIcon: <WireTorusIcon /> },
  KADDEX_WALLET: { id: 'KADDEX_WALLET', name: 'X Wallet', logo: <KaddexLogoWhite style={{ width: 45 }} />, wireIcon: <WireXwalletIcon /> },
};
