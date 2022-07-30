/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Pact from 'pact-lang-api';
import { useHistory } from 'react-router-dom';
import { hasAccountVoted, readSingleProposal, voteCommandToSign, votePreview } from '../../api/dao';
import { useAccountContext, useKaddexWalletContext, useNotificationContext, usePactContext } from '../../contexts';
import { ROUTE_DAO } from '../../router/routes';
import { PartialScrollableScrollSection } from '../layout/Containers';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import VotingPowerContainer from './VotingPowerContainer';
import VoteResultsSection from './VoteResultsSection';
import { ArrowBack } from '../../assets';
import VoteProposalContainer from './VoteProposalContainer';
import AppLoader from '../shared/AppLoader';
import theme, { commonColors } from '../../styles/theme';
import { getStatusProposal } from '../../utils/dao-utils';
import Loader from '../shared/Loader';
import HtmlFormatterContainer from './HtmlFormatterContainer';
import useWindowSize from '../../hooks/useWindowSize';
import { NETWORK, CHAIN_ID } from '../../constants/contextConstants';

const SingleProposalContainer = ({ proposal_id, accountData }) => {
  const { account } = useAccountContext();
  const pact = usePactContext();
  const notificationContext = useNotificationContext();
  const { showNotification, STATUSES } = useNotificationContext();
  const { isConnected: isKaddexWalletConnected, requestSign: kaddexWalletRequestSign } = useKaddexWalletContext();

  const history = useHistory();
  const [daoSingleProposalLoading, setDaoSingleProposalLoading] = useState(false);
  const [daoFetchDataLoading, setDaoFetchDataLoading] = useState(false);

  const [singleProposalData, setSingleProposalData] = useState({});
  const [accountVoted, setAccountVoted] = useState({});

  const [, height] = useWindowSize();

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
    const commandToSign = await voteCommandToSign(
      type,
      proposal_id,
      account,
      pact.enableGasStation,
      pact.gasConfiguration.gasLimit,
      pact.gasConfiguration.gasPrice
    );
    if (!commandToSign) {
      showNotification({
        title: 'Invalid Action',
        message: `Make sure you have KDX account on chain ${CHAIN_ID}`,
        type: STATUSES.WARNING,
        autoClose: 5000,
        hideProgressBar: false,
      });
      return;
    }
    let signedCommand = await getSignedCommand(commandToSign);

    const votePreviewResponse = await votePreview(signedCommand);

    if (votePreviewResponse?.result?.status === 'success') {
      setDaoFetchDataLoading(true);
      Pact.wallet
        .sendSigned(signedCommand, NETWORK)
        .then(async (voteProposal) => {
          notificationContext.pollingNotif(voteProposal.requestKeys[0], 'Vote Pending');
          await notificationContext.transactionListen(voteProposal.requestKeys[0], 'Vote Success', 'Vote Failed');
          pact.setPolling(false);
          setDaoFetchDataLoading(false);
          setDaoSingleProposalLoading(false);
        })
        .catch((error) => {
          console.log(`~ Vote error`, error);
          pact.setPolling(false);
          notificationContext.showErrorNotification(null, 'Vote error', (error.toString && error.toString()) || 'Generic Vote error');
          setDaoFetchDataLoading(false);
          setDaoSingleProposalLoading(false);
        });
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
      <Label fontSize={24} fontFamily="syncopate" onClick={() => history.push(ROUTE_DAO)}>
        <ArrowBack
          className="svg-app-color"
          style={{
            cursor: 'pointer',
            marginRight: '15px',
            justifyContent: 'center',
          }}
        />
        back to proposals
      </Label>
      <FlexContainer className="row" gap={16} mobileClassName="column-reverse" mobileStyle={{ paddingBottom: 16 }}>
        <FlexContainer
          className="column background-fill w-100"
          withGradient
          style={{ height: 'min-content' }}
          desktopStyle={{ maxHeight: `calc(${height}px - ${theme.header.height}px - 180px)` }}
          tabletStyle={{ maxHeight: `calc(${height}px - ${theme.header.height}px - 180px)` }}
        >
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
            <FlexContainer className="justify-sb align-ce w-100" mobileClassName="grid" tabletClassName="grid" columns={2}>
              <ColumnLabels title="Author" description={singleProposalData?.account} />
              <ColumnLabels title="Start Date" description={moment(singleProposalData['start-date']?.time).format('LLL')} />
              <ColumnLabels title="End Date" description={moment(singleProposalData['end-date']?.time).format('LLL')} />
              <ColumnLabels title="Voting System" description="Single choice voting" />
            </FlexContainer>

            <FlexContainer className="column" gap={4}>
              <Label fontSize={13} labelStyle={{ opacity: 0.7 }}>
                Description
              </Label>
              <PartialScrollableScrollSection id="proposals-list" style={{ width: '100%' }}>
                <HtmlFormatterContainer htmlText={singleProposalData?.description} />
              </PartialScrollableScrollSection>
            </FlexContainer>

            {!daoFetchDataLoading ? (
              <VoteProposalContainer
                onClickYes={() => handleClick('approved')}
                onClickNo={() => handleClick('refused')}
                proposalData={singleProposalData}
                hasVoted={accountVoted[0]?.action ? accountVoted[0]?.action : ''}
              />
            ) : (
              <Loader />
            )}
          </FlexContainer>
        </FlexContainer>
        <FlexContainer className="column" gap={16}>
          <VotingPowerContainer accountData={accountData} />
          <VoteResultsSection proposalData={singleProposalData} />
        </FlexContainer>
      </FlexContainer>
    </>
  );
};

export default SingleProposalContainer;
