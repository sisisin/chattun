import React, { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { subscribeToast, getToastSnapshot } from 'app/services/toast';

export const Toast: React.FC = () => {
  const message = useSyncExternalStore(subscribeToast, getToastSnapshot);

  if (!message) return null;

  return createPortal(<div className="toast">{message}</div>, document.body);
};
