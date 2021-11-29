import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { Menu } from 'semantic-ui-react';

const Container = styled.div`
  .ui.menu .active.item {
    background: ${({ theme: { colors } }) => colors.primary};
    color: #ffffff;
  }

  .ui.menu {
    box-shadow: none;
    margin-bottom: 1rem;
  }

  .ui.menu .item {
    cursor: pointer;
    font-family: montserrat;
    font-size: 16px;
    text-transform: capitalize;
    color: ${({ theme: { colors } }) => colors.primary};
    border-radius: 0px;
  }
`;

const MenuTabs = ({ activeItem, items, containerStyle, onItemClick }) => {
  return (
    <Container style={containerStyle}>
      <Menu widths={items.length} style={{ border: `2px solid #FFFFFF` }}>
        {items.map((item, index) => (
          <Menu.Item key={index} active={activeItem === index} onClick={() => onItemClick(index)}>
            {item}
          </Menu.Item>
        ))}
      </Menu>
    </Container>
  );
};

MenuTabs.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string)
};

MenuTabs.defaultProps = {
  items: []
};

export default MenuTabs;
