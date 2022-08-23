import React, { useEffect, useState } from 'react';
import CustomButton from '../../shared/CustomButton';
import styled from 'styled-components';
import Input from '../../shared/Input';
import { checkTokenModule, getTokenNameFromAddress } from '../../../api/pairs';
import Label from '../../shared/Label';
import { FlexContainer } from '../../shared/FlexContainer';

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

  const [tokenExists, setTokenExists] = useState(false);

  useEffect(() => {
    if (tokenSelected.includes('.')) {
      fetchData();
    }
  }, [tokenSelected]);

  const fetchData = async () => {
    const result = await checkTokenModule(tokenSelected);
    console.log('🚀 log --> result', result);
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
      <Input
        fontSize={14}
        placeholder="Please insert token address"
        value={tokenSelected}
        onChange={(e, { value }) => {
          setTokenSelected(value);
        }}
      />
      <Label>{tokenExists ? 'token address found' : 'token address not found'}</Label>

      {tokenExists && (
        <CustomButton
          type="gradient"
          onClick={async () => {
            if (tokenSelected) {
              await onSelectedToken(tokenSelected, getTokenNameFromAddress(tokenSelected));
            }
            if (onClose) {
              onClose();
            }
          }}
        >
          CONFIRM
        </CustomButton>
      )}
    </FlexContainer>
  );
};

export default CreatePairTokenSelectorModal;
