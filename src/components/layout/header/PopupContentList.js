import React, { useRef, useState } from 'react';
import { Divider } from 'semantic-ui-react';
import styled, { css } from 'styled-components/macro';
import { PowerIcon } from '../../../assets';
import { useAccountContext, useApplicationContext, useGameEditionContext, useModalContext } from '../../../contexts';
import HeaderItem from '../../../components/shared/HeaderItem';
import LightModeToggle from '../../../components/shared/LightModeToggle';
import { theme, commonTheme } from '../../../styles/theme';
import AccountInfo from './AccountInfo';
import AccountModal from '../../modals/kdaModals/AccountModal';
import reduceToken from '../../../utils/reduceToken';
import { reduceBalance } from '../../../utils/reduceBalance';
import useWindowSize from '../../../hooks/useWindowSize';
import GradientContainer from '../../shared/GradientContainer';
import browserDetection from '../../../utils/browserDetection';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  position: relative;
`;

const PopupContainer = styled(GradientContainer)`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  border-radius: 10px;
  background: ${({ theme: { backgroundContainer } }) => backgroundContainer};
  position: absolute;

  top: 40px;
  right: 0px;
  &.hamburger {
    left: 0px;
    right: unset;
  }

  ${({ themeMode }) => {
    if ((browserDetection() === 'BRAVE' || browserDetection() === 'FIREFOX') && themeMode === 'dark') {
      return css`
        background: ${({ theme: { colors } }) => colors.primary};
      `;
    }
  }}
`;

const ListContainer = styled.div`
  border-radius: 10px;

  z-index: 1;
  background: transparent;
  & > *:not(:last-child) {
    margin-bottom: 16px;
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

const PopupContentList = ({ items, viewOtherComponents, withLogout, PopupContentListStyle, withoutAccountInfo, icon, className }) => {
  const { account, logout } = useAccountContext();
  const { gameEditionView, openModal } = useGameEditionContext();
  const modalContext = useModalContext();
  const { themeMode } = useApplicationContext();
  const [width] = useWindowSize();

  const [showPopup, setShowPopup] = useState(false);

  const ref = useRef();
  useOnClickOutside(ref, () => setShowPopup(false));

  return (
    <Wrapper ref={ref}>
      <div
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={() => setShowPopup((prev) => !prev)}
      >
        {icon}
      </div>
      {showPopup && (
        <PopupContainer
          className={className}
          style={{ width: 'unset' }}
          backgroundColor={
            (browserDetection() === 'BRAVE' || browserDetection() === 'FIREFOX') && themeMode === 'dark' && theme('dark').colors.primary
          }
        >
          <ListContainer style={PopupContentListStyle}>
            {items.map((item, index) => (
              <HeaderItem
                className={item?.className}
                route={item?.route}
                key={index}
                onClick={() => {
                  setShowPopup(false);
                }}
                icon={item?.icon}
                link={item?.link}
                headerItemStyle={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 16,
                  fontFamily: commonTheme.fontFamily.basier,
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

            {!withoutAccountInfo && account?.account && width < commonTheme.mediaQueries.desktopPixel && (
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
                  fontFamily: commonTheme.fontFamily.basier,
                  width: 42,
                }}
              >
                <HeaderItemContent onClick={() => logout()}>
                  <PowerIcon /> Logout
                </HeaderItemContent>
              </HeaderItem>
            )}
          </ListContainer>
        </PopupContainer>
      )}
    </Wrapper>
  );
};

export default PopupContentList;
