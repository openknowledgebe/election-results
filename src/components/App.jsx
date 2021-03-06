import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import NProgress from 'nprogress';
import { API, ELECTION_TYPES } from '../constants';
import Overview from './Overview';
import Candidate from './Candidate';
import NotFound from './NotFound';

import 'normalize.css';
import '../assets/css/nprogress.css';
import '../assets/css/index.css';

const App = () => {
  const [electionData, setElectionData] = useState([]);

  const getElectionData = async () => {
    const queue = ELECTION_TYPES.map(async (type) => {
      const resultsPerType = await API.getResults(type);
      const candidatesPerType = await API.getCandidates(type);
      const evolution = await API.getEvolution(type);
      const arrayOfCandidates = Object.keys(candidatesPerType).map(key => candidatesPerType[key]);
      const arrayOfEvolution = Object.keys(evolution).map(key => evolution[key]);
      return { type, results: resultsPerType, evolution: arrayOfEvolution, candidates: arrayOfCandidates };
    });
    return Promise.all(queue);
  }

  useEffect(() => {
    NProgress.start();
    document.title = 'Elections | Open Knowledge Belgium';
    getElectionData().then((data) => {
      NProgress.done();
      setElectionData(data);
    });
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact from="/" to="/2019" />
        <Route exact path="/:year" render={() => <Overview electionData={electionData} />} />
        <Route exact path="/:year/:type/:list/:candidate" render={() => <Candidate electionData={electionData} />} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
