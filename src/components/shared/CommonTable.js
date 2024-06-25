/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FlexContainer } from './FlexContainer';
import Label from './Label';
import LogoLoader from './Loader';
import InfoPopup from './InfoPopup';
import { ArrowDown } from '../../assets';
import { extractDecimal } from '../../utils/reduceBalance';
import { Pagination } from 'semantic-ui-react';

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

  table tr:hover {
    td:not(:first-child),
    td:not(:last-child) {
      background-color: ${({ theme: { backgroundTableHighlight } }) => backgroundTableHighlight};
    }
    td:first-child {
      background-image: ${({ theme: { backgroundContainer, backgroundTableHighlight } }) =>
        `linear-gradient(to right, ${backgroundContainer}, ${backgroundTableHighlight})`};
    }
    td:last-child {
      background-image: ${({ theme: { backgroundContainer, backgroundTableHighlight } }) =>
        `linear-gradient(to right, ${backgroundTableHighlight}, ${backgroundContainer})`};
    }
  }
  .tr-sticky,
  .sticky {
    position: -webkit-sticky;
    position: sticky;
    left: -2px;
  }
  .tr-sticky:after {
    content: '';
    background: ${({ theme: { colors } }) => colors.white}66;
    display: block;
    height: 1px;
    width: 100%;
    position: absolute;
    z-index: 3;
    top: ${({ cellPadding }) => `${28 + cellPadding * 2}px`};
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
  .disabled {
    svg {
      path {
        fill: ${({ theme: { colors } }) => colors.white}99;
      }
    }
  }
`;

const Paginator = styled(Pagination)`
  &.ui.menu .item {
    color: ${({ theme: { colors } }) => colors.white};
    border-radius: 10px;
  }
  &.ui.menu {
    background: transparent;
    border: none;
    box-shadow: none;
    font-family: ${({ theme: { fontFamily } }) => fontFamily.basier};
    min-height: 0px;
    border-radius: 10px;
  }
  &.ui.pagination.menu .active.item {
    color: ${({ theme: { colors } }) => colors.primary};
    background: ${({ theme: { colors } }) => colors.white};
    border-radius: 10px;
  }
  &.ui.menu a.item:hover {
    color: ${({ theme: { colors } }) => colors.primary};
    background: ${({ theme: { colors } }) => colors.white};
    border-radius: 10px;
  }
  &.ui.pagination.menu .item {
    min-width: 0px;
    padding: 8px;
    border-radius: 10px;
  }
  &.ui.menu > .item:first-child {
    border-radius: 10px;
  }
`;

// STRUCTURE OF column prop:[]

// [{
//   name: 'APR',             -------- name column displayed
//   width: 120,              -------- width of column
//   sortBy: 'apr',           -------- (optional) attribute of items prop for which you want to sort
//   multiplier: 'multiplier'  --------(optional, works with sortBy) useful if the sort is on a multiplied value
//   render: ({ item }) =>    -------- value that you want to render
//     `${item.apr.toFixed(2)} %`
// },
//  ...
// ]

const CommonTable = ({ columns, items, actions, hasMore, loadMore, loading, onClick, wantPagination, offset = 10, cellPadding = 24 }) => {
  const [sortedItems, setSortedItems] = useState([]);
  const [sortNames, setSortNames] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let list = {};
    for (let column of columns) {
      if (column.sortBy) list[column.sortBy] = null;
    }
    setSortNames(list);

    if (items) setSortedItems(items);
  }, []);

  useEffect(() => {
    if (items?.length > 0 && wantPagination) {
      if (currentPage === 1) {
        setSortedItems(items?.slice(currentPage - 1, currentPage - 1 + offset));
      } else {
        setSortedItems(items?.slice((currentPage - 1) * offset, (currentPage - 1) * offset + offset));
      }
    } else {
      setSortedItems(items);
    }
  }, [items, currentPage]);

  const handleSort = (attribute, descending, multiplier) => {
    const itemSort = items.sort((x, y) => {
      const m = multiplier ? { y: extractDecimal(y[multiplier]), x: extractDecimal(x[multiplier]) } : { y: 1, x: 1 };
      if (descending) {
        return extractDecimal(y[attribute]) * m.y - extractDecimal(x[attribute]) * m.x;
      } else {
        return extractDecimal(x[attribute]) * m.x - extractDecimal(y[attribute]) * m.y;
      }
    });
    setSortedItems(itemSort);
  };

  const handleSortName = (attribute) => {
    const sortLabels = sortNames;
    const prevState = sortLabels[attribute];
    Object.keys(sortLabels).map((s) => (sortLabels[s] = null));
    if (prevState !== null) {
      setSortNames((prev) => ({ ...prev, [attribute]: !prevState }));
    } else {
      setSortNames((prev) => ({ ...prev, [attribute]: true }));
    }
  };

  return (
    <Wrapper withGradient className="w-100 relative hidden column background-fill" style={{ paddingTop: 0 }} cellPadding={cellPadding}>
      <FlexContainer className="w-100 x-auto">
        <table cellSpacing={0} cellPadding={cellPadding}>
          <thead>
            <tr className="tr-sticky" style={{ zIndex: 3, top: 0 }}>
              {columns?.map((c, i) => (
                <th key={i} className={i === 0 ? 'sticky' : ''} style={{ minWidth: c.width, zIndex: i === 0 ? 3 : 1 }}>
                  {typeof c.name === 'string' ? (
                    <div className="flex align-bl " style={{ minWidth: c.width }}>
                      <Label
                        fontSize={13}
                        className={`capitalize ${c?.align === 'right' ? 'justify-fe' : ''}`}
                        labelStyle={{ whiteSpace: 'nowrap', paddingTop: '6px', paddingBottom: '6px' }}
                        onClick={
                          c.sortBy
                            ? () => {
                                handleSort(c.sortBy, !sortNames[c.sortBy], c.multiplier);
                                handleSortName(c.sortBy);
                              }
                            : null
                        }
                      >
                        {c.name} {c.popup && <InfoPopup>{c.popup}</InfoPopup>}
                      </Label>
                      {c.sortBy && sortNames[c.sortBy] !== null && (
                        <ArrowDown className={`svg-app-color ${sortNames[c.sortBy] ? 'rotate-180' : ''}`} style={{ width: 10, marginLeft: 4 }} />
                      )}
                    </div>
                  ) : (
                    c.name
                  )}
                </th>
              ))}
              {actions && <th style={{ zIndex: 1 }} />}
            </tr>
          </thead>
          <tbody>
            {sortedItems?.map((item, i) => (
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
                      {c.render({ item })}
                    </Label>
                  </td>
                ))}
                {actions && (
                  <td style={{ zIndex: 1 }}>
                    <FlexContainer gap={8}>
                      {actions.map((action, i) => (
                        <FlexContainer
                          className={`${action?.disabled && action?.disabled(item) ? 'disabled' : 'pointer'} action`}
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!action.disabled || !action.disabled(item)) {
                              action.onClick(item);
                            }
                          }}
                        >
                          {action.icon(item)}
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
      {/* PAGINATIONS SECTION */}
      {wantPagination ? (
        items?.length > 0 ? (
          <FlexContainer className="row w-100 justify-sb" style={{ marginTop: 16 }}>
            <Label>{`Page ${currentPage} of ${Math.ceil(items?.length / offset)}`}</Label>
            <Paginator
              boundaryRange={0}
              defaultActivePage={1}
              ellipsisItem={null}
              firstItem={null}
              lastItem={null}
              siblingRange={2}
              totalPages={Math.ceil(items?.length / offset)}
              onPageChange={(_, data) => setCurrentPage(data.activePage)}
            />
          </FlexContainer>
        ) : (
          <FlexContainer className="w-100 justify-fs" style={{ padding: '8px 16px' }}>
            <Label fontFamily="syncopate">No row found</Label>
          </FlexContainer>
        )
      ) : null}
      {loading && <LogoLoader containerStyle={{ marginTop: 16 }} />}
    </Wrapper>
  );
};

export default CommonTable;
