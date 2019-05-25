import React from 'react';
import { withRouter } from 'react-router-dom';

const Candidate = ({ match }) => {
  const { year, list, party, candidate } = match.params;

  return (
    <div>
      Overview / Site map
    </div>
  );
};

export default withRouter(Candidate);
