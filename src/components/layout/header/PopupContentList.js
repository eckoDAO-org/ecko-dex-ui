import React from 'react';
import { Divider } from 'semantic-ui-react';
import styled from 'styled-components';
import HeaderItem from '../../../shared/HeaderItem';
import LightModeToggle from '../../../shared/LightModeToggle';
import theme from '../../../styles/theme';

const ListContainer = styled.div`
  border-radius: 10px;
  padding: 32px;
  min-width: 170px;
  z-index: 1;
  background: transparent;
  & > *:not(:last-child) {
    margin-bottom: 8px;
  }

  & svg {
    margin-right: 10px;
  }
`;

const CustomDivider = styled(Divider)`
  background-color: ${({ theme: { colors } }) => colors.white};
  margin: 16px 0px !important;
  border-bottom: 0px !important;
`;

const PopupContentList = ({ items, viewOtherComponents }) => {
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
            fontFamily: theme.fontFamily.regular,
          }}
        >
          {item.label}
        </HeaderItem>
      ))}
      {viewOtherComponents && (
        <>
          <CustomDivider />
          <LightModeToggle />
        </>
      )}
    </ListContainer>
  );
};

export default PopupContentList;
