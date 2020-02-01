import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate  {
  constructor(private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (localStorage.getItem('signUp')) {
      let userData = JSON.parse(localStorage.getItem('signUp'));
      if (userData.Isselfrated) {
        this.router.navigate(['/tabs/feed']);
      } else {
        let data: any = {
          userEmailID: userData.EmailD,
          comingFrom: 'email-signup'
        }
        let navigationExtras = {
          queryParams: {
            special: JSON.stringify(data)
          }
        };
        this.router.navigate(['/otp-verification/'], navigationExtras);
      }
    } else {
      return true;
    }
  }
}

