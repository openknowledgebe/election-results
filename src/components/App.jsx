import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { API, ELECTION_TYPES } from '../constants';
import Overview from './Overview';
import Candidate from './Candidate';
import NotFound from './NotFound';

import 'normalize.css';
import '../index.css';

const App = () => {
  const [candidates, setCandidates] = useState([]);

  const getCandidates = async () => {
    const queue = ELECTION_TYPES.map(async (type) => {
      const candidatesPerType = await API.getCandidates(type);
      const arrayOfCandidates = Object.keys(candidatesPerType).map(key => candidatesPerType[key])
      return { type, candidates: arrayOfCandidates };
    });
    return Promise.all(queue);
  }

  useEffect(() => {
    getCandidates().then(setCandidates);
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/2019"/>} />
        <Route exact path="/:year" render={() => <Overview candidates={candidates} />} />
        <Route path="/:year/:list/:party/:candidate" render={() => <Candidate candidates={candidates} />} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
