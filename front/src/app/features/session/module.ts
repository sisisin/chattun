import { appHistory } from 'app/services/appHistory';
import { httpClient } from 'app/services/http/HttpClient';
import { getSessionState, handle, SessionActions, SessionState } from './interface';

// --- Epic ---
export const epic = handle
  .epic()
  .on(SessionActions.authRequiredRoutesTransitionStarted, async () => {
    if (getSessionState().isConnected) {
      return null;
    }

    const result = await httpClient
      .get<unknown, { userId: string; accessToken: string }>('/connection')
      .toPromise();
    if (result.left != null) {
      // サーバーの実装的に401以外は異常系
      const msg =
        result.left.status === 401
          ? 'セッションの有効期限が切れました。'
          : '未知の問題が起きました。';
      alert(`${msg}再度ログインしてください。`);
      appHistory.push('/login');
      return null;
    }
    return SessionActions.connectionInitialized(result.right.body);
  });

// --- Reducer ---
const initialState: SessionState = {
  isConnected: false,
  accessToken: undefined,
};

export const reducer = handle
  .reducer(initialState)
  .on(SessionActions.connectionInitialized, (state, { accessToken }) => {
    state.isConnected = true;
    state.accessToken = accessToken;
  });

// --- Module ---
export const useSessionModule = handle;
