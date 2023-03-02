import React from 'react';
import { AboutIcon, BetaIcon, CodeIcon, VaultIcon, EckoWalletLogo, DiscordIcon } from '../assets';

export default [
  {
    id: 3,
    label: 'eckoWALLET',
    icon: <EckoWalletLogo />,
    link: 'https://chrome.google.com/webstore/detail/eckowallet/bofddndhbegljegmpmnlbhcejofmjgbn',
  },
  {
    id: 4,
    label: 'BETA',
    icon: <BetaIcon className="menu-icon" />,
    link: 'https://beta.ecko.finance',
    hideOnGameEdition: true,
  },
  {
    id: 5,
    label: 'Vault',
    icon: <VaultIcon className="menu-icon" />,
    link: process.env.REACT_APP_VAULTING_URL,
    hideOnGameEdition: true,
  },
  {
    id: 2,
    label: 'Discord',
    icon: <DiscordIcon className="menu-icon" />,
    link: 'https://discord.com/invite/eckodao',
  },
  {
    id: 1,
    label: 'Code',
    icon: <CodeIcon className="menu-icon" />,
    link: 'https://github.com/eckoDAO-org/ecko-dex-ui',
  },

  {
    id: 0,
    label: 'About',
    icon: <AboutIcon className="menu-icon" />,
    link: 'https://dex.ecko.finance',
  },
];
