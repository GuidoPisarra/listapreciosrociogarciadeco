/* eslint-disable no-debugger */
/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from './service/storage.service';

@Injectable({
  providedIn: 'root'
})

export class VigiaGuard implements CanActivate {
  constructor(
    private storage: StorageService,
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const tokenOk = !this.storage.get_token();
    if ((this.storage.get_token() === '') || (tokenOk)) {
      this.router.navigate(['/login']);
    }

    return true;
  }
}
