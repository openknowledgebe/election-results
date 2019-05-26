import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';
import ReactGA from 'react-ga';
import { API, ELECTION_TYPE_MAP } from '../constants';
import okbeLogo from '../assets/img/okbe-logo.png';
import twitterLogo from '../assets/img/twitter-logo.png';
import partiesLogos from '../assets/data/parties-logos.json';

import '../assets/css/candidate.css';

const Candidate = ({ location, history, match, electionData }) => {
  history.listen(loc => ReactGA.pageview(loc.pathname));
  const [candidate, setCandidateDetail] = useState(null);

  const { year, list, type } = match.params;

  const candidateSlug = match.params.candidate;
  const candidateId = candidateSlug.split('-').pop().trim();

  useEffect(() => {
    API.getResultsPerCandidate(candidateId, type).then(setCandidateDetail);
  }, [candidateId, type]);

  if (electionData.length === 0 || !candidate) return <p>Loading...</p>;

  const election = electionData.find(e => e.type === type);

  const capitalizeFirstLetter = s => s.charAt(0).toUpperCase() + s.slice(1);
  const splitName = (fullName) => {
    const parts = fullName.split(' ');
    const name = {
      first: '',
      last: ''
    };
    parts.forEach((part) => {
      // last names are capitalized
      if (part.toUpperCase() === part) name.last += `${capitalizeFirstLetter(part.toLowerCase())} `;
      else name.first += `${capitalizeFirstLetter(part.toLowerCase())} `;
    });
    return name;
  }

  const candidateName = splitName(candidate.name);
  document.title = `${candidateName.first} ${candidateName.last} | Open Knowledge Belgium`;

  const color = candidate.list.group.color;

  let processedStations = 0;
  const totalStations = election.evolution.reduce((sum, evo) => {
    processedStations += evo.stations_processed;
    return sum + evo.stations_total;
  }, 0);

  if (!candidate) return <p>Loading</p>;

  const registeredBallots = election.results.length === 0 ? 0 : election.results.count.registered_ballot;

  const numVotes = candidate.votes;
  const sumVotes = Object.keys(registeredBallots).reduce((num, key) => {
    return num + registeredBallots[key];
  }, 0);
  const percentageOfVotes = parseInt((numVotes / sumVotes) * 100, 0) || 0;

  const partyLogoSrc = partiesLogos.find((p) => {
    return p.name.toLowerCase() === candidate.list.group.name.toLowerCase();
  });

  const timestamp = moment(`${election.results.date} ${election.results.time}`, 'DD/MM/YYYY HH:mm:ss').format(('MMM Mo YYYY HH:mm:ss'));

  return (
    <div className="candidate-container">
      <header>
        <div className="party-logo-container">
          { partyLogoSrc.img
            ? <img src={partyLogoSrc.img} alt={`${candidate.list.name} logo`} />
            : <p>No party logo available</p>
          }
        </div>
        <div className="name-container" style={{ backgroundColor: `#${color}` }}>
          <h2 className="first-name">{candidateName.first}</h2>
          <h2 className="last-name">{candidateName.last}</h2>
          <h3>#{candidate.nr} {ELECTION_TYPE_MAP[type].nl}/{ELECTION_TYPE_MAP[type].fr}</h3>
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
              <span className="vote-timestamp__indicator">at</span>&nbsp;{timestamp || moment().format(('MMM Mo YYYY HH:mm:ss'))}
            </div>
          </div>
        </div>
        <div className="okbe-logo-container">
          <a href="http://openknowledge.be"><img src={okbeLogo} alt="Open Knowledge Belgium logo" /></a>
        </div>
      </div>
      <div className="card-actions">
        <Link to={`/${year}`}>&larr; View all candidates</Link>
        <a
          href={`https://twitter.com/intent/tweet?text=View real-time election results of ${candidateName.first.trim()} ${candidateName.last.trim()} at https://elections.openknowledge.be/${location.pathname} via @OpenKnowledgeBE`}
          target="_blank"
          rel="noopener noreferrer"
          className="twitter"
        >
          <span className="twitter-logo-container"><img src={twitterLogo} alt="Twitter logo" /></span> Tweet about this
        </a>
      </div>
    </div>
  );
};

export default withRouter(Candidate);
