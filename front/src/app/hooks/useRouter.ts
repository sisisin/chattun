// oxlint-disable-next-line no-restricted-imports -- useRouter.ts自体がuseLocationをラップする正当な箇所
import { useLocation, useRouteMatch } from 'react-router-dom';
import { appHistory } from 'app/services/appHistory';

export const useRouter = <T extends { [K in keyof T]?: string | undefined }>() => {
  const { params } = useRouteMatch<T>();
  const history = appHistory;
  const { state: _state, ...location } = useLocation();

  return {
    params,
    history,
    location,
  };
};
