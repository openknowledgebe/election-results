import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { API } from '../constants';
import okbeLogo from '../assets/img/okbe-logo.png';
import partiesLogos from '../assets/data/parties-logos.json';

import '../assets/css/candidate.css';

const Candidate = ({ match, electionData }) => {
  const [candidate, setCandidateDetail] = useState(null);

  const { year, list, type } = match.params;

  const candidateSlug = match.params.candidate;
  const candidateId = candidateSlug.split('-').pop().trim();

  useEffect(() => {
    API.getResultsPerCandidate(candidateId, type).then(setCandidateDetail);
  }, [candidateId]);

  if (electionData.length === 0 || !candidate) return <p>Loading...</p>;

  const election = electionData.find(e => e.type === type);
  console.log(electionData);

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

  let processedStations = 0;
  const totalStations = election.evolution.reduce((sum, evo) => {
    processedStations += evo.stations_processed;
    return sum + evo.stations_total;
  }, 0);

  const partyImgSrc = partiesLogos.find((p) => {
    return p.name.toLowerCase() === candidate.list.group.name.toLowerCase();
  }) || null;

  if (!candidate) return <p>Loading</p>;
  console.log({ candidate });

  const registeredBallots = election.results.count.registered_ballot;

  const numVotes = candidate.votes;
  const sumVotes = Object.keys(registeredBallots).reduce((num, key) => {
    return num + registeredBallots[key];
  }, 0);
  const percentageOfVotes = parseInt((numVotes / sumVotes) * 100, 0) || 0;

  console.log(candidate, partiesLogos);
  return (
    <div className="candidate-container">
      <header>
        <div className="party-logo-container">
          { partyImgSrc
            ? <img src={partyImgSrc} alt={`${candidate.list.name} logo`} />
            : <p>No party logo available</p>
          }
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
            <span className="vote-counter__amount__total">{numVotes}</span>
            <span className="vote-counter__amount__total-label">votes</span>
          </div>
          <div className="vote-progress">
            <strong>{percentageOfVotes}&#37;</strong> of counted votes
            <span className="vote-disclaimer">{processedStations} of {totalStations} voting stations</span>
            <div className="vote-progress__bar">
              <div className="vote-progress__bar__bar" style={{width: `${percentageOfVotes}%`}} />
            </div>
            <div className="vote-timestamp">
              <span className="vote-timestamp__indicator">at</span>&nbsp;
              {moment().format('MMM Mo YYYY HH:mm:ss')}
            </div>
          </div>
        </div>
        <div className="okbe-logo-container">
          <a href="http://openknowledge.be"><img src={okbeLogo} alt="Open Knowledge Belgium logo" /></a>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Candidate);
