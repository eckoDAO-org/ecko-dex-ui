import moment from 'moment';

export const getStatusProposal = (data) =>
  moment(data['start-date']?.time) <= moment() && moment(data['end-date']?.time) >= moment()
    ? 'Active'
    : moment(data['start-date']?.time) > moment()
    ? 'Not active yet'
    : 'Closed';
