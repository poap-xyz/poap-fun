import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import * as Sentry from '@sentry/browser';

// Pages
import Home from 'pages/Home';

// Components
import { GlobalStyles } from 'lib/styles';

// Redux
import { configureStore, history } from './store';

// Constants
import { ROUTES } from 'lib/constants';

// Store & Sentry Config
const { store, persistor } = configureStore();
Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN_URL });

const App = () => (
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route exact path={ROUTES.home}>
              <Home />
            </Route>
            <Route exact path="*">
              <Home />
            </Route>
          </Switch>
          <GlobalStyles />
        </ConnectedRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);

ReactDOM.render(<App />, document.getElementById('root'));
