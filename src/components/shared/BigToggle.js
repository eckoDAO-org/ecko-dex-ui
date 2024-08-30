import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';

const Toggle = ({ initialState, onClick, disabled }) => {
  const [active, setActive] = useState(initialState);

  useEffect(() => {
    setActive(initialState);
  }, [initialState]);

  return (
    <Container
      active={!disabled && active}
      onClick={() => {
        if (!disabled) {
          setActive((prev) => !prev);
          if (onClick) {
            onClick(!active);
          }
        }
      }}
    >
      <Circle active={active} />
    </Container>
  );
};

export default Toggle;

const Container = styled.div`
  cursor: pointer;
  border: ${({ theme: { colors } }) => `1px solid ${colors.white}`};
  border-radius: 24px;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 4px;
  background-color: ${({ active, theme: { colors } }) => (active ? colors.white : 'transparent')};
  width: 48px;
`;

const Circle = styled.div`
  border-radius: 50%;
  height: 20px;
  width: 20px;
  transition: transform 0.5s;
  transform: ${({ active }) => (active ? 'translateX(calc(100% + 0px))' : 'translateX(0)')};
  background-color: ${({ active, theme: { colors } }) => (active ? colors.primary : colors.white)};
`;
