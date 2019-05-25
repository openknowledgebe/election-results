import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Overview from './Overview';
import Candidate from './Candidate';
import NotFound from './NotFound';

import 'normalize.css';
import '../index.css';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/2019"/>} />
      <Route exact path="/:year" component={Overview} />
      <Route path="/:year/:list/:party/:candidate" component={Candidate} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default App;
