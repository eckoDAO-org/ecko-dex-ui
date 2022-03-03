import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import FormContainer from '../../components/shared/FormContainer';
import Input from '../../components/shared/Input';
import TokenSelector from '../../components/shared/TokenSelector';
import { PactContext } from '../../contexts/PactContext';
import { reduceBalance } from '../../utils/reduceBalance';
import { ReactComponent as ArrowBack } from '../../assets/images/shared/arrow-back.svg';
import theme from '../../styles/theme';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  width: 100%;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  width: 100%;
`;

const Title = styled.span`
  font: normal normal bold 32px/57px Montserrat;
  letter-spacing: 0px;
  color: #ffffff;
  text-transform: capitalize;
`;

const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0px;
  flex-flow: row;
  width: 100%;
`;

const RowContainer2 = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: column;
`;

const Label = styled.span`
  font: normal normal normal 14px/15px ${theme.fontFamily.basier};
  color: #ffffff;
  text-transform: capitalize;
`;

const Value = styled.span`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.syncopate};
  font-size: 16px;
  line-height: 20px;
  color: #ffffff;
`;

const PreviewContainer = (props) => {
  const pact = useContext(PactContext);
  const { fromValues, toValues, liquidityView } = props;

  return (
    <Container>
      <TokenSelector />
      <TitleContainer>
        <Title style={{ fontFamily: theme.fontFamily.basier }}>
          <ArrowBack
            style={{
              cursor: 'pointer',
              color: '#FFFFFF',
              marginRight: '15px',
              justifyContent: 'center',
            }}
            onClick={() => props.closeLiquidity()}
          />
          Preview Successful!
        </Title>
      </TitleContainer>

      <FormContainer title="Transaction Details">
        <Input topLeftLabel="Deposit Desired" numberOnly />
        <Input topLeftLabel="Deposit Desired" numberOnly />
      </FormContainer>

      {liquidityView === 'Add Liquidity' ? (
        <ResultContainer>
          <RowContainer2>
            <Label>{`1 ${fromValues?.coin}`}</Label>
            <Value>{`${reduceBalance(1 / pact.ratio)} ${toValues?.coin}`}</Value>
          </RowContainer2>
          <RowContainer2>
            <Label>{`1 ${toValues?.coin} `}</Label>
            <Value>{`${reduceBalance(pact.ratio)} ${fromValues?.coin}`}</Value>
          </RowContainer2>
          <RowContainer2>
            <Label>Share of Pool</Label>
            <Value>{(pact.share(fromValues?.amount) * 100).toPrecision(4)} %</Value>
          </RowContainer2>
        </ResultContainer>
      ) : (
        ''
      )}
    </Container>
  );
};

export default PreviewContainer;
