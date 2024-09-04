import jsYaml from 'js-yaml';
import {DEFAULT_ICON_URL} from './cryptoCurrencies';

const environment = process.env.REACT_APP_KDA_NETWORK_TYPE || 'mainnet';
const TOKENS_REPOS_URL = process.env.REACT_APP_TOKENS_REPOS_URL;


const normalize_token = (key, token) => ({name: token.name || key,
                                          coingeckoId: token.coingeckoId || '',
                                          tokenNameKaddexStats: token.code || key,
                                          code: token.code || key,
                                          statsId: token.code || key,
                                          icon: token.img ? TOKENS_REPOS_URL + "/" + token.img : DEFAULT_ICON_URL,
                                          color: token.color || '#FFFFFF',
                                          main: token.main || false,
                                          precision: token.precision || 12,
                                          isVerified: true})

export const loadTokens = async () => {
  try {
    const response = await fetch(TOKENS_REPOS_URL + "/tokens.yaml");
    const yamlText = await response.text();
    const data = jsYaml.load(yamlText);
    const tokenData = Object.entries(data[environment]).map(([k,v]) => [k, normalize_token(k,v)])
    return {data:tokenData, blacklist:data.blacklist}

  } catch (err) {
    console.error('Error loading tokens:', err);
    throw(err);
  }
};
