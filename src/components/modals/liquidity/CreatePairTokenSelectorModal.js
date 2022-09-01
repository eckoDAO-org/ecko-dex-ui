import React, { useEffect, useState } from 'react';
import CustomButton from '../../shared/CustomButton';
import styled from 'styled-components';
import Input from '../../shared/Input';
import { checkTokenModule, getModuleList, getTokenNameFromAddress } from '../../../api/pairs';
import Label from '../../shared/Label';
import { FlexContainer } from '../../shared/FlexContainer';
import { PartialScrollableScrollSection } from '../../layout/Containers';
import { UnknownLogo } from '../../../assets';
import CustomDivider from '../../shared/CustomDivider';
import Search from '../../shared/Search';
import Loader from '../../shared/Loader';
import useWindowSize from '../../../hooks/useWindowSize';
import { theme } from '../../../styles/theme';

export const StakeModalRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  div {
    display: flex;
    align-items: center;
  }
`;

export const IconSubTitle = styled.div`
  text-align: center;
  margin-bottom: 24px;
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
    g {
      stroke: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const CreatePairTokenSelectorModal = ({ onSelectedToken, onClose }) => {
  const [tokenSelected, setTokenSelected] = useState('');
  const [tokenNameSelected, setTokenNameSelected] = useState('');
  const [width] = useWindowSize();
  const [tokenExists, setTokenExists] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    if (tokenSelected.includes('.')) {
      await fetchData();
      setLoading(false);
    }
  }, [tokenSelected]);

  const fetchData = async () => {
    setLoading(true);
    const result = await checkTokenModule(tokenSelected);
    if (result.errorMessage) {
      setTokenExists(false);
    } else {
      setTokenExists(true);
    }
  };

  const getModalText = () => {
    return `Please insert token address`;
  };

  return (
    <FlexContainer className="column" gap={16}>
      <Search
        containerStyle={{ marginBottom: width >= theme().mediaQueries.desktopPixel && 0 }}
        fluid
        placeholder="Please insert token address"
        value={tokenSelected}
        onChange={(e, { value }) => setTokenSelected(value)}
      />

      {/* <Label>Token Address</Label> */}
      <CustomDivider />
      {loading && <Loader />}
      {!loading && !tokenExists && <Label>No matching token address found</Label>}
      {tokenExists && (
        <FlexContainer
          className="flex"
          style={{ cursor: 'pointer' }}
          gap={8}
          onClick={async () => {
            if (tokenSelected) {
              await onSelectedToken(tokenSelected, getTokenNameFromAddress(tokenSelected));
            }
            if (onClose) {
              onClose();
            }
          }}
        >
          <UnknownLogo />
          <Label>{tokenSelected}</Label>
        </FlexContainer>
      )}
    </FlexContainer>
  );
};

export default CreatePairTokenSelectorModal;
