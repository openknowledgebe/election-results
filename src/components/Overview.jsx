import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import ReactGA from 'react-ga';
import { ELECTION_TYPE_MAP } from '../constants';

import '../assets/css/overview.css';

const Overview = ({ match, electionData, history }) => {
  history.listen(location => ReactGA.pageview(location.pathname));

  const [searches, setSearchState] = useState({});
  const { year } = match.params;

  if (electionData.length === 0) return <p>Loading candidates...</p>;

  const generateSlug = s => s.replace(/\s+/g, '-').toLowerCase();

  const renderCandidate = (candidate, type) => {
    const URL = `/2019/${type}/${candidate.list.name}/${generateSlug(candidate.name)}-${candidate.id}`;
    return (
      <li key={candidate.id}>
        <Link to={URL}>{candidate.name}</Link>
      </li>
    )
  }

  const updateSearchQueryForType = (e, type) => {
    setSearchState({
      ...searches,
      [type]: e.currentTarget.value
    })
  }

  const renderCandidatesPerElection = (election) => {
    const { type } = election;
    const candidatesPerType = election.candidates;

    const $candidates = candidatesPerType
      .filter((c) => {
        const searchQuery = searches[type];
        if (!searchQuery) return true;
        if (c.name.toLowerCase().includes(searchQuery.toLowerCase())) return true;
        return false;
      })
      .sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      })
      .map(c => renderCandidate(c, type));
    return (
      <div className="election-container" key={type}>
        <header>
          <h2>{ELECTION_TYPE_MAP[type].nl}</h2>
          <h2>{ELECTION_TYPE_MAP[type].fr}</h2>
        </header>
        <div className="candidate-search">
          <input placeholder="search for a candidate..." type="search" onChange={(e) => updateSearchQueryForType(e, type)} />
        </div>
        <ul className="election-container__candidates-list">
          {$candidates}
        </ul>
      </div>
    );
  }
  console.log(electionData);
  const $candidateGroups = electionData.map(renderCandidatesPerElection);

  return (
    <div className="overview-container">
      {$candidateGroups}
    </div>
  );
};

export default withRouter(Overview);
