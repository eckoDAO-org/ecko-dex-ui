import styled from "styled-components";

export const PartialScrollableScrollSection = styled.div`
  flex: 1;
  overflow: auto;
  margin-bottom: -10px;

  ::-webkit-scrollbar {
    display: block;
  }
`;
