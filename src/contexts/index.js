import { useContext } from 'react';
import { KaddexWalletContext } from './KaddexWalletContext';
import { PactContext } from './PactContext';
import { SwapContext } from './SwapContext';
import { AccountContext } from './AccountContext';
import { ModalContext } from './ModalContext';
import { WalletContext } from './WalletContext';
import { NotificationContext } from './NotificationContext';
import { ApplicationContext } from './ApplicationContext';
import { GameEditionContext } from './GameEditionContext';
import { LiquidityContext } from './LiquidityContext';
import { RightModalContext } from './RightModalContext';
import { WalletConnectContext } from './WalletConnectContext';

export function useKaddexWalletContext() {
  return useContext(KaddexWalletContext);
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
export function useWalletContext() {
  return useContext(WalletContext);
}
export function useNotificationContext() {
  return useContext(NotificationContext);
}
export function usePactContext() {
  return useContext(PactContext);
}
export function useApplicationContext() {
  return useContext(ApplicationContext);
}
export function useGameEditionContext() {
  return useContext(GameEditionContext);
}
export function useLiquidityContext() {
  return useContext(LiquidityContext);
}
export function useRightModalContext() {
  return useContext(RightModalContext);
}
export function useWalletConnectContext() {
  return useContext(WalletConnectContext);
}
