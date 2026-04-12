// oxlint-disable-next-line no-restricted-imports -- useRouter.ts自体がuseLocation/useParamsをラップする正当な箇所
import { useLocation, useParams } from '@tanstack/react-router';

export const useRouter = <T extends { [K in keyof T]: string }>() => {
  const params = useParams({ strict: false, structuralSharing: false }) as unknown as T;
  const location = useLocation();

  return {
    params,
    location,
  };
};
