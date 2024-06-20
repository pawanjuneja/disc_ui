import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { CogServiceService } from './cog-service.service';
import { Router } from '@angular/router';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor(private cognito: CogServiceService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.cognito.getCurrentUser()) {
      request = request.clone({
        setHeaders: {
          Authorization: localStorage.getItem('auth')
        }
      });
      return next.handle(request);
    } else {
      this.cognito.logout().subscribe((res) => {
        console.log('Logout: ' + (res as boolean));
        localStorage.clear();
        this.router.navigate(['/login']);
      });
    }
  }
}
