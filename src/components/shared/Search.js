import React from 'react';
import styled from 'styled-components/macro';
import { Search as SUISearch } from 'semantic-ui-react';
import { useGameEditionContext } from '../../contexts';
import { SearchIcon } from '../../assets';

const Container = styled.div.attrs({ icon: 'search' })`
  margin-bottom: 15px;
  width: 100%;
  border-radius: 4px;
  border: ${({ theme: { colors }, gameEditionView }) => !gameEditionView && `1px solid ${colors.white}66 `};
  color: ${({ gameEditionView, theme: { colors } }) => gameEditionView && `${colors.white}`};
  background: ${({ gameEditionView, theme: { colors } }) => gameEditionView && 'rgba(132, 127, 168, 0.34)'};
  border-radius: ${({ gameEditionView, theme: { colors } }) => gameEditionView && '40px'};
  .ui.search .prompt {
    border-radius: 4px;
    color: ${({ theme: { colors } }) => colors.white};
  }
  .ui.input {
    width: ${({ fluid }) => (fluid ? '100%' : 'auto')};
    color: ${({ theme: { colors } }) => colors.white};
  }
  .ui.input > input:active,
  .ui.input > input:focus {
    color: ${({ gameEditionView, theme: { colors } }) => gameEditionView && `${colors.white}`};
  }
  .ui.input > input {
    border: none;
    color: ${({ gameEditionView, theme: { colors } }) => gameEditionView && `${colors.white}`};
  }
`;

const SearchIconContainer = styled.div`
  width: 100%;
  margin-top: 4px;
  padding-right: 2px;
  svg {
    path {
      fill: ${({ theme: { colors } }) => `${colors.white}66`};
    }
  }
`;

const Search = ({ fluid, iconFirst, containerStyle, placeholder, value, onChange }) => {
  const { gameEditionView } = useGameEditionContext();
  return (
    <Container className={iconFirst && 'flex align-ce'} gameEditionView={gameEditionView} fluid={fluid} style={containerStyle}>
      {iconFirst && (
        <SearchIconContainer>
          <SearchIcon className={value && 'svg-app-color'} />
        </SearchIconContainer>
      )}
      <SUISearch fluid open={false} icon={!iconFirst && 'search'} placeholder={placeholder} value={value} onSearchChange={onChange} />
    </Container>
  );
};

export default Search;
