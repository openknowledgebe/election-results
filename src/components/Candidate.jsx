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
  console.log(type);
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
      if (part.toUpperCase() === part) name.lastName += `${capitalizeFirstLetter(part.toLowerCase())} `;
      else name.firstName += `${capitalizeFirstLetter(part.toLowerCase())} `;
    });
    return name;
  }


  const candidateName = splitName(candidate.name);
  const color = candidate.list.group.color;

  // TODO populate
  const numVotes = 1000;
  return (
    <div className="candidate-container">
      <header>
        <div className="logo-container">
        </div>
        <div className="name-container" style={{ backgroundColor: `#${color}` }}>
          <h2 className="first-name">{candidateName.firstName}</h2>
          <h2 className="last-name">{candidateName.lastName}</h2>
          <h3>#{candidate.nr}</h3>
        </div>
      </header>
      <div className="vote-wrapper">
        <div className="vote-counter">
          <div className="vote-counter__amount">
            <span className="vote-counter__amount__total">1000</span>
            <span className="vote-counter__amount__total-label">stemmen</span>
          </div>
          <div className="vote-progress">
            &#37; of votes counted
            <span className="vote-disclaimer">x of x voting stations</span>
            <div className="vote-progress__bar">

            </div>
            <div className="vote-timestamp">
              <span className="vote-timestamp__indicator">at</span> {new Date(new Date()).toDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Candidate);
