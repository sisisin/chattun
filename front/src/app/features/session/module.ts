import { appHistory } from 'app/services/appHistory';
import { httpClient } from 'app/services/http/HttpClient';
import { instantiateSlackClient } from 'app/services/http/SlackClient';
import { connect } from 'app/services/rtm-socket';
import { getSessionState, handle, SessionActions, SessionState } from './interface';

// --- Epic ---
export const epic = handle
  .epic()
  .on(SessionActions.authRequiredRoutesTransitionStarted, async () => {
    if (getSessionState().isConnected) {
      return null;
    }

    const result = await httpClient
      .get<{}, { userId: string; accessToken: string }>('/connection')
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

    const { userId, accessToken } = result.right.body;
    connect(accessToken);
    instantiateSlackClient(accessToken);
    return SessionActions.connectionInitialized({ userId, accessToken });
  });

// --- Reducer ---
const initialState: SessionState = {
  isConnected: false,
};

export const reducer = handle
  .reducer(initialState)
  .on(SessionActions.connectionInitialized, state => {
    state.isConnected = true;
  });

// --- Module ---
export const useSessionModule = handle;
