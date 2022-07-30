import styled from 'styled-components/macro';
import { FlexContainer } from './FlexContainer';

export const FadeIn = styled(FlexContainer)`
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

export const FadeOut = styled.div`
  animation: ${({ time = 0.5 }) => `fade-out ${time}s linear`};
  @keyframes fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
export default {
  FadeIn,
  FadeOut,
};
