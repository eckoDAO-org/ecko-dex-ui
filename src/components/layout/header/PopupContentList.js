import React from 'react';
import { Divider } from 'semantic-ui-react';
import styled from 'styled-components/macro';
import { PowerIcon } from '../../../assets';
import { useAccountContext, useGameEditionContext, useModalContext } from '../../../contexts';
import HeaderItem from '../../../components/shared/HeaderItem';
import LightModeToggle from '../../../components/shared/LightModeToggle';
import theme, { commonTheme } from '../../../styles/theme';
import AccountInfo from './AccountInfo';
import AccountModal from '../../modals/kdaModals/AccountModal';
import reduceToken from '../../../utils/reduceToken';
import { reduceBalance } from '../../../utils/reduceBalance';
import useWindowSize from '../../../hooks/useWindowSize';

const ListContainer = styled.div`
  border-radius: 10px;
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
  const { gameEditionView, openModal } = useGameEditionContext();
  const modalContext = useModalContext();
  const [width] = useWindowSize();
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
          <LightModeToggle style={{ justifyContent: 'flex-start' }} />
        </>
      )}

      {account?.account && width < commonTheme.mediaQueries.desktopPixel && (
        <AccountInfo
          onClick={() => {
            if (gameEditionView) {
              return openModal({
                title: 'Account',
                content: <AccountModal />,
              });
            } else {
              modalContext.openModal({
                title: 'Account',
                content: <AccountModal />,
              });
            }
          }}
          account={account.account ? `${reduceToken(account.account)}` : 'KDA'}
          balance={account.account ? `${reduceBalance(account.balance)} KDA` : ''}
        />
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
