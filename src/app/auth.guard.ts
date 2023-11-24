import { HttpClient } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IsAutenticatedResponse } from './models/responseModels';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private http: HttpClient, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.isLoggedIn();
  }

  isLoggedIn() {
    let url = environment.apiUrl + environment.isAuthenticated;

    return new Promise<boolean | UrlTree>((resolve, reject) => {
      this.http.get<IsAutenticatedResponse>(url).subscribe((response) => {
        if (response.statusCode === 200) {
          resolve(true);
        } else {
          let urlTree: UrlTree = this.router.parseUrl('/login');
          resolve(urlTree);
        }
      });
    });
  }
}
