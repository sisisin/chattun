import { BehaviorSubject } from 'rxjs';

const TOAST_DURATION = 2000;

const toast$ = new BehaviorSubject<string | null>(null);
let hideTimer: ReturnType<typeof setTimeout> | null = null;

export function showToast(message: string) {
  if (hideTimer) clearTimeout(hideTimer);
  toast$.next(message);
  hideTimer = setTimeout(() => {
    toast$.next(null);
    hideTimer = null;
  }, TOAST_DURATION);
}

export function subscribeToast(callback: (message: string | null) => void) {
  const subscription = toast$.subscribe(callback);
  return () => subscription.unsubscribe();
}

export function getToastSnapshot() {
  return toast$.getValue();
}
