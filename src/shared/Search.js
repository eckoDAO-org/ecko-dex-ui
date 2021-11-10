import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { Search as SUISearch } from 'semantic-ui-react';
import theme from '../styles/theme';
import { GameEditionContext } from '../contexts/GameEditionContext';
import { SearchGEIcon } from '../assets';

const Container = styled.div.attrs({ icon: 'search' })`
  .ui.search .prompt {
    border-radius: 4px;
  }
  .ui.input {
    width: ${({ fluid }) => (fluid ? '100%' : 'auto')};
    color: #ffffff;
  }
  .ui.input > input:active,
  .ui.input > input:focus {
    color: ${({ gameEditionView }) => gameEditionView && theme.colors.black};
    font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
      gameEditionView && fontFamily.pressStartRegular};
  }
  .ui.input > input {
    border: none;
    color: ${({ gameEditionView }) => gameEditionView && theme.colors.black};
    font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
      gameEditionView && fontFamily.pressStartRegular};
  }
`;

const SearchIconContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
`;

const Search = ({ fluid, containerStyle, placeholder, value, onChange }) => {
  const { gameEditionView } = useContext(GameEditionContext);
  return (
    <Container
      gameEditionView={gameEditionView}
      fluid={fluid}
      style={containerStyle}
    >
      <SUISearch
        fluid
        open={false}
        icon={
          gameEditionView ? (
            <SearchIconContainer>
              <SearchGEIcon />
            </SearchIconContainer>
          ) : (
            'search'
          )
        }
        placeholder={placeholder}
        value={value}
        onSearchChange={onChange}
      />
    </Container>
  );
};

export default Search;
