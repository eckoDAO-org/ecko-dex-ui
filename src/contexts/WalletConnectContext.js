import SignClient from '@walletconnect/sign-client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { NETWORKID, WALLET_CONNECT_METADATA, WALLET_CONNECT_PROJECT_ID, WALLET_CONNECT_RELAY_URL } from '../constants/contextConstants';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useAccountContext } from './index';
import useLocalStorage from '../hooks/useLocalStorage';

export const KDA_NAMESPACE = 'kadena';

export const KDA_CHAINS = ['kadena:mainnet01', 'kadena:testnet04', 'kadena:development'];

const KDA_METHODS = {
  KDA_SIGN: 'kadena_sign',
  KDA_QUICK_SIGN: 'kadena_quicksign',
};

const KDX_METHODS = {
  KDX_SIGN: 'kaddex_sign',
  KDX_SEND_TRANSACTION: 'kaddex_send_transaction',
  KDX_SIGN_TRANSACTION: 'kaddex_sign_transaction',
};

const KDA_EVENTS = {
  KDA_TRANSACTION_UPDATED: 'kadena_transaction_updated',
};

const KDX_EVENTS = {
  ACCOUNT_CHANGED: 'account_changed',
  CHAIN_ID_CHANGED: 'chain_id_changed',
};

export const getNamespacesFromChains = (chains) => {
  const supportedNamespaces = [];
  chains.forEach((chainId) => {
    const [namespace] = chainId.split(':');
    if (!supportedNamespaces.includes(namespace)) {
      supportedNamespaces.push(namespace);
    }
  });

  return supportedNamespaces;
};

export const getSupportedMethodsByNamespace = (namespace) => {
  switch (namespace) {
    case 'kadena':
      return Object.values(KDA_METHODS);
    case 'kaddex':
      return Object.values(KDX_METHODS);
    default:
      throw new Error(`No default methods for namespace: ${namespace}`);
  }
};

export const getSupportedEventsByNamespace = (namespace) => {
  switch (namespace) {
    case 'kadena':
      return Object.values(KDA_EVENTS);
    case 'kaddex':
      return Object.values(KDX_EVENTS);
    default:
      throw new Error(`No default events for namespace: ${namespace}`);
  }
};

export const getRequiredNamespaces = (chains) => {
  const selectedNamespaces = getNamespacesFromChains(chains);
  return Object.fromEntries(
    selectedNamespaces.map((namespace) => [
      namespace,
      {
        methods: getSupportedMethodsByNamespace(namespace),
        chains: chains.filter((chain) => chain.startsWith(namespace)),
        events: getSupportedEventsByNamespace(namespace),
        extension: [
          {
            methods: getSupportedMethodsByNamespace('kaddex'),
            chains: chains.filter((chain) => chain.startsWith(namespace)),
            events: getSupportedEventsByNamespace('kaddex'),
          },
        ],
      },
    ])
  );
};

export const WalletConnectContext = createContext();

const initialWalletConnectState = {
  pairingTopic: null,
};

export const WalletConnectProvider = (props) => {
  const [client, setClient] = useState();
  const [walletConnectState, setWalletConnectState] = useLocalStorage('walletConnectState', initialWalletConnectState);

  const { account, logout } = useAccountContext();

  const initialize = useCallback(async () => {
    try {
      const signClient = await SignClient.init({
        projectId: WALLET_CONNECT_PROJECT_ID,
        relayUrl: WALLET_CONNECT_RELAY_URL,
        metadata: WALLET_CONNECT_METADATA,
      });
      setClient(signClient);
      return true;
    } catch (err) {
      return false;
    }
  }, []);

  const connectWallet = useCallback(
    async (pairing = undefined) => {
      if (!client) {
        const initialized = await initialize();
        if (!initialized) {
          throw new Error('WalletConnect is not initialized');
        }
      }
      try {
        const requiredNamespaces = getRequiredNamespaces(KDA_CHAINS);

        const { uri, approval } = await client.connect({
          pairingTopic: pairing?.topic,
          requiredNamespaces,
        });

        if (uri) {
          QRCodeModal.open(
            uri,
            () => {
              console.log('EVENT', 'QR Code Modal closed');
            },
            {
              desktopLinks: [],
              mobileLinks: [],
            }
          );
        }

        const session = await approval();
        setWalletConnectState({
          ...walletConnectState,
          pairingTopic: session.topic,
        });

        const accounts = session.namespaces[KDA_NAMESPACE].accounts.map((item) => {
          let normalAccountName = item;
          KDA_CHAINS.forEach((chain) => {
            normalAccountName = normalAccountName.replace('**', ':').replace(`${chain}:`, '');
          });
          return normalAccountName;
        });

        QRCodeModal.close();

        return {
          chainIds: KDA_CHAINS,
          accounts,
          session,
        };
      } catch (e) {
        QRCodeModal.close();
        return null;
      }
    },
    [client, initialize, setWalletConnectState, walletConnectState]
  );

  const requestSignTransaction = useCallback(
    async (account, networkId, payload) => {
      if (!client) {
        const initialized = await initialize();
        if (!initialized) {
          throw new Error('WalletConnect is not initialized');
        }
      }
      if (!walletConnectState?.pairingTopic) {
        const connectedWallet = await connectWallet();
        if (!connectedWallet) {
          throw new Error('WalletConnect is not connected');
        }
      }

      const response = await client?.request({
        topic: walletConnectState?.pairingTopic,
        chainId: `${KDA_NAMESPACE}:${networkId || NETWORKID}`,
        request: {
          method: KDA_METHODS.KDA_SIGN,
          params: payload,
        },
      });

      return response;
    },
    [client, walletConnectState, connectWallet, initialize]
  );

  const sendTransactionUpdateEvent = useCallback(
    async (networkId, payload) => {
      if (!client) {
        const initialized = await initialize();
        if (!initialized) {
          throw new Error('WalletConnect is not initialized');
        }
      }
      if (!walletConnectState?.pairingTopic) {
        const connectedWallet = await connectWallet();
        if (!connectedWallet) {
          throw new Error('WalletConnect is not connected');
        }
      }

      try {
        await client?.emit({
          topic: walletConnectState?.pairingTopic,
          chainId: `${KDA_NAMESPACE}:${networkId || NETWORKID}`,
          event: {
            name: KDA_EVENTS.KDA_TRANSACTION_UPDATED,
            params: payload,
          },
        });
      } catch (e) {}
    },
    [client, walletConnectState, connectWallet, initialize]
  );

  useEffect(() => {
    if (!client) {
      initialize().then((initialized) => {
        if (!initialized) {
          throw new Error('WalletConnect is not initialized');
        }
      });
    }
  }, [client, initialize]);

  useEffect(() => {
    if (client) {
      if (!walletConnectState?.pairingTopic) {
        const pairings = client.pairing.getAll({ active: true });
        if (pairings && pairings.length > 0) {
          setWalletConnectState((state) => ({
            ...state,
            pairingTopic: pairings[pairings.length - 1].topic,
          }));
        }
      }
      const onSessionDelete = () => {
        setWalletConnectState(initialWalletConnectState);
        localStorage.removeItem('walletConnectState');
        logout();
      };
      client.on('session_delete', onSessionDelete);
      client.on('pairing_delete', onSessionDelete);
      client.on('session_expire', onSessionDelete);
      client.on('pairing_expire', onSessionDelete);
      return () => {
        client.removeListener('session_delete', onSessionDelete);
        client.removeListener('pairing_delete', onSessionDelete);
        client.removeListener('session_expire', onSessionDelete);
        client.removeListener('pairing_expire', onSessionDelete);
      };
    }
  }, [client, walletConnectState, setWalletConnectState, logout]);

  useEffect(() => {
    if (walletConnectState?.pairingTopic && client && !account) {
      client
        .disconnect({
          topic: walletConnectState?.pairingTopic,
          reason: {
            message: 'User disconnected.',
            code: 6000,
          },
        })
        .finally(() => {
          setWalletConnectState(initialWalletConnectState);
        });
    }
  }, [client, account, walletConnectState, setWalletConnectState]);

  const contextValues = {
    ...walletConnectState,
    connectWallet,
    requestSignTransaction,
    sendTransactionUpdateEvent,
  };
  return <WalletConnectContext.Provider value={contextValues}>{props.children}</WalletConnectContext.Provider>;
};
