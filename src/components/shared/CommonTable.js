/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FlexContainer } from './FlexContainer';
import Label from './Label';
import LogoLoader from './Loader';
import InfoPopup from './InfoPopup';
import { ArrowDown } from '../../assets';
import { extractDecimal } from '../../utils/reduceBalance';

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
    top: 64px;
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

const CommonTable = ({ columns, items, actions, hasMore, loadMore, loading, onClick }) => {
  const [sortedItems, setSortedItems] = useState([]);
  const [sortNames, setSortNames] = useState({});

  useEffect(() => {
    let list = {};
    for (let column of columns) {
      if (column.sortBy) list[column.sortBy] = null;
    }
    setSortNames(list);

    if (items) setSortedItems(items);
  }, []);

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
    <Wrapper withGradient className="w-100 relative hidden column background-fill" style={{ paddingTop: 0 }}>
      <FlexContainer className="w-100 x-auto">
        <table cellSpacing={0} cellPadding={24}>
          <thead>
            <tr className="tr-sticky" style={{ zIndex: 3, top: 0 }}>
              {columns?.map((c, i) => (
                <th key={i} className={i === 0 ? 'sticky' : ''} style={{ minWidth: c.width, zIndex: i === 0 ? 3 : 1 }}>
                  {typeof c.name === 'string' ? (
                    <div className="flex align-bl " style={{ minWidth: c.width }}>
                      <Label
                        fontSize={13}
                        className={`capitalize ${c?.align === 'right' ? 'justify-fe' : ''}`}
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
      {loading && <LogoLoader containerStyle={{ marginTop: 16 }} />}
    </Wrapper>
  );
};

export default CommonTable;
