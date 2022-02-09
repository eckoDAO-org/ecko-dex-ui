import React from "react";
import { LockLogo, ZelcoreLogo, TorusLogo } from "../assets";

export const WALLET = {
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
  // TORUS: {
  //   name: "Torus",
  //   logo: <TorusLogo />,
  //   signMethod: "sign_required",
  // },
};
