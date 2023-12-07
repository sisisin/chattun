export function getSessionProfileFromRequest(req: any) {
  if (!(req.session as any)?.slack?.user) {
    return undefined;
  }

  const { token, id } = (req.session as any)?.slack?.user;

  return { accessToken: token, userId: id };
}
