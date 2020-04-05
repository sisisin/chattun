import { getSessionState, SessionActions } from 'app/features/session/interface';
import { appHistory } from 'app/services/appHistory';
import { appRouteDefinitions } from 'app/types/AppRouteDefinitions';
import React from 'react';
import { Route, RouteProps, Router, Switch } from 'react-router-dom';
import { useActions, useMappedState } from 'typeless';

const WithAuth: React.FC = ({ children }) => {
  const { authRequiredRoutesTransitionStarted } = useActions(SessionActions);
  authRequiredRoutesTransitionStarted();
  const { isConnected } = useMappedState([getSessionState], state => state);

  return isConnected ? <>{children}</> : <div>Loading...</div>;
};

export const Routes: React.FC = () => {
  return (
    <Router history={(appHistory as any).history}>
      <Switch>
        {Object.values(appRouteDefinitions).map(({ Component, path, requiresAuth }, key) => {
          const base: RouteProps & { key: React.Key } = {
            key,
            exact: true,
            sensitive: true,
            path: path as string | string[],
          };

          if (requiresAuth) {
            return (
              <Route {...base}>
                <WithAuth>
                  <Component></Component>
                </WithAuth>
              </Route>
            );
          } else {
            return (
              <Route {...base}>
                <Component></Component>
              </Route>
            );
          }
        })}
      </Switch>
    </Router>
  );
};
