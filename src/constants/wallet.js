import React from 'react';
import { LockLogo, ZelcoreLogo, TorusLogo, KaddexLogoWhite } from '../assets';
import WireZelcore from '../assets/images/game-edition/wire-zelcore.png';
import WireChainweaver from '../assets/images/game-edition/wire-chainweaver.png';
import WireTorus from '../assets/images/game-edition/wire-torus.png';
import WireXwallet from '../assets/images/game-edition/wire-x-wallet.png';

export const WALLET = {
  ZELCORE: {
    name: 'Zelcore',
    logo: <ZelcoreLogo />,
    signMethod: 'wallet',
    getAccountsUrl: 'http://127.0.0.1:9467/v1/accounts',
    wire: WireZelcore,
  },
  CHAINWEAVER: {
    name: 'Chainweaver',
    logo: <LockLogo />,
    signMethod: 'wallet',
    getAccountsUrl: 'http://127.0.0.1:9467/v1/accounts',
    wire: WireChainweaver,
  },
  TORUS: {
    name: 'Torus',
    logo: <TorusLogo />,
    signMethod: 'sign_required',
    wire: WireTorus,
  },
  KADDEX_WALLET: {
    name: 'X Wallet',
    logo: <KaddexLogoWhite style={{ width: 45 }} />,
    wire: WireXwallet,
  },
};
