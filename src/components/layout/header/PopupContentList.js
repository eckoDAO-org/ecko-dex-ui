import React from 'react';
import { Divider } from 'semantic-ui-react';
import styled from 'styled-components';
import { PowerIcon } from '../../../assets';
import { useAccountContext } from '../../../contexts';
import HeaderItem from '../../../shared/HeaderItem';
import LightModeToggle from '../../../shared/LightModeToggle';
import theme from '../../../styles/theme';

const ListContainer = styled.div`
  border-radius: 10px;
  padding: 32px;
  z-index: 1;
  background: transparent;
  & > *:not(:last-child) {
    margin-bottom: 8px;
  }

  & svg {
    margin-right: 10px;
    width: 20px;
    height: 20px;
  }
`;

const CustomDivider = styled(Divider)`
  background-color: ${({ theme: { colors } }) => colors.white};
  margin: 16px 0px !important;
  border-bottom: 0px !important;
`;

const HeaderItemContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContentList = ({ items, viewOtherComponents, withLogout, PopupContentListStyle }) => {
  const { account, logout } = useAccountContext();
  return (
    <ListContainer style={PopupContentListStyle}>
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
            width: 42,
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
      {account.account && withLogout && (
        <HeaderItem
          headerItemStyle={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 16,
            fontFamily: theme.fontFamily.regular,
            width: 42,
            marginTop: 16,
          }}
        >
          <HeaderItemContent onClick={() => logout()}>
            <PowerIcon /> Logout
          </HeaderItemContent>
        </HeaderItem>
      )}
    </ListContainer>
  );
};

export default PopupContentList;
