import Client from '@walletconnect/sign-client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { CHAIN_ID, WALLET_CONNECT_METADATA, WALLET_CONNECT_PROJECT_ID, WALLET_CONNECT_RELAY_URL } from '../constants/contextConstants';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useAccountContext, useNotificationContext } from './index';
import useLocalStorage from '../hooks/useLocalStorage';
import { WALLET } from '../constants/wallet';

export const KDA_NAMESPACE = 'kda';

export const KDA_CHAINS = [
  'kda:0',
  'kda:1',
  'kda:2',
  'kda:3',
  'kda:4',
  'kda:5',
  'kda:6',
  'kda:7',
  'kda:8',
  'kda:9',
  'kda:10',
  'kda:11',
  'kda:12',
  'kda:13',
  'kda:14',
  'kda:15',
  'kda:16',
  'kda:17',
  'kda:18',
  'kda:19',
];

const KDA_METHODS = {
  KDA_SIGN: 'KDA_SIGN',
  KDA_SEND_TRANSACTION: 'KDA_SEND_TRANSACTION',
  KDA_SIGN_TRANSACTION: 'KDA_SIGN_TRANSACTION',
};

const KDA_EVENTS = {
  ACCOUNT_CHANGED: 'accountChanged',
  CHAIN_ID_CHANGED: 'chainIdChanged',
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
    case 'kda':
      return Object.values(KDA_METHODS);
    default:
      throw new Error(`No default methods for namespace: ${namespace}`);
  }
};

export const getSupportedEventsByNamespace = (namespace) => {
  switch (namespace) {
    case 'kda':
      return Object.values(KDA_EVENTS);
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
      const initClient = await Client.init({
        relayUrl: WALLET_CONNECT_RELAY_URL,
        projectId: WALLET_CONNECT_PROJECT_ID,
        metadata: WALLET_CONNECT_METADATA,
      });
      setClient(initClient);
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
    async (account, chainId, payload) => {
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
        chainId: `${KDA_NAMESPACE}:${chainId || CHAIN_ID}`,
        request: {
          method: KDA_METHODS.KDA_SIGN_TRANSACTION,
          params: payload,
        },
      });

      return response;
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
      client.disconnect({
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
  };
  return <WalletConnectContext.Provider value={contextValues}>{props.children}</WalletConnectContext.Provider>;
};
