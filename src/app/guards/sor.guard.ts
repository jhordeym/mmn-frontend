import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/backend/auth.service';
import { Router } from '@angular/router';
import { CachingService } from '../services/caching.service';
import { SorService } from '../services/backend/sor.service';

@Injectable({
  providedIn: 'root'
})
export class SorGuard implements CanActivate {
  constructor(public sorService: SorService, public router: Router) {}

  canActivate(): boolean {
    if (!this.sorService.getSorAccount()) {
      this.router.navigate(['signin']);
    }
    return true;
  }
}
