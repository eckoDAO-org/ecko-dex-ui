import React from 'react';
import styled from 'styled-components';
import { FlexContainer } from './FlexContainer';
import Label from './Label';

const Wrapper = styled(FlexContainer)`
  background-color: ${({ theme: { backgroundBody } }) => backgroundBody};
  *::-webkit-scrollbar-corner {
    background: ${({ theme: { backgroundBody } }) => backgroundBody};
  }

  table {
    border-collapse: collapse;
    border-spacing: 0px;
    width: 100%;
    position: relative;
    overflow: auto;
  }
  .sticky {
    position: -webkit-sticky;
    position: sticky;
    left: 2px;
    z-index: 2;
  }
  .tr-sticky:after {
    content: '';
    background: -webkit-linear-gradient(left, #ed1cb5 0%, #ffa900 12%, #39fffc 47%);
    display: block;
    height: 1px;
    width: 100%;
    position: absolute;
    z-index: 10;
    bottom: 0px;
    left: 0px;
  }
  td,
  th {
    background-color: ${({ theme: { backgroundBody } }) => backgroundBody};
  }
  tbody {
    & > tr:not(:last-child) {
      border-bottom: 1px solid ${({ theme: { colors } }) => `${colors.primary}99`};
    }
  }
`;

const Table = ({ columns, items }) => {
  console.log('items', items);
  console.log('columns', columns);
  return (
    <Wrapper withGradient className="w-100 relative hidden" style={{ padding: 0 }}>
      <FlexContainer className="w-100 x-auto">
        <table cellSpacing={0} cellPadding={16}>
          <thead>
            <tr className="tr-sticky" style={{ position: 'sticky', zIndex: 3, top: 2 }}>
              {columns.map((c, i) => (
                <th colSpan={1} key={i} className={i === 0 ? 'sticky' : ''} style={{ minWidth: c.width }}>
                  {typeof c.name === 'string' ? <Label className="capitalize">{c.name}</Label> : c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                {columns.map((c, j) => (
                  <td key={j} className={j === 0 ? 'sticky' : ''} style={{ minWidth: c.width }}>
                    <Label> {c.render({ item, column: c })}</Label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </FlexContainer>
      {/* <FlexContainer className="column relative" style={{ flex: 1, overflow: 'auto' }}>
        <FlexContainer>
          {columns.map((c, i) => (
            <FlexContainer key={i} className={i === 0 ? 'sticky' : ''} style={{ flex: 1, padding: 16, minWidth: c.width + 32 }}>
              <Label>{c.name}</Label>
            </FlexContainer>
          ))}
        </FlexContainer>
        <FlexContainer className="column">
          {items.map((item, i) => (
            <FlexContainer key={i}>
              {columns.map((c, j) => (
                <FlexContainer key={j} className={j === 0 ? 'sticky' : ''} style={{ flex: 1, padding: 16, minWidth: c.width + 32 }}>
                  <Label> {c.render({ item, column: c })}</Label>
                </FlexContainer>
              ))}
            </FlexContainer>
          ))}
        </FlexContainer>
      </FlexContainer> */}

      {/* <table class="table" style={{ flex: 1 }}>
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} style={{ flex: 1 }}>
                {c.name}
              </th>
            ))}
        
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              {columns.map((c, j) => (
                <td key={j} style={{ flex: 1 }}>
                  {c.render({ item, column: c })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table> */}
    </Wrapper>
  );
};

export default Table;

// {/* left side */}
//   {/* <FlexContainer className="column">
//     {/* header */}
//     <FlexContainer style={{ padding: 16 }}>
//       <Label>{columns[0].name}</Label>
//     </FlexContainer>
//     {/* values */}
//     <FlexContainer className="column">
//       {items.map((item, i) => (
//         <FlexContainer key={i} style={{ padding: 16 }}>
//           {columns[0].render({ item, column: columns[0] })}
//         </FlexContainer>
//       ))}
//     </FlexContainer>
//   </FlexContainer>

//   {/* right side */}
//   <FlexContainer className="column">
//     {/* header */}
//     <FlexContainer style={{ padding: 16 }}>
//       {columns.slice(1).map((c, i) => (
//         <Label key={i}>{c.name}</Label>
//       ))}
//     </FlexContainer>
//     {/* values */}
//     <FlexContainer className="column">
//       {items.slice(1).map((item, i) => (
//         <FlexContainer key={i} style={{ padding: 16 }}>
//           {columns.slice(1).map((c, j) => (
//             <FlexContainer key={j}>{c.render({ item, column: c })}</FlexContainer>
//           ))}
//         </FlexContainer>
//       ))}
//     </FlexContainer>
//   </FlexContainer> */}
