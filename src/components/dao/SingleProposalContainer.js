/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Pact from 'pact-lang-api';
import { useHistory } from 'react-router-dom';
import { hasAccountVoted, readSingleProposal, vote, voteCommandToSign, votePreview } from '../../api/dao';
import { useAccountContext, useKaddexWalletContext, useNotificationContext } from '../../contexts';
import { ROUTE_DAO } from '../../router/routes';
import { PartialScrollableScrollSection } from '../layout/Containers';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import VotingPowerContainer from './VotingPowerContainer';
import { ArrowBack } from '../../assets';
import VoteResultsContainer from './VoteResultsContainer';
import AppLoader from '../shared/AppLoader';
import theme, { commonColors } from '../../styles/theme';
import { getStatusProposal } from '../../utils/dao-utils';
import Loader from '../shared/Loader';
import HtmlFormatterContainer from './HtmlFormatterContainer';
import useWindowSize from '../../hooks/useWindowSize';

const SingleProposalContainer = ({ proposal_id, accountData }) => {
  const { account } = useAccountContext();
  const notificationContext = useNotificationContext();
  const { isConnected: isKaddexWalletConnected, requestSign: kaddexWalletRequestSign } = useKaddexWalletContext();

  const history = useHistory();
  const [daoSingleProposalLoading, setDaoSingleProposalLoading] = useState(false);
  const [daoFetchDataLoading, setDaoFetchDataLoading] = useState(false);

  const [singleProposalData, setSingleProposalData] = useState({});
  const [accountVoted, setAccountVoted] = useState({});

  const fetchData = async () => {
    const readSingleProposalRes = await readSingleProposal(proposal_id);
    setSingleProposalData(readSingleProposalRes);

    const checkAccountHasVoted = await hasAccountVoted(account.account, proposal_id);
    setAccountVoted(checkAccountHasVoted);

    setDaoSingleProposalLoading(false);
  };

  useEffect(() => {
    setDaoSingleProposalLoading(true);
    fetchData();
  }, [account, daoFetchDataLoading]);

  const handleClick = async (type) => {
    console.log(account);
    const commandToSign = voteCommandToSign(type, proposal_id, account);
    let signedCommand = await getSignedCommand(commandToSign);

    const votePreviewResponse = await votePreview(signedCommand);
    console.log('votePreview -> votePreviewResponse', votePreviewResponse);

    if (votePreviewResponse?.result?.status === 'success') {
      setDaoFetchDataLoading(true);
      const res = await vote(signedCommand, notificationContext.pollingNotif);
      if (res?.listen === 'success') {
        notificationContext.showSuccessNotification(res?.data.requestKeys[0], 'Vote Success!');
        setDaoSingleProposalLoading(false);
        setDaoFetchDataLoading(false);
      } else {
        notificationContext.showErrorNotification(null, 'Vote Failed');
        setDaoFetchDataLoading(false);
        setDaoSingleProposalLoading(false);
      }
    } else {
      notificationContext.showErrorNotification(null, 'Vote Error', votePreviewResponse?.result?.error?.message);
    }
  };

  const getSignedCommand = async (commandToSign) => {
    try {
      if (isKaddexWalletConnected) {
        const res = await kaddexWalletRequestSign(commandToSign);
        return res.signedCmd;
      } else {
        const res = await Pact.wallet.sign(commandToSign);
        return res;
      }
    } catch (error) {
      return null;
    }
  };

  const ColumnLabels = ({ title, description }) => (
    <FlexContainer className="column" gap={4}>
      <Label fontSize={13} labelStyle={{ opacity: 0.7 }}>
        {title}
      </Label>
      <Label fontSize={13}>{description}</Label>
    </FlexContainer>
  );

  const [, height] = useWindowSize();
  return daoSingleProposalLoading ? (
    <AppLoader
      containerStyle={{
        height: `calc(${height}px - ${theme.header.height}px)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -35,
      }}
    />
  ) : (
    <>
      <Label fontSize={24} fontFamily="syncopate">
        <ArrowBack
          className="svg-app-color"
          style={{
            cursor: 'pointer',
            marginRight: '15px',
            justifyContent: 'center',
          }}
          onClick={() => history.push(ROUTE_DAO)}
        />
        back to proposals
      </Label>
      <FlexContainer className="row" gap={16} mobileClassName="column-reverse" mobileStyle={{ paddingBottom: 16 }}>
        <FlexContainer className="column background-fill" withGradient style={{ height: 'min-content' }} desktopStyle={{ flex: 1, maxHeight: 550 }}>
          <PartialScrollableScrollSection id="proposals-list" className="scrollbar-none" style={{ width: '100%' }}>
            <FlexContainer className="column" gap={16}>
              <FlexContainer className="justify-sb align-ce w-100">
                <Label fontSize={24}>{singleProposalData?.title}</Label>
                <Label
                  fontFamily="basier"
                  fontSize={10}
                  color={'#fff'}
                  labelStyle={{
                    backgroundColor:
                      moment(singleProposalData['start-date']?.time) <= moment() && moment(singleProposalData['end-date']?.time) >= moment()
                        ? commonColors.active
                        : commonColors.closed,
                    borderRadius: 100,
                    padding: '2px 8px',
                  }}
                >
                  {getStatusProposal(singleProposalData)}
                </Label>
              </FlexContainer>
              <FlexContainer className="justify-sb align-ce w-100" mobileClassName="grid" columns={2}>
                <ColumnLabels title="Author" description={singleProposalData?.account} />
                <ColumnLabels title="Start Date" description={moment(singleProposalData['start-date']?.time).format('LLL')} />
                <ColumnLabels title="End Date" description={moment(singleProposalData['end-date']?.time).format('LLL')} />
                <ColumnLabels title="Voting System" description="Single choice voting" />
              </FlexContainer>
              <FlexContainer className="column" gap={4}>
                <Label fontSize={13} labelStyle={{ opacity: 0.7 }}>
                  Description
                </Label>
                <HtmlFormatterContainer htmlText={singleProposalData?.description} />
              </FlexContainer>
              {!daoFetchDataLoading ? (
                <ColumnLabels
                  title="Vote Results"
                  description={
                    <VoteResultsContainer
                      onClickYes={() => handleClick('approved')}
                      onClickNo={() => handleClick('refused')}
                      proposalData={singleProposalData}
                      hasVoted={accountVoted[0]?.action ? accountVoted[0]?.action : ''}
                    />
                  }
                />
              ) : (
                <Loader />
              )}
            </FlexContainer>
          </PartialScrollableScrollSection>
        </FlexContainer>
        <FlexContainer className="column" gap={16}>
          <VotingPowerContainer accountData={accountData} />
        </FlexContainer>
      </FlexContainer>
    </>
  );
};

export default SingleProposalContainer;
