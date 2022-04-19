/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FlexContainer } from '../components/shared/FlexContainer';
import AllProposalsContainer from '../components/dao/AllProposalsContainer';
import SingleProposalContainer from '../components/dao/SingleProposalContainer';
import { useAccountContext } from '../contexts';
import { getAccountData } from '../api/dao';
import theme from '../styles/theme';

const DaoContainer = () => {
  const { proposal_id } = useParams();
  const { account } = useAccountContext();

  const [, setLoading] = useState(false);
  const [accountData, setAccountData] = useState({});

  const fetchData = async () => {
    const getAccountDataRes = await getAccountData(account.account);
    setAccountData(getAccountDataRes);

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [account]);

  return (
    <FlexContainer
      className="column h-100 w-100"
      gap={16}
      style={{ paddingTop: 35 }}
      desktopStyle={{ padding: `35px ${theme.layout.desktopPadding}px` }}
    >
      {proposal_id ? (
        <SingleProposalContainer proposal_id={proposal_id} accountData={accountData} />
      ) : (
        <AllProposalsContainer accountData={accountData} />
      )}
    </FlexContainer>
  );
};

export default DaoContainer;
