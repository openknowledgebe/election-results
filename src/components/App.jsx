import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Overview from './Overview';
import Candidate from './Candidate';
import NotFound from './NotFound';

import 'normalize.css';
import '../index.css';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/:year" component={Overview} />
      <Route path="/:year/:list/:party/:candidate" component={Candidate} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default App;
