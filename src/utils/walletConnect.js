import Client from '@walletconnect/sign-client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { WALLET_CONNECT_METADATA, WALLET_CONNECT_PROJECT_ID, WALLET_CONNECT_RELAY_URL } from '../constants/contextConstants';
import { useCallback, useEffect } from 'react';

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

let client;

const initialize = async () => {
  try {
    client = await Client.init({
      relayUrl: WALLET_CONNECT_RELAY_URL,
      projectId: WALLET_CONNECT_PROJECT_ID,
      metadata: WALLET_CONNECT_METADATA,
    });
    return true;
  } catch (err) {
    return false;
  }
};

const useWalletConnect = () => {
  const connectWallet = useCallback(async (pairing = undefined) => {
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

      const accounts = session.namespaces[KDA_NAMESPACE].accounts.map((item) => {
        let normalAccountName = item;
        KDA_CHAINS.forEach((chain) => {
          normalAccountName = normalAccountName.replace('**', ':').replace(`${chain}:`, '');
        });
        return normalAccountName;
      });

      return {
        chainIds: KDA_CHAINS,
        accounts,
        session,
      };
    } catch (e) {
      return null;
    } finally {
      QRCodeModal.close();
    }
  }, []);

  useEffect(() => {
    if (!client) {
      initialize().then((initialized) => {
        if (!initialized) {
          throw new Error('WalletConnect is not initialized');
        }
      });
    }
  }, []);

  /* const subscribeToEvents = useCallback(async (callbacks) => {
    if (!client) {
      const initialized = await initialize();
      if (!initialized) {
        throw new Error('WalletConnect is not initialized');
      }
    }

    client.on('session_ping', (args) => {
      if (callbacks?.onPing) {
        callbacks.onPing();
      }
    });

    client.on('session_event', (args) => {
      const { event } = args;
      switch (event?.name) {
        case KDA_EVENTS.ACCOUNT_CHANGED:
          if (callbacks?.onAccountChange) {
            callbacks.onAccountChange(event.data);
          }
          break;
        case KDA_EVENTS.CHAIN_ID_CHANGED:
          if (callbacks?.onChainIdChange) {
            callbacks.onChainIdChange(event.data);
          }
          break;
        default:
          break;
      }
    });

    client.on('session_update', ({ topic, params }) => {
        console.log('EVENT', 'session_update', { topic, params });
        const { namespaces } = params;
        const _session = _client.session.get(topic);
        const updatedSession = { ..._session, namespaces };
      });

      client.on('session_delete', () => {
        console.log('EVENT', 'session_delete');
        reset();
      });
  }, []);  */

  return {
    connectWallet,
    // subscribeToEvents,
  };
};

export { initialize, useWalletConnect };
