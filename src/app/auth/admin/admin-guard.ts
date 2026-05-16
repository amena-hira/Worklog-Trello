import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const role = sessionStorage.getItem('authRole');

  if (role === 'ROLE_ADMIN') {
    return true; // Allow access
  }

  // Redirect to normal dashboard if not an admin
  router.navigate(['/']);
  return false;
};
