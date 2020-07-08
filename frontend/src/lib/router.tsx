import React from 'react';
import { Route } from 'react-router-dom';

// hooks
// import { useAuthContext } from 'lib/hooks/common/useAuth';

// lib
// import { ROUTES } from 'lib/routes';

type CustomRouteProps = { children: React.ReactChild; path: string };

export const ProtectedRoute = ({ children, path }: CustomRouteProps) => {
  // const { isAuthenticated } = useAuthContext();
  // if (!isAuthenticated()) return <Redirect to={ROUTES.session.login} />;

  return (
    <Route exact path={path}>
      {children}
    </Route>
  );
};

export const PublicRoute = ({ children, path }: CustomRouteProps) => {
  return (
    <Route exact path={path}>
      {children}
    </Route>
  );
};
