import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components/macro";

const Item = styled(NavLink)`
  color: #ffffff;
  font-size: 14px;
  text-decoration: none;
  text-transform: capitalize;
  background: transparent;

  &.active {
    font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  }

  &:hover {
    color: #ffffff;
    text-shadow: 0 0 5px #ffffff;
    cursor: pointer;
    & svg {
      & path {
        fill: #ffffff;
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
  headerItemStyle,
}) => {
  const getTo = () => {
    if (route) return route;
    else if (link) return "/";
    else return "#";
  };
  return (
    <Item
      id={id}
      className={className}
      exact
      to={getTo()}
      onClick={() =>
        link ? window.open(link, "_blank", "noopener,noreferrer") : onClick
      }
      style={headerItemStyle}
    >
      {icon}
      {children}
    </Item>
  );
};

export default HeaderItem;
