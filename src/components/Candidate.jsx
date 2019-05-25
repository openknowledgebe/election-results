import React from 'react';
import { withRouter } from 'react-router-dom';

import '../assets/css/candidate.css';

const Candidate = ({ match, electionData }) => {
  if (electionData.length === 0) return <p>Loading...</p>;
  console.log(electionData);
  const { year, list, type } = match.params;

  const candidateSlug = match.params.candidate;
  const candidateId = candidateSlug.split('-').pop().trim();

  const election = electionData.find(e => e.type === type);
  const candidate = election.candidates.find(c => c.id === parseInt(candidateId));

  console.log(candidate);

  const capitalizeFirstLetter = s => s.charAt(0).toUpperCase() + s.slice(1);
  const splitName = (fullName) => {
    const parts = fullName.split(' ');
    const name = {
      firstName: '',
      lastName: ''
    };
    parts.forEach((part) => {
      // last names are capitalized
      if (part.toUpperCase() === part) name.lastName += capitalizeFirstLetter(part.toLowerCase());
      else name.firstName += capitalizeFirstLetter(part.toLowerCase());
    });
    return name;
  }

  const candidateName = splitName(candidate.name);

  return (
    <div className="candidate-container">
      <header>
        <h2 className="first-name">{candidateName.firstName}</h2>
        <h2 className="last-name">{candidateName.lastName}</h2>

      </header>
    </div>
  );
};

export default withRouter(Candidate);
