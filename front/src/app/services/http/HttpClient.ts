import { Observable, of } from 'rxjs';
import { ajax, AjaxError } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';
import { basePath } from '../../config';
import { EitherFactory } from '../EitherContainer';
import { HttpErrorResponse, HttpResponse, HttpResponseEither, HttpStatus } from './entity';

const api = `${basePath}/api`;

const headerBase = {
  'Content-Type': 'application/json',
  accept: 'application/json',
};

export class HttpClient {
  get<Error, Body>(path: string): Observable<HttpResponseEither<Error, Body>> {
    return ajax({
      method: 'GET',
      url: `${api}${path}`,
      headers: { ...headerBase },
      withCredentials: true,
    }).pipe(
      map(res => {
        return EitherFactory.createRight(
          new HttpResponse<Body>(res.status as HttpStatus, res.response),
        );
      }),
      catchError(e => this.errorHandler(e)),
    );
  }

  post<Error, Body>(
    path: string,
    body: Record<string, {}> = {},
  ): Observable<HttpResponseEither<Error, Body>> {
    return ajax({
      method: 'POST',
      url: `${api}${path}`,
      body,
      headers: { ...headerBase },
      withCredentials: true,
    }).pipe(
      map(res => {
        return EitherFactory.createRight(
          new HttpResponse<Body>(res.status as HttpStatus, res.response),
        );
      }),
      catchError(e => this.errorHandler(e)),
    );
  }
  delete(path: string): Observable<HttpResponseEither<{}, {}>> {
    return ajax.delete(`${api}${path}`, { ...headerBase }).pipe(
      map(res => {
        return EitherFactory.createRight(new HttpResponse<{}>(res.status as HttpStatus, {}));
      }),
      catchError(e => this.errorHandler(e)),
    );
  }

  private errorHandler(e: any) {
    if (e instanceof AjaxError) {
      return of(
        EitherFactory.createLeft(new HttpErrorResponse(e.status as HttpStatus, e.response)),
      );
    } else {
      return of(EitherFactory.createLeft(e));
    }
  }
}

export const httpClient = new HttpClient();
