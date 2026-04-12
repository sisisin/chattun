import { ToastActions } from 'app/features/toast/interface';
import { appHistory } from 'app/services/appHistory';
import { appRegistry } from 'app/services/AppRegistry';
import { httpClient } from 'app/services/http/HttpClient';
import { firstValueFrom } from 'rxjs';
import { getSessionState, handle, SessionActions, SessionState } from './interface';

// --- Epic ---
export const epic = handle
  .epic()
  .on(SessionActions.authRequiredRoutesTransitionStarted, async () => {
    if (getSessionState().isConnected) {
      return null;
    }

    const result = await firstValueFrom(httpClient.get<unknown, { userId: string }>('/connection'));
    if (result.left != null) {
      // サーバーの実装的に401以外は異常系
      const msg =
        result.left.status === 401
          ? 'セッションの有効期限が切れました。'
          : '未知の問題が起きました。';
      appRegistry.dispatch(ToastActions.showToast(`${msg}再度ログインしてください。`));
      appHistory.push('/login');
      return null;
    }
    return SessionActions.connectionInitialized(result.right.body);
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
