import React from "react";
import { LockLogo, ZelcoreLogo } from "../assets";

export const WALLET = {
  KADDEX_WALLET: {
    id: 'KADDEX_WALLET',
    name: 'X-Wallet',
  },
  ZELCORE: {
    name: "Zelcore",
    logo: <ZelcoreLogo />,
    signMethod: "wallet",
    getAccountsUrl: "http://127.0.0.1:9467/v1/accounts",
  },
  CHAINWEAVER: {
    name: "Chainweaver",
    logo: <LockLogo />,
    signMethod: "wallet",
    getAccountsUrl: "http://127.0.0.1:9467/v1/accounts",
  },
};
