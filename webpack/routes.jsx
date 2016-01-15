'use strict';

import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import Splash from './components/Splash';

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Splash}/>
  </Route>
);

export default routes;
