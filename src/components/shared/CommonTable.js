import React from 'react';
import styled from 'styled-components';
import { FlexContainer } from './FlexContainer';
import Label from './Label';
import LogoLoader from './Loader';
import InfoPopup from './InfoPopup';

const Wrapper = styled(FlexContainer)`
  background-color: ${({ theme: { backgroundContainer } }) => backgroundContainer};
  *::-webkit-scrollbar-corner {
    background: ${({ theme: { backgroundContainer } }) => backgroundContainer};
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
    left: 0px;
  }
  .tr-sticky:after {
    content: '';
    background: -webkit-linear-gradient(left, #ed1cb5 0%, #ffa900 12%, #39fffc 47%);
    display: block;
    height: 1px;
    width: 100%;
    position: absolute;
    z-index: 3;
    bottom: 0px;
    left: 0px;
  }
  th {
    font-weight: normal;
  }
  td,
  th {
    background-color: ${({ theme: { backgroundContainer } }) => backgroundContainer};
  }
  tbody {
    & > tr {
      border-bottom: 1px solid ${({ theme: { colors } }) => `${colors.white}66`};
    }
  }

  .action {
    svg {
      path {
        fill: ${({ theme: { colors } }) => colors.white};
      }
    }
  }
`;

const CommonTable = ({ columns, items, actions, hasMore, loadMore, loading, onClick }) => {
  return (
    <Wrapper withGradient className="w-100 relative hidden column background-fill">
      <FlexContainer className="w-100 x-auto scrollbar-y-none">
        <table cellSpacing={0} cellPadding={24}>
          <thead>
            <tr className="tr-sticky" style={{ position: 'sticky', zIndex: 3, top: 0 }}>
              {columns?.map((c, i) => (
                <th key={i} className={i === 0 ? 'sticky' : ''} style={{ minWidth: c.width, paddingTop: 0, zIndex: i === 0 ? 3 : 1 }}>
                  {typeof c.name === 'string' ? (
                    <Label fontSize={13} className={`capitalize ${c?.align === 'right' ? 'justify-fe' : ''}`}>
                      {c.name} {c.popup && <InfoPopup>{c.popup}</InfoPopup>}
                    </Label>
                  ) : (
                    c.name
                  )}
                </th>
              ))}
              {actions && <th style={{ paddingTop: 0, zIndex: 1 }} />}
            </tr>
          </thead>
          <tbody>
            {items?.map((item, i) => (
              <tr
                key={i}
                onClick={() => {
                  if (onClick) {
                    onClick(item);
                  }
                }}
                style={{ cursor: onClick ? 'pointer' : 'default' }}
              >
                {columns?.map((c, j) => (
                  <td key={j} className={j === 0 ? 'sticky' : ''} style={{ minWidth: c.width, zIndex: j === 0 ? 2 : 1 }}>
                    <Label fontSize={13} className={c?.align === 'right' ? 'justify-fe' : ''}>
                      {c.render({ item, column: c })}
                    </Label>
                  </td>
                ))}
                {actions && (
                  <td style={{ zIndex: 1 }}>
                    <FlexContainer gap={8}>
                      {actions.map((action, i) => (
                        <FlexContainer
                          className="pointer action"
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(item);
                          }}
                        >
                          {action.icon}
                        </FlexContainer>
                      ))}
                    </FlexContainer>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </FlexContainer>
      {hasMore && !loading && (
        <FlexContainer
          style={{ marginTop: 16 }}
          className="pointer justify-ce"
          onClick={async () => {
            await loadMore();
          }}
        >
          <Label fontSize={13} fontFamily="syncopate">
            LOAD MORE
          </Label>
        </FlexContainer>
      )}
      {loading && <LogoLoader containerStyle={{ marginTop: 16 }} />}
    </Wrapper>
  );
};

export default CommonTable;
