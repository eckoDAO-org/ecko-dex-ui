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
import CustomDropdown from '../shared/CustomDropdown';
import { getTimeByBlockchain } from '../../utils/string-utils';
import styled from 'styled-components';

const AllProposalsContainer = ({ accountData }) => {
  const history = useHistory();
  const [daoALlProposalsLoading, setDaoALlProposalsLoading] = useState(false);

  const [allProposal, setAllProposal] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [filters, setFilters] = useState({ filter: 'All', sort: 'Newest' });

  useEffect(() => {
    setDaoALlProposalsLoading(true);
    fetchData();
  }, []);

  useEffect(() => {
    proposalsFilterBy();
  }, [filters]);

  const fetchData = async () => {
    const readAllProposalsRes = await readAllProposals();
    const orderedProposals = !readAllProposalsRes.errorMessage
      ? readAllProposalsRes.sort((x, y) => moment(getTimeByBlockchain(y['creation-date'])) - moment(getTimeByBlockchain(x['creation-date'])))
      : [];
    setAllProposal(orderedProposals);
    setFilteredProposals(orderedProposals);
    setDaoALlProposalsLoading(false);
  };

  const proposalsFilterBy = () => {
    if (filters.filter === 'All') {
      let allProps = allProposal.map((proposal) => proposal);
      proposalsSortBy(allProps);
    } else if (filters.filter === 'Active') {
      let activeProposals = allProposal.filter(
        (proposal) => moment(proposal['start-date'].time) <= moment() && moment(proposal['end-date'].time) >= moment()
      );
      proposalsSortBy(activeProposals);
    } else if (filters.filter === 'Closed') {
      let closedProposals = allProposal.filter((proposal) => moment(proposal['end-date'].time) < moment());
      proposalsSortBy(closedProposals);
    }
  };

  const proposalsSortBy = (array) => {
    if (filters.sort === 'Oldest') {
      let fromOldestProposals = array.sort(
        (x, y) => moment(getTimeByBlockchain(x['creation-date'])) - moment(getTimeByBlockchain(y['creation-date']))
      );
      setFilteredProposals(fromOldestProposals);
    } else if (filters.sort === 'Newest') {
      let fromNewestProposals = array.sort(
        (x, y) => moment(getTimeByBlockchain(y['creation-date'])) - moment(getTimeByBlockchain(x['creation-date']))
      );
      setFilteredProposals(fromNewestProposals);
    }
  };

  const filterByOptions = [
    { key: 0, text: `All`, value: 'All' },
    { key: 1, text: `Active`, value: 'Active' },
    { key: 2, text: `Closed`, value: 'Closed' },
  ];
  const sortByOptions = [
    { key: 0, text: `Newest`, value: 'Newest' },
    { key: 1, text: `Oldest`, value: 'Oldest' },
  ];

  const RowProposal = styled(FlexContainer)`
    padding: 16px;
    border-radius: 20px;
    :hover {
      background-image: ${({ theme: { backgroundContainer, backgroundTableHighlight } }) =>
        `linear-gradient(to right, ${backgroundContainer}, ${backgroundTableHighlight},${backgroundContainer})`};
    }
  `;

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
      <FlexContainer className="justify-sb" mobileClassName="column">
        <Label fontSize={24} fontFamily="syncopate">
          proposals
        </Label>
        <FlexContainer gap={16} desktopStyle={{ paddingRight: 284 }} mobileStyle={{ marginTop: 16 }}>
          <CustomDropdown
            title="filter by:"
            options={filterByOptions}
            onChange={(e, { value }) => {
              setFilters((prev) => ({
                ...prev,
                filter: value,
              }));
            }}
            value={filters.filter}
          />
          <CustomDropdown
            title="sort by:"
            options={sortByOptions}
            onChange={(e, { value }) => {
              setFilters((prev) => ({
                ...prev,
                sort: value,
              }));
            }}
            value={filters.sort}
          />
        </FlexContainer>
      </FlexContainer>

      <FlexContainer className="row" gap={16} mobileClassName="column-reverse" mobileStyle={{ paddingBottom: 16 }}>
        <FlexContainer
          className="column background-fill w-100"
          withGradient
          style={{ height: 'min-content', padding: 0 }}
          desktopStyle={{ maxHeight: `calc(${height}px - ${theme.header.height}px - 184px)` }}
          tabletStyle={{ maxHeight: `calc(${height}px - ${theme.header.height}px - 184px)` }}
        >
          <PartialScrollableScrollSection id="proposals-list" className="scrollbar-none" style={{ width: '100%' }}>
            {filteredProposals.length > 0 ? (
              filteredProposals.map((data, index) => (
                <>
                  <RowProposal
                    className="column pointer"
                    key={index}
                    onClick={() => history.push(ROUTE_DAO_PROPOSAL.replace(':proposal_id', data.id))}
                  >
                    <FlexContainer className="align-ce" gap={8} style={{ marginBottom: 8 }}>
                      <Label fontFamily="basier" fontSize={13} labelStyle={{ opacity: 0.7 }}>
                        {moment(getTimeByBlockchain(data['creation-date'])).format('YYYY-MM-DD')}
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
                  </RowProposal>
                  {index < filteredProposals.length - 1 && <Divider style={{ margin: '0px 16px' }} />}
                </>
              ))
            ) : (
              <Label className="justify-ce" labelStyle={{ padding: '20px 0px' }}>
                No proposals
              </Label>
            )}
          </PartialScrollableScrollSection>
        </FlexContainer>

        <VotingPowerContainer accountData={accountData} />
      </FlexContainer>
    </>
  );
};

export default AllProposalsContainer;
