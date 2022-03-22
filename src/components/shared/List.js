import React from 'react';
import { useApplicationContext } from '../../contexts';
import { theme } from '../../styles/theme';
import Label from './Label';

const List = ({ items, listType, paddingLeft }) => {
  const { themeMode } = useApplicationContext();
  return (
    <ul style={{ margin: 0, listStyleType: listType, paddingLeft }}>
      {items.map((item, i) => (
        <li key={i} style={{ color: theme(themeMode).colors.white }}>
          <Label>{item}</Label>
        </li>
      ))}
    </ul>
  );
};

export default List;
