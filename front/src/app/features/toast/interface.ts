import { createModule } from 'typeless';
import { ToastSymbol } from './symbol';

export const [handle, ToastActions, getToastState] = createModule(ToastSymbol)
  .withActions({
    showToast: (message: string) => ({ payload: { message } }),
    hideToast: (version: number) => ({ payload: { version } }),
  })
  .withState<ToastState>();

export interface ToastState {
  message: string | null;
  version: number;
}
