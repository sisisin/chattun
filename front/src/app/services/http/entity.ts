import { EitherContainer } from '../EitherContainer';

// 0がある理由はこちら https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest/status
export type HttpStatus = 200 | 201 | 204 | 401 | 404 | 422 | 500 | 0;
export class HttpResponse<T> {
  constructor(readonly status: HttpStatus, readonly body: T) {}
}
export class HttpErrorResponse<T> {
  constructor(readonly status: HttpStatus | null, readonly body?: T) {}
}

export type HttpResponseEither<L, A> = EitherContainer<HttpErrorResponse<L>, HttpResponse<A>>;
