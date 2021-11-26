import React, { useContext } from 'react';
import styled from 'styled-components';
import { AccountContext } from '../../../contexts/AccountContext';
import CopyPopup from '../../../shared/CopyPopup';
import reduceToken from '../../../utils/reduceToken';
import { Container } from '../../layout/Containers';

const AccountIdContainer = styled.div`
  display: flex;
  align-items: center;
  font-family: ${({ gameEditionView, theme: { fontFamily } }) => (gameEditionView ? fontFamily.pressStartRegular : fontFamily.regular)};
  & > span:first-child {
    font-family: ${({ gameEditionView, theme: { fontFamily } }) => !gameEditionView && fontFamily.bold};
    margin-right: 10px;
  }
`;

const AccountModal = () => {
  const { account } = useContext(AccountContext);
  return (
    <Container>
      <span>connected with WALLET</span>

      {account?.account && (
        <AccountIdContainer>
          <span>Account ID:</span>
          <span>
            {reduceToken(account.account)} <CopyPopup textToCopy={account.account} />
          </span>
        </AccountIdContainer>
      )}
    </Container>
  );
};

export default AccountModal;
