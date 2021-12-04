import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components/macro';
import { GameEditionContext } from '../contexts/GameEditionContext';

const Item = styled(NavLink)`
  color: ${({ theme: { colors } }) => colors.white};
  font-size: 14px;
  text-decoration: none;
  text-transform: capitalize;
  background: transparent;

  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }

  &.active {
    font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  }

  .underline {
    width: ${({ $isHover }) => ($isHover ? '100%' : 0)};
    transition: width 0.3s;
    background: ${({ theme: { colors } }) => colors.white};
    height: 3px;
  }

  &:hover {
    font-family: ${({ theme: { fontFamily }, $gameEditionView, $notChangebleFontOnHover }) =>
      !$notChangebleFontOnHover && `${fontFamily.bold} !important`};
    color: ${({ theme: { colors }, $gameEditionView }) => colors.white};

    /* text-shadow: ${({ theme: { colors }, $gameEditionView }) => ($gameEditionView ? 'none' : `0 0 5px ${colors.white}`)}; */
    cursor: pointer;
    & svg {
      & path {
        fill: ${({ $disableHover, theme: { colors } }) => !$disableHover && colors.white};
      }
    }
  }
`;

const HeaderItem = ({
  id,
  className,
  route,
  children,
  icon,
  link,
  onClick,
  onMouseOver,
  onMouseLeave,
  isHover,
  headerItemStyle,
  disableHover,
  notChangebleFontOnHover,
}) => {
  const { gameEditionView } = useContext(GameEditionContext);

  const getTo = () => {
    if (route) return route;
    else if (link) return '/';
    else return '#';
  };

  return (
    <Item
      id={id}
      className={className}
      exact
      to={getTo()}
      onClick={() => (link ? window.open(link, '_blank', 'noopener,noreferrer') : onClick)}
      style={headerItemStyle}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      $gameEditionView={gameEditionView}
      $isHover={isHover}
      $disableHover={disableHover}
      $notChangebleFontOnHover={notChangebleFontOnHover}
    >
      {icon}
      {children}
      <div className="underline"></div>
    </Item>
  );
};

export default HeaderItem;
