interface LeftContainer<L> {
  left: L;
  right: null;
}
interface RightContainer<A> {
  left: null;
  right: A;
}
export type EitherContainer<L, A> = LeftContainer<L> | RightContainer<A>;
export const EitherFactory = {
  createRight<A>(body: A): RightContainer<A> {
    return {
      left: null,
      right: body,
    };
  },
  createLeft<L>(body: L): LeftContainer<L> {
    return {
      left: body,
      right: null,
    };
  },
};
