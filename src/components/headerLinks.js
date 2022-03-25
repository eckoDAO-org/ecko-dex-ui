import React from 'react';
import { AboutIcon, CodeIcon, DiscordIcon, XWalletLogo } from '../assets';

export default [
  {
    id: 0,
    label: 'about',
    icon: <AboutIcon />,
    link: 'https://kaddex.com',
  },
  {
    id: 1,
    label: 'code',
    icon: <CodeIcon />,
    link: 'https://github.com/KaddexGit/kaddex-swap-v2',
  },

  {
    id: 2,
    label: 'discord',
    icon: <DiscordIcon />,
    link: 'https://discord.gg/QSJpHRFDcv',
  },
  {
    id: 3,
    label: 'X-Wallet',
    icon: <XWalletLogo />,
    link: 'https://chrome.google.com/webstore/detail/x-wallet/bofddndhbegljegmpmnlbhcejofmjgbn',
  },
];
