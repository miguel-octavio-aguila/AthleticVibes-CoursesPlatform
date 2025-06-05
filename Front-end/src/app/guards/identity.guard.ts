import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const identityGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  
  let identity: any = userService.getIdentity();
  
  if (identity && identity.sub) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};