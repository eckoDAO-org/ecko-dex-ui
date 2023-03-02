import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';
import { useGameEditionContext } from '../../contexts';
import { ROUTE_INDEX } from '../../router/routes';

const Item = styled(Link)`
  color: ${({ theme: { colors } }) => colors.white};
  font-size: 14px;
  text-decoration: none;
  background: transparent;
  z-index: 1;

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
    flex-direction: column;
    text-align: left;
    max-width: min-content;
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
    /* & svg {
      & path {
        fill: ${({ $disableHover, theme: { colors } }) => !$disableHover && colors.white};
      }
    } */
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
  children,
  disableUnderline,
  hideIcon,
  onClick,
  item,
  headerItemStyle,
  disableHover,
  notChangebleFontOnHover,
}) => {
  const { gameEditionView } = useGameEditionContext();
  const history = useHistory();
  const { pathname } = useLocation();

  const [buttonHover, setButtonHover] = useState(null);

  const isActive = () => {
    return pathname === item?.route || item?.activeRoutes?.includes(pathname) || pathname.includes(item?.activeRoutes);
  };

  return (
    <Item
      id={id}
      to={item.route || '/'}
      className={className}
      onClick={() => {
        if (item.route) {
          if (item.route === ROUTE_INDEX) {
            history.push(item.route?.concat(history?.location?.search));
          } else {
            history.push(item.route);
          }
          if (onClick) {
            onClick();
          }
        } else if (item.link) {
          window.open(item.link, item?.target || '_blank');
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
        {!hideIcon && item?.icon}
        {children}
      </HeaderItemContent>
      {!disableUnderline && <div className={`underline ${isActive() ? 'active' : ''}`} />}
    </Item>
  );
};

export default HeaderItem;
