import { useContext } from "react";
import { KadenaWalletContext } from "./KadenaWalletContext";
import { SwapContext } from "./SwapContext";
import { AccountContext } from "./AccountContext";
import { ModalContext } from "./ModalContext";

export function useKadenaWalletContext() {
  return useContext(KadenaWalletContext);
}
export function useSwapContext() {
  return useContext(SwapContext);
}
export function useAccountContext() {
  return useContext(AccountContext);
}

export function useModalContext() {
  return useContext(ModalContext);
}
