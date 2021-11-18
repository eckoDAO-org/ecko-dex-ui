import React from 'react';
import styled from 'styled-components';
import HeaderItem from '../../../shared/HeaderItem';
import theme from '../../../styles/theme';

const ListContainer = styled.div`
  border-radius: 10px;
  padding: 8px;
  z-index: 1;
  background: transparent;

  & svg {
    margin-right: 10px;
  }
`;

const PopupContentList = ({ items }) => {
  return (
    <ListContainer>
      {items.map((item, index) => (
        <HeaderItem
          className={item?.className}
          route={item?.route}
          key={index}
          onClick={item?.onClick}
          icon={item?.icon}
          link={item?.link}
          headerItemStyle={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 16,
            marginBottom: 9,
            fontFamily: theme.fontFamily.regular,
          }}
        >
          {item.label}
        </HeaderItem>
      ))}
    </ListContainer>
  );
};

export default PopupContentList;
