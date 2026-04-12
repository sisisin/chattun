import { router } from 'app/router';

export const appHistory = {
  push(path: string) {
    router.navigate({ to: path });
  },
};
