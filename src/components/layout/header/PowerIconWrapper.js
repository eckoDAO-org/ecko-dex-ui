/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import styled from 'styled-components/macro';
import { useGameEditionContext } from '../../../contexts';

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    circle {
      fill: ${({ theme: { colors } }) => colors.white};
    }
    path {
      fill: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? colors.green : colors.primary)};
      -webkit-filter: ${({ gameEditionView, theme: { colors } }) => gameEditionView && `drop-shadow(0px 0px 5px ${colors.green})`};
      filter: ${({ gameEditionView, theme: { colors } }) => gameEditionView && `drop-shadow(0px 0px 5px ${colors.green})`};
    }
  }
  &:hover {
    & svg {
      & path {
        fill: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? colors.green : colors.primary)};
      }
    }
  }
`;

const PowerIconWrapper = ({ onClick }) => {
  const { gameEditionView } = useGameEditionContext();
  return (
    <IconWrapper onClick={onClick} gameEditionView={gameEditionView}>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <g id="On-Off" transform="translate(-16 -12)">
          <circle id="Ellipse_3144" data-name="Ellipse 3144" cx="16" cy="16" r="16" transform="translate(16 12)" />
          <path
            id="ic_on-off"
            d="M13.208,1.717a7.821,7.821,0,0,1,3.355,6.41A7.938,7.938,0,0,1,8.579,16,7.956,7.956,0,0,1,.562,8.14,7.837,7.837,0,0,1,3.911,1.721a.784.784,0,0,1,1.129.244l.51.892a.754.754,0,0,1-.213.984A5.281,5.281,0,0,0,3.143,8.124,5.373,5.373,0,0,0,8.562,13.46a5.375,5.375,0,0,0,5.419-5.368,5.308,5.308,0,0,0-2.2-4.254.75.75,0,0,1-.21-.981l.51-.892a.78.78,0,0,1,1.123-.248ZM9.853,8.381V.762A.766.766,0,0,0,9.079,0H8.046a.766.766,0,0,0-.774.762V8.381a.766.766,0,0,0,.774.762H9.079A.766.766,0,0,0,9.853,8.381Z"
            transform="translate(23.438 20)"
          />
        </g>
      </svg>
    </IconWrapper>
  );
};

export default PowerIconWrapper;
