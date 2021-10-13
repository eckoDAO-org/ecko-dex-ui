import React, { useContext } from 'react';
import { Checkbox } from 'semantic-ui-react';
import styled from 'styled-components';
import { GameEditionContext } from '../contexts/GameEditionContext';

const ToggleContainer = styled.div`
 font-family: ${({ theme: { fontFamily } }) => `${fontFamily.pressStartRegular}`};
 color:#ffffff;
 justify-content: center;

 span {
  vertical-align: text-bottom !important;
  margin-right: 4px;
 }
`

const GameEditionToggle = () => {

    const game = useContext(GameEditionContext)
    return (
        <ToggleContainer>
              <span>        
          Game Edition  
        </span>
        <Checkbox toggle onChange={()=>game.setGameEditionView(!game.gameEditionView)}/> 
        </ToggleContainer>
    );
};

export default GameEditionToggle;