import React, { useContext } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { ROUTE_GAME_EDITION_MENU, ROUTE_SWAP } from '../../router/routes';
import { GameEditionWrapper } from './GameEditionWrapper';
import { GameEditionContext } from '../../contexts/GameEditionContext';

const MainContainer = styled.div`
	/* position: relative; */
	display: flex;
	width: 100%;
	justify-content: center;
`;

const ContentContainer = styled.div`
	width: 100%;
	height: 100%;
	border-radius: 24px;
	background: rgb(254, 251, 102);
	background: linear-gradient(
		180deg,
		rgba(254, 251, 102, 1) 35%,
		rgba(255, 54, 208, 1) 100%
	);
	display: flex;
	justify-content: center;
	flex-direction: column;
	text-align: center;
	font-weight: 500;
	font-size: larger;
`;
const GameEditionContainer = ({ children }) => {
	const { modalState } = useContext(GameEditionContext);
	const history = useHistory();

  // d3.select("#start_button").style("cursor","pointer").on("click",()=>setmessage("I'm swap Button"))
  // d3.select("#select_button").style("cursor","pointer").on("click",()=>setmessage("I'm Menu Button"))
  // d3.select("#left_button").style("cursor","pointer").on("click",()=>setmessage("I'm Left Button"))
  // d3.select("#right_button").style("cursor","pointer").on("click",()=>setmessage("I'm Right Button"))
  // d3.select("#power_button").style("cursor","pointer").on("click",()=>setmessage("I'm Power Button"))
  // d3.select("#a_button").style("cursor","pointer").on("click",()=>setmessage("I'm A Button"))
  // d3.select("#b_button").style("cursor","pointer").on("click",()=>setmessage("I'm B Button"))

  return (
    <MainContainer>
      <GameEditionWrapper
        selectLabel="MENU"
        selectOnClick={() => history.push(ROUTE_GAME_EDITION_MENU)}
        startLabel="SWAP"
        startOnClick={() => history.push(ROUTE_SWAP)}
      >
        <ContentContainer>
          {children}
          {/* {modalState.isVisible && (
						<div
							style={{
								top: 0,
								width: '100%',
								height: '100%',
								background:
									'linear-gradient(180deg,rgba(254, 251, 102, 1) 35%,rgba(255, 54, 208, 1) 100%)',
								position: 'absolute',
								borderRadius: '20px',
								display: 'flex',
								flexFlow: 'column',
							}}
						>
							<div>{modalState.title}</div>
							{modalState.content}
						</div>
					)} */}
        </ContentContainer>
      </GameEditionWrapper>
    </MainContainer>
  );
};

export default GameEditionContainer;
