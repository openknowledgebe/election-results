import React, { useState, useEffect } from 'react';
import { API, ELECTION_TYPES } from '../constants';

const Candidate = ({ match }) => {
  const [candidates, setCandidates] = useState([]);

  const { year, list, party, candidate } = match.params;


  const getCandidates = async () => {
    const queue = ELECTION_TYPES.map(type => API.getCandidates(type));
    const results = await Promise.all(queue);
    return results.reduce((accumulator, candidatesPerType) => {
      return { ...accumulator, ...candidatesPerType };
    }, {});
  }

  useEffect(() => {
    getCandidates().then(setCandidates);
  }, []);

  return (
    <div>
      Overview / Site map
    </div>
  );
};

export default Candidate;
