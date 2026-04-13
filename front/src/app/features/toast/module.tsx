import React from 'react';
import { createPortal } from 'react-dom';
import { useMappedState } from 'typeless';
import { of, EMPTY } from 'rxjs';
import styles from './Toast.module.css';
import { delay, mergeMap } from 'rxjs/operators';
import { handle, ToastActions, getToastState, ToastState } from './interface';

const TOAST_DURATION = 2000;

// --- Epic ---
handle.epic().on(ToastActions.showToast, () => {
  const { version } = getToastState();
  return of(null).pipe(
    delay(TOAST_DURATION),
    mergeMap(() => {
      if (getToastState().version === version) {
        return of(ToastActions.hideToast(version));
      }
      return EMPTY;
    }),
  );
});

// --- Reducer ---
const initialState: ToastState = {
  message: null,
  version: 0,
};

handle
  .reducer(initialState)
  .on(ToastActions.showToast, (state, { message }) => {
    state.message = message;
    state.version += 1;
  })
  .on(ToastActions.hideToast, (state, { version }) => {
    if (state.version === version) {
      state.message = null;
    }
  });

// --- Module ---
export const Toast = () => {
  handle();
  const { message, version } = useMappedState([getToastState], s => ({
    message: s.message,
    version: s.version,
  }));

  if (!message) return null;
  return createPortal(
    <div key={version} className={styles.toast}>
      {message}
    </div>,
    document.body,
  );
};
