import React from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  Outlet,
} from '@tanstack/react-router';
import { getSessionState, SessionActions } from 'app/features/session/interface';
import { useActions, useMappedState } from 'typeless';

function WithAuth() {
  const { authRequiredRoutesTransitionStarted } = useActions(SessionActions);
  authRequiredRoutesTransitionStarted();
  const { isConnected } = useMappedState([getSessionState], state => state);

  return isConnected ? <Outlet /> : <div>Loading...</div>;
}

const rootRoute = createRootRoute();

const authLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  component: WithAuth,
});

const timelineRoute = createRoute({
  getParentRoute: () => authLayout,
  path: '/',
  component: lazyRouteComponent(() => import('app/features/timeline/module'), 'TimelineModule'),
});

const settingRoute = createRoute({
  getParentRoute: () => authLayout,
  path: '/setting',
  component: lazyRouteComponent(() => import('app/features/setting/module'), 'SettingModule'),
});

const threadRoute = createRoute({
  getParentRoute: () => authLayout,
  path: '/thread/$channelId/$ts',
  component: lazyRouteComponent(() => import('app/features/thread/module'), 'ThreadModule'),
});

const channelRoute = createRoute({
  getParentRoute: () => authLayout,
  path: '/channel/$channelId',
  component: lazyRouteComponent(() => import('app/features/channel/module'), 'ChannelModule'),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: lazyRouteComponent(() => import('app/features/login/module'), 'LoginModule'),
});

const routeTree = rootRoute.addChildren([
  authLayout.addChildren([timelineRoute, settingRoute, threadRoute, channelRoute]),
  loginRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
