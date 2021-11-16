import styled from 'styled-components';

export const PartialScrollableScrollSection = styled.div`
  flex: 1;
  overflow: auto;
  margin-bottom: -10px;

  ::-webkit-scrollbar {
    display: block;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
  width: 100%;
`;

export const RowContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-flow: ${({ gameEditionView }) => (gameEditionView ? 'row' : 'column')};
  margin-bottom: ${({ gameEditionView }) => (gameEditionView ? '8px' : '0px')};
`;

export const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.span`
  font-family: ${({ gameEditionView, theme: { fontFamily } }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.regular};
  color: ${({ gameEditionView, withShade, theme: { colors } }) =>
    gameEditionView ? colors.black : `${colors.white}${withShade} !important`};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '10px' : '13px')};
  text-align: ${({ gameEditionView }) => gameEditionView && 'left'};

  text-transform: capitalize;
`;

export const Value = styled.span`
  font-family: ${({ gameEditionView, theme: { fontFamily } }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.regular};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '10px' : '16px')};
  line-height: 20px;
  color: ${({ gameEditionView, withShade, theme: { colors } }) =>
    gameEditionView ? colors.black : `${colors.white}${withShade} !important`};
  text-align: ${({ gameEditionView }) => gameEditionView && 'left'};
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    margin-bottom: 5px;
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  padding: ${(gameEditionView) => (gameEditionView ? '0 10px' : 0)};
  justify-content: space-between;
  margin-bottom: 24px;
  width: 100%;
  position: ${({ gameEditionView }) => gameEditionView && 'absolute'};
  top: ${({ gameEditionView }) => gameEditionView && '10px'};
`;

export const Title = styled.span`
  font: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView
      ? `normal normal normal 16px/19px ${fontFamily.pressStartRegular}`
      : `normal normal bold 32px/57px ${fontFamily.bold}`};
  letter-spacing: 0px;
  color: ${({ gameEditionView, theme: { colors } }) =>
    gameEditionView ? colors.black : colors.white};
  text-transform: capitalize;
`;
