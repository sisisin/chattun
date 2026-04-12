export function getSessionProfileFromRequest(req: any) {
  const user = (req.session as any)?.slack?.user;
  if (!user) {
    return undefined;
  }

  return { accessToken: user.token, userId: user.id };
}
