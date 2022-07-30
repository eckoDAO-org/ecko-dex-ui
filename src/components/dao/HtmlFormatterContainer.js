import React from 'react';
import styled from 'styled-components';
import useWindowSize from '../../hooks/useWindowSize';
import Label from '../shared/Label';

const HtmlContainer = styled.div`
  color: ${({ theme: { colors } }) => colors.white};
  div {
    max-height: ${({ height, theme }) => `calc(${height}px - ${theme.header.height}px - 382px)`};
    color: ${({ theme: { colors } }) => colors.white};
  }
`;

const HtmlFormatterContainer = ({ htmlText, asAString }) => {
  const [, height] = useWindowSize();
  //function that return the html code without tags.
  //It's used for previews description in AllProposalContainer
  const removeHtmlTagbyString = (html) => {
    const maxNumberCharacters = 200;
    var div = document.createElement('div');
    div.innerHTML = html;
    //return a string with max 100 chars
    return (
      `${div.textContent.substring(0, maxNumberCharacters) || div.innerText.substring(0, maxNumberCharacters)} ${
        div.textContent.length >= maxNumberCharacters || div.innerText.length >= maxNumberCharacters ? '...' : ''
      }` || ''
    );
  };
  //if is a string return a Label component, else return the HTML formatter
  return asAString ? (
    <Label>{removeHtmlTagbyString(htmlText)}</Label>
  ) : (
    <HtmlContainer height={height} id="html-formatter" dangerouslySetInnerHTML={{ __html: htmlText }} />
  );
};

export default HtmlFormatterContainer;
