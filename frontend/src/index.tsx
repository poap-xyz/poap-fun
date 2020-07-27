import React from 'react';
import { ReactQueryConfigProvider } from 'react-query';
import ReactDOM from 'react-dom';
import { Global } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import { ModalProvider } from 'react-modal-hook';
import { ReactQueryDevtools } from 'react-query-devtools';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

// Constants
import { theme } from 'lib/constants/theme';
import { mainStyles } from 'lib/styles/main';
import { antdStyles } from 'lib/styles/antd';
import { ROUTES } from 'lib/routes';

// Router
import { PublicRoute } from 'lib/router';

// Hooks
import { StateProvider } from 'lib/hooks/useCustomState';

// Module Components
import Home from 'modules/raffles/pages/Home';
import RaffleCreate from 'modules/raffles/pages/RaffleCreate';
import RaffleEdit from 'modules/raffles/pages/RaffleEdit';
import RaffleCreated from 'modules/raffles/pages/RaffleCreated';
import RafflePage from 'modules/raffles/pages/RafflePage';

const queryConfig = { mutations: { throwOnError: true } };
const isDevelopment = process.env.REACT_APP_ENABLE_REACT_QUERY === 'true';

const publicRoutes = [
  { Component: RaffleCreate, path: ROUTES.raffleCreation },
  { Component: RaffleCreated, path: ROUTES.raffleCreated },
  { Component: RaffleEdit, path: ROUTES.raffleEdit },
  { Component: RafflePage, path: ROUTES.raffleDetail },
  { Component: Home, path: ROUTES.home },
];

const PoapFunApp = () => (
  <ThemeProvider theme={theme}>
    <StateProvider>
      <ReactQueryConfigProvider config={queryConfig}>
        <ModalProvider>
          <Router>
            <Switch>
              {publicRoutes.map(({ Component, path }) => (
                <PublicRoute key={path} path={path}>
                  <Component />
                </PublicRoute>
              ))}
            </Switch>
          </Router>
          <Global styles={mainStyles} />
          <Global styles={antdStyles} />
          {isDevelopment && <ReactQueryDevtools />}
        </ModalProvider>
      </ReactQueryConfigProvider>
    </StateProvider>
  </ThemeProvider>
);

ReactDOM.render(<PoapFunApp />, document.getElementById('root'));
