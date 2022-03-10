import React, { useRef, useState } from 'react';
import { Divider } from 'semantic-ui-react';
import styled, { css } from 'styled-components/macro';
import useWindowSize from '../../../hooks/useWindowSize';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
import { useAccountContext, useGameEditionContext, useModalContext } from '../../../contexts';
import { PowerIcon } from '../../../assets';
import HeaderItem from '../../../components/shared/HeaderItem';
import LightModeToggle from '../../../components/shared/LightModeToggle';
import AccountInfo from './AccountInfo';
import AccountModal from '../../modals/kdaModals/AccountModal';
import reduceToken from '../../../utils/reduceToken';
import { reduceBalance } from '../../../utils/reduceBalance';
import browserDetection from '../../../utils/browserDetection';
import { FlexContainer } from '../../shared/FlexContainer';
import Label from '../../shared/Label';
import { commonTheme } from '../../../styles/theme';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  position: relative;
`;

const PopupContainer = styled(FlexContainer)`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  border-radius: 10px;
  background: ${({ theme: { backgroundContainer } }) => backgroundContainer};
  position: absolute;
  z-index: 5;
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

const PopupContentList = ({ items, viewOtherComponents, withLogout, PopupContentListStyle, withoutAccountInfo, icon, className }) => {
  const { account, logout } = useAccountContext();
  const { gameEditionView, openModal } = useGameEditionContext();
  const modalContext = useModalContext();
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
        <PopupContainer outOfGameEdition withGradient className={className} style={{ width: 'unset' }}>
          <ListContainer style={PopupContentListStyle}>
            {items.map((item, index) => (
              <HeaderItem
                key={index}
                disableUnderline
                item={item}
                onClick={() => {
                  setShowPopup(false);
                }}
                headerItemStyle={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 16,
                  fontFamily: commonTheme.fontFamily.basier,
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
              <FlexContainer className="align-ce pointer" onClick={() => logout()}>
                <PowerIcon /> <Label>Logout</Label>
              </FlexContainer>
            )}
          </ListContainer>
        </PopupContainer>
      )}
    </Wrapper>
  );
};

export default PopupContentList;
