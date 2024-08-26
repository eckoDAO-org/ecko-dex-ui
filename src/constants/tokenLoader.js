import jsYaml from 'js-yaml';

const TOKEN_YAML_URL = 'https://raw.githubusercontent.com/CryptoPascal31/kadena_tokens/main/tokens.yaml';

export const loadTokens = async () => {
  try {
    const response = await fetch(TOKEN_YAML_URL);
    const yamlText = await response.text();
    const tokensData = jsYaml.load(yamlText);
    return tokensData;
  } catch (error) {
    console.error('Error loading tokens:', error);
    return null;
  }
};