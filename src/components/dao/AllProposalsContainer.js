/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Divider } from 'semantic-ui-react';
import moment from 'moment';
import { PartialScrollableScrollSection } from '../layout/Containers';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import theme, { commonColors } from '../../styles/theme';
import { ROUTE_DAO_PROPOSAL } from '../../router/routes';
import VotingPowerContainer from './VotingPowerContainer';
import { readAllProposals } from '../../api/dao';
import AppLoader from '../shared/AppLoader';
import { getStatusProposal } from '../../utils/dao-utils';
import HtmlFormatterContainer from './HtmlFormatterContainer';
import useWindowSize from '../../hooks/useWindowSize';

const AllProposalsContainer = ({ accountData }) => {
  const history = useHistory();
  const [daoALlProposalsLoading, setDaoALlProposalsLoading] = useState(false);

  const [allProposal, setAllProposal] = useState([]);

  const fetchData = async () => {
    const readAllProposalsRes = await readAllProposals();
    const orderedProposals = !readAllProposalsRes.errorMessage
      ? readAllProposalsRes.sort((x, y) => moment(y['start-date']?.time) - moment(x['start-date']?.time))
      : [];
    setAllProposal(orderedProposals);
    setDaoALlProposalsLoading(false);
  };

  useEffect(() => {
    setDaoALlProposalsLoading(true);
    fetchData();
  }, []);

  const [, height] = useWindowSize();
  return daoALlProposalsLoading ? (
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
        proposals
      </Label>

      <FlexContainer className="row" gap={16} mobileClassName="column-reverse" mobileStyle={{ paddingBottom: 16 }}>
        <FlexContainer className="column background-fill" withGradient style={{ height: 'min-content', maxHeight: 500, flex: 1 }}>
          <PartialScrollableScrollSection id="proposals-list" className="scrollbar-none" style={{ width: '100%' }}>
            {allProposal.length > 0 ? (
              allProposal.map((data, index) => (
                <FlexContainer
                  className="column pointer"
                  key={index}
                  onClick={() => history.push(ROUTE_DAO_PROPOSAL.replace(':proposal_id', data.id))}
                >
                  <FlexContainer className="align-ce" gap={8} style={{ marginBottom: 8 }}>
                    <Label fontFamily="basier" fontSize={13} labelStyle={{ opacity: 0.7 }}>
                      {moment(data['start-date']?.time).format('YYYY-MM-DD')}
                    </Label>
                    <Label
                      fontFamily="basier"
                      fontSize={10}
                      color={'#fff'}
                      labelStyle={{
                        backgroundColor:
                          moment(data['start-date'].time) <= moment() && moment(data['end-date'].time) >= moment()
                            ? commonColors.active
                            : commonColors.closed,
                        borderRadius: 100,
                        padding: '2px 8px',
                      }}
                    >
                      {getStatusProposal(data)}
                    </Label>
                  </FlexContainer>

                  <Label fontFamily="basier" fontSize={16} labelStyle={{ marginBottom: 4 }}>
                    {data?.title}
                  </Label>
                  <HtmlFormatterContainer htmlText={data?.description} asAString />
                  {index < allProposal.length - 1 && <Divider />}
                </FlexContainer>
              ))
            ) : (
              <Label className="justify-ce">No proposals</Label>
            )}
          </PartialScrollableScrollSection>
        </FlexContainer>

        <VotingPowerContainer accountData={accountData} />
      </FlexContainer>
    </>
  );
};

export default AllProposalsContainer;
