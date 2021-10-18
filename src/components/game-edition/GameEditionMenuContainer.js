import React from 'react';
import styled from 'styled-components';
import HeaderItem from '../../shared/HeaderItem';
import theme from '../../styles/theme';
import headerLinks from '../headerLinks';
import menuItems from '../menuItems';
import { FadeIn } from '../shared/animations';

const Container = styled(FadeIn)`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const TopListContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 50px;
	& > *:not(:last-child) {
		margin-bottom: 25px;
	}
`;

const BottomListContainer = styled.div`
	display: flex;
	flex-direction: column;
	& > *:not(:last-child) {
		margin-bottom: 25px;
	}
`;
const GameEditionMenuContainer = () => {
	return (
		<Container>
			<TopListContainer>
				{menuItems.map((item, index) => (
					<HeaderItem
						key={index}
						className={item.className}
						route={item.route}
						headerItemStyle={{
							fontFamily: theme.fontFamily.pressStartRegular,
							color: 'black',
						}}
					>
						{item.label}
					</HeaderItem>
				))}
			</TopListContainer>
			<BottomListContainer>
				{headerLinks.map((item, index) => (
					<HeaderItem
						className={item?.className}
						route={item?.route}
						key={index}
						onClick={item?.onClick}
						link={item?.link}
						headerItemStyle={{
							fontFamily: theme.fontFamily.pressStartRegular,
							color: 'black',
						}}
					>
						{item.label}
					</HeaderItem>
				))}
			</BottomListContainer>
		</Container>
	);
};

export default GameEditionMenuContainer;
