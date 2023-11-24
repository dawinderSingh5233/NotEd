import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export class HttpRequestInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    httpHandler: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('authorization-token');

    if (token) {
      req = req.clone({
        headers: new HttpHeaders({
          Authorization: token,
        }),
      });
    } else {
      req = req.clone({
        headers: new HttpHeaders({
          Authorization: '',
        }),
      });
    }

    return httpHandler.handle(req);
  }
}
