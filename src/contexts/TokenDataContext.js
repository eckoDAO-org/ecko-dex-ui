import React, { createContext, useState, useContext, useEffect } from 'react';
import { initializeTokenData, tokenData, pairsData } from '../constants/cryptoCurrencies';

const TokenDataContext = createContext();

export const useTokenData = () => useContext(TokenDataContext);

export const TokenDataProvider = ({ children }) => {
  const [tokens, setTokens] = useState(tokenData);
  const [pairs, setPairs] = useState(pairsData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTokenData = async (retryCount = 3) => {
    try {
      setIsLoading(true);
      await initializeTokenData();
      setTokens(tokenData);
      setPairs(pairsData);
      setIsLoading(false);
      
      // Cache the data
      localStorage.setItem('cachedTokenData', JSON.stringify(tokenData));
      localStorage.setItem('cachedPairsData', JSON.stringify(pairsData));
    } catch (err) {
      console.error('Failed to load token data:', err);
      setError(err);
      if (retryCount > 0) {
        console.log(`Retrying... (${retryCount} attempts left)`);
        setTimeout(() => loadTokenData(retryCount - 1), 2000);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // Try to load cached data first
    const cachedTokenData = JSON.parse(localStorage.getItem('cachedTokenData'));
    const cachedPairsData = JSON.parse(localStorage.getItem('cachedPairsData'));
    console.log("cachedTokenData", cachedTokenData)
    if (cachedTokenData && cachedPairsData) {
      setTokens(cachedTokenData);
      setPairs(cachedPairsData);
      setIsLoading(false);
    }
    
    // Then load fresh data
    loadTokenData();
  }, []);

  return (
    <TokenDataContext.Provider value={{ 
      tokenData: tokens, 
      pairsData: pairs, 
      isLoading, 
      error, 
      reloadTokenData: loadTokenData 
    }}>
      {children}
    </TokenDataContext.Provider>
  );
};