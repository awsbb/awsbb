'use strict';

import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Root from './components/Root.jsx';
import Splash from './components/Splash.jsx';

let routes = (
  <Route path="/" component={Root}>
    <IndexRoute component={Splash}/>
  </Route>
);

export default routes;
