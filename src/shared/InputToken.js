import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { ArrowDown, DropdownGe, CloseGe } from '../assets';
import CustomButton from './CustomButton';
import { GameEditionContext } from '../contexts/GameEditionContext';
import theme from '../styles/theme';

const Container = styled.div`
    position: absolute;
    top: 13%;
    right: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: ${({ theme: { inputTokenWidth } }) => `${inputTokenWidth}px`};
`;

const ElementsContainer = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    svg:first-child {
        margin-right: 8px;
    }

    span {
        font-size: 16px;
        margin-right: 13px;
        font: ${({ gameEditionView }) => {
            if (gameEditionView)
                return `normal normal normal 14px/17px ${theme.fontFamily.pressStartRegular}`;
        }};
        color: ${({ gameEditionView }) =>
            gameEditionView ? `${theme.colors.black}` : '#fff'};
    }
`;

const InputToken = ({ icon, code, onClick, onClickButton, disabledButton }) => {
    const { gameEditionView } = useContext(GameEditionContext);

    return (
        <Container gameEditionView={gameEditionView}>
            <ElementsContainer
                gameEditionView={gameEditionView}
                onClick={onClick}
            >
                {!gameEditionView && <>{icon}</>}

                <span>{code}</span>
            </ElementsContainer>
            {gameEditionView ? <DropdownGe /> : <ArrowDown />}
            <CustomButton
                buttonStyle={{
                    padding: 12,
                    marginLeft: 12,
                    textTransform: gameEditionView ? 'capitalize' : 'uppercase',
                }}
                border={gameEditionView && 'none'}
                fontSize={gameEditionView ? '13px' : '8px'}
                onClick={onClickButton}
                disabled={disabledButton}
            >
                Max
            </CustomButton>
        </Container>
    );
};

InputToken.propTypes = {
    icon: PropTypes.element,
    code: PropTypes.string,
};

InputToken.defaultProps = {
    icon: null,
    code: '',
};

export default InputToken;
