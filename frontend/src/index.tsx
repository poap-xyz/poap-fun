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

// Module Components
import Home from 'modules/raffles/pages/Home';
import CreateRaffle from 'modules/raffles/pages/Create';

const queryConfig = { mutations: { throwOnError: true } };
const isDevelopment = process.env.NODE_ENV === 'development';

const publicRoutes = [
  { Component: CreateRaffle, path: ROUTES.raffleCreation },
  { Component: Home, path: ROUTES.home },
];

const PoapFunApp = () => (
  <ThemeProvider theme={theme}>
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
  </ThemeProvider>
);

ReactDOM.render(<PoapFunApp />, document.getElementById('root'));
