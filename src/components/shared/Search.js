import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { Search as SUISearch } from 'semantic-ui-react';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { SearchGEIcon } from '../../assets';

const Container = styled.div.attrs({ icon: 'search' })`
  margin-bottom: 15px;

  border-radius: 4px;
  border: ${({ theme: { colors }, gameEditionView }) => (gameEditionView ? `2px dashed ${colors.black} ` : `1px solid ${colors.white}99 `)};
  color: ${({ gameEditionView, theme: { colors } }) => gameEditionView && colors.black};
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
    color: ${({ gameEditionView, theme: { colors } }) => gameEditionView && colors.black};
    font-family: ${({ theme: { fontFamily }, gameEditionView }) => gameEditionView && fontFamily.pressStartRegular};
  }
  .ui.input > input {
    border: none;
    color: ${({ gameEditionView, theme: { colors } }) => gameEditionView && colors.black};
    font-family: ${({ theme: { fontFamily }, gameEditionView }) => gameEditionView && fontFamily.pressStartRegular};
  }
`;

const SearchIconContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const Search = ({ fluid, containerStyle, placeholder, value, onChange }) => {
  const { gameEditionView } = useContext(GameEditionContext);
  return (
    <Container gameEditionView={gameEditionView} fluid={fluid} style={containerStyle}>
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
