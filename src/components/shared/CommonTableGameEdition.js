import React from 'react';
import styled from 'styled-components/macro';
import useButtonScrollEvent from '../../hooks/useButtonScrollEvent';
import { FlexContainer } from './FlexContainer';
import Label from './Label';
import { GameEditionLoader } from './Loader';

const GameEditionContainer = styled(FlexContainer)`
  padding: 24px;
  border: 2px dashed #fff;
  background: rgba(255, 255, 255, 0.05);
  & > *:not(:last-child) {
    padding-bottom: 16px;
    border-bottom: 2px dashed #fff;
  }
  & > *:not(:first-child) {
    padding-top: 16px;
  }
  & > *:first-child {
    & > *:not(:last-child) {
      margin-bottom: 4px;
    }
  }
`;

const CommonTableGameEdition = ({ id, items, loading, columns, onClick }) => {
  useButtonScrollEvent(id);

  return (
    <FlexContainer className="relative w-100" gameEditionStyle={{ overflow: 'hidden' }}>
      {loading && <GameEditionLoader style={{ position: 'absolute', zIndex: 5, left: 0 }} />}

      <GameEditionContainer id={id} gameEditionClassName="column w-100 scrollbar-none" gameEditionStyle={{ overflowY: 'auto' }}>
        {items.map((item, i) => (
          <FlexContainer
            key={i}
            className={`column ${onClick ? 'pointer' : 'default'}`}
            onClick={() => {
              if (onClick) {
                onClick(item);
              }
            }}
          >
            {columns.map((c, j) => (
              <FlexContainer key={j} className="justify-sb w-100">
                <Label geFontSize={20} geLabelStyle={{ textAlign: 'start', display: 'block' }} geColor="yellow">
                  {c?.renderName ? c.renderName({ item, column: c }) : c.geName || c.name}
                </Label>
                <Label fontSize={13} className={c?.align === 'right' ? 'justify-fe' : ''}>
                  {c.geRender ? c.geRender({ item, column: c }) : c.render({ item, column: c })}
                </Label>
              </FlexContainer>
            ))}
          </FlexContainer>
        ))}
      </GameEditionContainer>
    </FlexContainer>
  );
};

export default CommonTableGameEdition;
