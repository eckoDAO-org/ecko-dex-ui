import React from 'react';
import styled from 'styled-components/macro';

const Container = styled.div`
  display: flex;
  border-color: 'pink';
  :hover {
    opacity: 0.7;
    cursor: pointer;
  }
  & > div:first-child {
    margin-right: -16px;
  }
`;

const BalanceContainer = styled.div`
  padding: 7px 32px 7px 16px;
  /* background: rgba(205, 205, 205, 0.5); */
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  font-size: 14px;
  white-space: nowrap;
  color: ${({ theme: { colors } }) => colors.white};
  border-radius: 10px;
  border: ${({ theme: { colors } }) => `1px solid ${colors.white}`};
  opacity: 1;
  background: transparent;
  z-index: -2;
`;

const AccountContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background: ${({ theme: { colors } }) => colors.white};
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  font-size: 13px;
  color: ${({ theme: { colors } }) => colors.primary};
  border-radius: 10px;
  z-index: 2;
`;

const AccountInfo = ({ account, balance, onClick }) => {
  return (
    <Container onClick={onClick}>
      <BalanceContainer>{balance}</BalanceContainer>
      <AccountContainer>{account}</AccountContainer>
    </Container>
  );
};

export default AccountInfo;
