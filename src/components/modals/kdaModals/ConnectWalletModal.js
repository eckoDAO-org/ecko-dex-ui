import React, { useContext } from 'react';

import CustomButton from '../../../shared/CustomButton';

import { WALLET } from '../../../constants/wallet';
import { ModalContext } from '../../../contexts/ModalContext';
import ConnectWalletZelcoreModal from './ConnectWalletZelcoreModal';
import ConnecWalletTorusModal from './ConnectWalletTorusModal';
import ConnectWalletChainweaverModal from './ConnectWalletChainweaverModal';
import { GameEditionContext } from '../../../contexts/GameEditionContext';

const ConnectWalletModal = () => {
	const modalContext = useContext(ModalContext);
	const game = useContext(GameEditionContext);

	const openWalletModal = (walletName) => {
		switch (walletName) {
			default:
				return <div />;
			case 'Zelcore':
				/* if (game.gameEditionView) {
					game.openModal({
						title: 'zelcore title',
						description: 'bla bla',
						content: (
							<ConnectWalletZelcoreModal
								onClose={modalContext.closeModal()}
								onBack={() => modalContext.onBackModal()}
							/>
						),
					});
				} else { */
				return modalContext.openModal({
					id: 'ZELCORE',
					title: 'connect wallet',
					description: 'Zelcore Signing (Safest)',
					onBack: () => modalContext.onBackModal(),
					content: (
						<ConnectWalletZelcoreModal
							onClose={modalContext.closeModal()}
							onBack={() => modalContext.onBackModal()}
						/>
					),
				});
			/* } */
			case 'Torus':
				return modalContext.openModal({
					id: 'TORUS',
					title: 'connect wallet',
					description: 'Torus Signing',
					onBack: () => modalContext.onBackModal(),
					content: (
						<ConnecWalletTorusModal
							onClose={() => modalContext.closeModal()}
							onBack={() => modalContext.onBackModal()}
						/>
					),
				});
			case 'Chainweaver':
				return modalContext.openModal({
					id: 'CHIANWEAVER',
					title: 'connect wallet',
					description: 'Chainweaver',
					onBack: () => modalContext.onBackModal(),
					content: (
						<ConnectWalletChainweaverModal
							onClose={() => modalContext.closeModal()}
							onBack={() => modalContext.onBackModal()}
						/>
					),
				});
		}
	};

	return Object.values(WALLET).map((wallet, index) => (
		<CustomButton
			key={index}
			buttonStyle={{
				border: '1px solid #424242',
			}}
			background="transparent"
			onClick={() => {
				openWalletModal(wallet.name);
			}}
		>
			{wallet.logo}
			{` ${wallet.name}`}
		</CustomButton>
	));
};

export default ConnectWalletModal;
