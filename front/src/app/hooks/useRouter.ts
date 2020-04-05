/* eslint-disable-next-line no-restricted-imports */
import { useLocation, useRouteMatch } from 'react-router-dom';
import { appHistory } from 'app/services/appHistory';

export const useRouter = <T>() => {
  const { params } = useRouteMatch<T>();
  const history = appHistory;
  const { state, ...location } = useLocation();

  return {
    params,
    history,
    location,
  };
};
