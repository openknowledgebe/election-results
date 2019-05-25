import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Overview = ({ match, candidates }) => {
  const { year } = match.params;

  if (candidates.length === 0) return <p>Loading candidates...</p>;

  const generateSlug = s => s.replace(/\s+/g, '-').toLowerCase();

  const renderCandidate = (candidate, type) => {
    const URL = `/2019/type/${candidate.list.id}/${type}/${generateSlug(candidate.name)}`;
    return (
      <li>
        <Link to={URL}>{candidate.name}</Link>
      </li>
    )
  }

  const renderGroupOfCandidates = (group) => {
    const candidatesPerType = group.candidates;

    const $candidates = candidatesPerType.map(c => renderCandidate(c, group.type));

    return (
      <>
        <h3>{group.type}</h3>
        <ul>
          {$candidates}
        </ul>
      </>
    );
  }
  console.log(candidates);
  const $candidateGroups = candidates.map(renderGroupOfCandidates);

  return (
    <div>
      {$candidateGroups}
    </div>
  );
};

export default withRouter(Overview);
