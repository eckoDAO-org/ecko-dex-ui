import React from 'react';
import styled from 'styled-components/macro';
import { useApplicationContext } from '../../contexts';
import { theme } from '../../styles/theme';
import Label from './Label';

const ListContainer = styled.ul`
  & > li:not(:last-child) {
    margin-bottom: 8px;
  }
`;

const List = ({ items, listType, paddingLeft }) => {
  const { themeMode } = useApplicationContext();
  return (
    <ListContainer style={{ margin: 0, listStyleType: listType, paddingLeft }}>
      {items.map((item, i) => (
        <li key={i} style={{ color: theme(themeMode).colors.white }}>
          <Label>{item}</Label>
        </li>
      ))}
    </ListContainer>
  );
};

export default List;
