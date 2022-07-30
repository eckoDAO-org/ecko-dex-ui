import React from 'react';
import styled from 'styled-components/macro';
const Button = styled.button`
  background: ${({ theme: { colors } }) => colors.white};
  border: 2px solid ${({ theme: { colors } }) => colors.primary};
  font-weight: bold;
  color: ${({ theme: { colors } }) => colors.primary};
  border-radius: 30px;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0.6rem;
`;

const ThemeToggle = ({ theme, onClick }) => {
  return <Button onClick={onClick}>Switch Theme</Button>;
};

export default ThemeToggle;
