/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Divider } from 'semantic-ui-react';
import moment from 'moment';
import { PartialScrollableScrollSection } from '../layout/Containers';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import { commonColors } from '../../styles/theme';
import { ROUTE_DAO_PROPOSAL } from '../../router/routes';
import VotingPowerContainer from './VotingPowerContainer';
import { readAllProposals } from '../../api/dao';
import AppLoader from '../shared/AppLoader';

const AllProposalsContainer = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [allProposal, setAllProposal] = useState([]);

  const fetchData = async () => {
    const readAllProposalsRes = await readAllProposals();
    setAllProposal(readAllProposalsRes);

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  return loading ? (
    <AppLoader containerStyle={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
  ) : (
    <>
      <Label fontSize={24} fontFamily="syncopate">
        proposals
      </Label>

      <FlexContainer className="row" gap={16} mobileClassName="column">
        <FlexContainer className="column" withGradient style={{ height: 'min-content', maxHeight: 500, flex: 1 }}>
          <PartialScrollableScrollSection id="proposals-list" className="scrollbar-none" style={{ width: '100%' }}>
            {allProposal.map((data, index) => (
              <FlexContainer className="column pointer" key={index} onClick={() => history.push(ROUTE_DAO_PROPOSAL.replace(':proposal_id', data.id))}>
                <FlexContainer className="align-ce" gap={8} style={{ marginBottom: 8 }}>
                  <Label fontFamily="basier" fontSize={13} labelStyle={{ opacity: 0.7 }}>
                    {moment(data['creation-date']).format('YYYY-MM-DD')}
                  </Label>
                  <Label
                    fontFamily="basier"
                    fontSize={10}
                    labelStyle={{
                      backgroundColor: data.status === 'active' ? commonColors.active : commonColors.closed,
                      borderRadius: 100,
                      padding: '2px 8px',
                    }}
                  >
                    {data?.status}
                  </Label>
                </FlexContainer>

                <Label fontFamily="basier" fontSize={16} labelStyle={{ marginBottom: 4 }}>
                  {data?.title}
                </Label>
                <Label fontFamily="basier" fontSize={13} labelStyle={{ marginBottom: 16 }}>
                  {data?.description}
                </Label>

                {index < allProposal.length - 1 && <Divider />}
              </FlexContainer>
            ))}
          </PartialScrollableScrollSection>
        </FlexContainer>

        <VotingPowerContainer />
      </FlexContainer>
    </>
  );
};

export default AllProposalsContainer;
