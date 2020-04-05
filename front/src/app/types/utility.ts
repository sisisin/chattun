export type ToUnion<T> = T extends readonly string[] ? T[number] : T;
export type ToStringObject<T> = T extends string ? { [P in T]: string } : never;
