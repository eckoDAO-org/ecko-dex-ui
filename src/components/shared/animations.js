import styled from 'styled-components/macro';

export const FadeIn = styled.div`
  animation: fade-in 0.5s linear;
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
  FadeIn,
};
