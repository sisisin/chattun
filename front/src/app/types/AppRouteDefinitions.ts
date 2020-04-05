import loadable, { LoadableComponent } from '@loadable/component';
import { ToStringObject, ToUnion } from 'app/types/utility';

type RouteDefinitionsBase = {
  [key: string]: {
    readonly path: string | readonly string[];
    readonly params?: readonly string[];
    readonly queryParams?: readonly string[];
    readonly requiresAuth: boolean;
    readonly Component: LoadableComponent<unknown>;
  };
};

export const appRouteDefinitions = {
  timeline: {
    path: '/',
    requiresAuth: true,
    Component: loadable(() =>
      import('app/features/timeline/module').then(m => ({ default: m.TimelineModule })),
    ) as LoadableComponent<unknown>,
  },
  setting: {
    path: '/setting',
    requiresAuth: true,
    Component: loadable(() =>
      import('app/features/setting/module').then(m => ({ default: m.SettingModule })),
    ) as LoadableComponent<unknown>,
  },
  thread: {
    path: '/thread/:channelId/:ts',
    params: ['channelId', 'ts'],
    requiresAuth: true,
    Component: loadable(() =>
      import('app/features/thread/module').then(m => ({ default: m.ThreadModule })),
    ) as LoadableComponent<unknown>,
  },
  login: {
    path: '/login',
    requiresAuth: false,
    Component: loadable(() =>
      import('app/features/login/module').then(m => ({ default: m.LoginModule })),
    ) as LoadableComponent<unknown>,
  },
} as const;

type RD = typeof appRouteDefinitions;
type Paths = {
  [K in keyof RD]: { path: ToUnion<RD[K]['path']> };
};
type Params = {
  [K in keyof RD]: RD[K] extends { params: infer V } ? { params: ToStringObject<ToUnion<V>> } : {};
};
type QueryParams = {
  [K in keyof RD]: RD[K] extends { queryParams: infer W }
    ? { queryParams?: Partial<ToStringObject<ToUnion<W>>> }
    : {};
};

export type AppPaths = Paths[keyof Paths]['path'];
export type GetSourceFromPath<T extends AppPaths> = {
  [K in keyof RD]: T extends ToUnion<RD[K]['path']> ? Paths[K] & Params[K] & QueryParams[K] : never;
}[keyof RD];
export type GetOptionFromPath<T extends AppPaths> = {
  [K in keyof RD]: T extends ToUnion<RD[K]['path']> ? Params[K] & QueryParams[K] : never;
}[keyof RD];

// note: this is checking type of `RouteDefinitions`
type ValidateRouteDefinitions = RD extends RouteDefinitionsBase ? true : never;
export function validateRouteDefinitions(): ValidateRouteDefinitions {
  return true;
}
