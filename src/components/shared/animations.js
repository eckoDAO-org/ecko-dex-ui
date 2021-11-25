import styled from 'styled-components/macro';

export const FadeIn = styled.div`
  animation: ${({ time = 0.5 }) => `fade-in ${time}s linear`};
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
export default {
  FadeIn
};
