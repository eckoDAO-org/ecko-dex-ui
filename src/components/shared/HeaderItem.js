import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components/macro';
import { GameEditionContext } from '../../contexts/GameEditionContext';

const Item = styled(NavLink)`
  color: ${({ theme: { colors } }) => colors.white};
  font-size: 14px;
  text-decoration: none;
  text-transform: capitalize;
  background: transparent;
  z-index: 1;

  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }

  .underline {
    width: ${({ $isHover }) => ($isHover ? '100%' : 0)};
    transition: width 0.3s;
    background: ${({ theme: { colors } }) => colors.white};
    height: 1px;
  }

  &:hover {
    color: ${({ theme: { colors } }) => colors.white};

    cursor: pointer;
    & svg {
      & path {
        fill: ${({ $disableHover, theme: { colors } }) => !$disableHover && colors.white};
      }
    }
  }
`;

const HeaderItemContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
      onClick={() => {
        if (link) {
          window.open(link, '_blank', 'noopener,noreferrer');
        } else {
          if (onClick) {
            onClick();
          }
        }
      }}
      style={headerItemStyle}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      $gameEditionView={gameEditionView}
      $isHover={isHover}
      $disableHover={disableHover}
      $notChangebleFontOnHover={notChangebleFontOnHover}
    >
      <HeaderItemContent>
        {icon}
        {children}
      </HeaderItemContent>
      <div className="underline" />
    </Item>
  );
};

export default HeaderItem;
