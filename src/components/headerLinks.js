import React from 'react';
import { AboutIcon, CodeIcon, DiscordIcon, XWalletLogo } from '../assets';

export default [
  {
    id: 0,
    label: 'about',
    icon: <AboutIcon className="menu-icon" />,
    link: 'https://kaddex.com',
  },
  {
    id: 1,
    label: 'code',
    icon: <CodeIcon className="menu-icon" />,
    link: 'https://github.com/KaddexGit/kaddex-swap-v2',
  },

  {
    id: 2,
    label: 'discord',
    icon: <DiscordIcon className="menu-icon" />,
    link: 'https://discord.gg/QSJpHRFDcv',
  },
  {
    id: 3,
    label: 'X-Wallet',
    icon: <XWalletLogo />,
    link: 'https://chrome.google.com/webstore/detail/x-wallet/bofddndhbegljegmpmnlbhcejofmjgbn',
  },
];
