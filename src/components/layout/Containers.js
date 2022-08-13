import styled from 'styled-components/macro';

export const PartialScrollableScrollSection = styled.div`
  flex: 1;
  overflow: auto;

  * {
    -ms-overflow-style: auto;
  }
  ::-webkit-scrollbar {
    display: auto;
    width: 7px !important;
    height: 7px !important;
  }
  scrollbar-width: auto;
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
  justify-content: ${({ $gameEditionView }) => ($gameEditionView ? 'space-between' : 'center')};
  width: 100%;
  flex-flow: ${({ $gameEditionView }) => ($gameEditionView ? 'row' : 'column')};
  margin-bottom: ${({ $gameEditionView }) => ($gameEditionView ? '8px' : '0px')};
`;

export const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.span`
  font-family: ${({ $gameEditionView, theme: { fontFamily } }) => ($gameEditionView ? fontFamily.pixeboy : fontFamily.basier)};
  color: ${({ $gameEditionView, withShade, theme: { colors } }) => ($gameEditionView ? colors.white : `${colors.white}99 !important`)};
  font-size: ${({ $gameEditionView }) => ($gameEditionView ? '18px' : '13px')};
  text-align: ${({ $gameEditionView }) => $gameEditionView && 'left'};

  text-transform: capitalize;
`;

export const BoldLabel = styled.span`
  font-family: ${({ $gameEditionView, theme: { fontFamily } }) => ($gameEditionView ? fontFamily.pixeboy : fontFamily.syncopate)};
  color: ${({ $gameEditionView, withShade, theme: { colors } }) => ($gameEditionView ? colors.white : `${colors.white} !important`)};
  font-size: 13px;
  text-align: ${({ $gameEditionView }) => $gameEditionView && 'left'};
  text-transform: capitalize;
`;

export const Value = styled.span`
  font-family: ${({ $gameEditionView, theme: { fontFamily } }) => ($gameEditionView ? fontFamily.pixeboy : fontFamily.basier)};
  font-size: ${({ $gameEditionView }) => ($gameEditionView ? '18px' : '16px')};
  line-height: 20px;
  color: ${({ $gameEditionView, withShade, theme: { colors } }) => ($gameEditionView ? colors.white : `${colors.white} !important`)};
  text-align: ${({ $gameEditionView }) => $gameEditionView && 'left'};
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    /* margin-bottom: 5px; */
  }
  line-break: anywhere;
`;

export const TitleContainer = styled.div`
  display: flex;
  padding: ${($gameEditionView) => ($gameEditionView ? '0 10px' : 0)};
  justify-content: space-between;
  margin-bottom: 24px;
  width: 100%;
`;

export const Title = styled.span`
  font: ${({ theme: { fontFamily }, $gameEditionView }) =>
    $gameEditionView ? `normal normal normal 40px ${fontFamily.pixeboy}` : `normal normal bold 32px/57px ${fontFamily.syncopate}`};
  letter-spacing: 0px;
  color: ${({ $gameEditionView, theme: { colors } }) => colors.white};
  text-transform: ${({ $gameEditionView }) => ($gameEditionView ? `uppercase` : ` capitalize`)};
`;
