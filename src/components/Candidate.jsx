import React from 'react';
import { API } from '../constants';

const Candidate = ({ match }) => {
  const { year, list, party, candidate } = match.params;

  API.getCandidates()
    .then(console.log);

  return (
    <div>
      Overview / Site map
    </div>
  );
};

export default Candidate;
