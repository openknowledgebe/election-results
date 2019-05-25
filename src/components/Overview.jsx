import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Overview = ({ match, electionData }) => {
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

  const renderGroupOfCandidates = (group) => {
    const candidatesPerType = group.candidates;

    const $candidates = candidatesPerType.map(c => renderCandidate(c, group.type));

    return (
      <div key={group.type}>
        <h3>{group.type}</h3>
        <ul>
          {$candidates}
        </ul>
      </div>
    );
  }
  console.log(electionData);
  const $candidateGroups = electionData.map(renderGroupOfCandidates);

  return (
    <div>
      {$candidateGroups}
    </div>
  );
};

export default withRouter(Overview);
