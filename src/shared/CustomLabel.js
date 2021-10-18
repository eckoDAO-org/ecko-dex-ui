import React, { useContext } from 'react';
import styled from 'styled-components';
import { GameEditionContext } from '../contexts/GameEditionContext';
import theme from '../styles/theme';

const Label = styled.span`
	color: #ffffff;
	text-transform: capitalize;
`;

const CustomLabel = ({ children, bold, fontSize, labelStyle }) => {
	const { gameEditionView } = useContext(GameEditionContext);

	return (
		<Label
			style={{
				fontFamily: gameEditionView
					? theme.fontFamily.pressStartRegular
					: bold
					? theme.fontFamily.bold
					: theme.fontFamily.regular,
				fontSize: gameEditionView ? '10px' : fontSize ? fontSize : 13,
				color: gameEditionView ? theme.colors.black : '#fff',
				...labelStyle,
			}}
		>
			{children}
		</Label>
	);
};

export default CustomLabel;
