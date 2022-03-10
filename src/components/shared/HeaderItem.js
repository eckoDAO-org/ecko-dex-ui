import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import { GameEditionContext } from '../../contexts/GameEditionContext';

const Item = styled.div`
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
  .active {
    width: 100%;
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

const HeaderItem = ({ id, className, children, disableUnderline, onClick, item, headerItemStyle, disableHover, notChangebleFontOnHover }) => {
  const { gameEditionView } = useContext(GameEditionContext);
  const history = useHistory();

  const [buttonHover, setButtonHover] = useState(null);

  const isActive = () => {
    const { pathname } = window.location;
    return pathname === item?.route || item?.activeRoutes?.includes(pathname);
  };

  return (
    <Item
      id={id}
      className={className}
      onClick={() => {
        if (item.route) {
          history.push(item.route);
        } else if (item.link) {
          window.open(item.link, '_blank', 'noopener,noreferrer');
        } else {
          if (onClick) {
            onClick();
          }
        }
      }}
      style={headerItemStyle}
      onMouseOver={() => setButtonHover(item?.id)}
      onMouseLeave={() => setButtonHover(null)}
      $gameEditionView={gameEditionView}
      $isHover={buttonHover === item?.id}
      $disableHover={disableHover}
      $notChangebleFontOnHover={notChangebleFontOnHover}
    >
      <HeaderItemContent>
        {item?.icon}
        {children}
      </HeaderItemContent>
      {!disableUnderline && <div className={`underline ${isActive() ? 'active' : ''}`} />}
    </Item>
  );
};

export default HeaderItem;
