import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { usePactContext } from '../../../contexts';
import { PartialScrollableScrollSection } from '../../layout/Containers';
import CustomDivider from '../../shared/CustomDivider';
import { CryptoContainer, FlexContainer } from '../../shared/FlexContainer';
import Label from '../../shared/Label';
import Search from '../../shared/Search';
import { DEFAULT_ICON_URL } from '../../../constants/cryptoCurrencies';

const SelectPoolModal = ({ pools, onSelect, onClose }) => {
  const [searchValue, setSearchValue] = useState('');
  const { allTokens } = usePactContext();

  useEffect(() => {
  }, [searchValue]);

  const getTokenIcon = (tokenCode) => {
    const token = Object.values(allTokens).find(t => t.code === tokenCode || t.name === tokenCode);
    return token ? token.icon : null;
  };

  const filteredPools = pools.filter((pool) => 
    `${pool.token0}/${pool.token1}`.toLowerCase().includes(searchValue.replaceAll(' ', '').toLowerCase())
  );

  useEffect(() => {
  }, [filteredPools]);

  const handlePoolSelect = (pool) => {
    onSelect(pool);
    onClose(); // Close the modal after selection
  };

  return (
    <Content>
      <Search fluid placeholder="Search" value={searchValue} onChange={(e, { value }) => setSearchValue(value)} />

      <Label fontSize={13} fontFamily="syncopate">
        Pools
      </Label>
      <CustomDivider style={{ margin: '16px 0' }} />
      <PartialScrollableScrollSection
        style={{
          width: '100%',
          maxHeight: '170px',
        }}
      >
        <FlexContainer className="column" gap={16}>
          {filteredPools.map((pool, i) => (
            <div key={i} className="pointer flex align-ce" onClick={() => handlePoolSelect(pool)}>
              <CryptoContainer size={22} style={{ zIndex: 2 }}>
                <img
                  src={getTokenIcon(pool.token0)}
                  alt={pool.token0}
                  style={{ width: 20, height: 20 }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_ICON_URL;
                  }}
                />
              </CryptoContainer>
              <CryptoContainer size={22} style={{ marginLeft: -12, zIndex: 1 }}>
                <img
                  src={getTokenIcon(pool.token1)}
                  alt={pool.token1}
                  style={{ width: 20, height: 20 }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_ICON_URL;
                  }}
                />
              </CryptoContainer>
              <Label fontSize={13}>
                {pool.token0}/{pool.token1}
              </Label>
            </div>
          ))}
        </FlexContainer>
      </PartialScrollableScrollSection>
    </Content>
  );
};

export default SelectPoolModal;

const Content = styled.div`
  display: flex;
  flex-flow: column;
  .close-icon {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }

  input::placeholder {
    color: ${({ theme: { colors } }) => colors.white} !important;
  }
`;