import moment from 'moment';

export const getStatusProposal = (data) =>
  moment(data['start-date']?.time) <= moment() && moment(data['end-date']?.time) >= moment()
    ? 'active'
    : moment(data['start-date']?.time) > moment()
    ? 'not active yet'
    : 'closed';
