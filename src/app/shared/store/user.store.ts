import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

interface UserState {
  user: any; // Usa tu tipo real de usuario si tienes uno
}

const initialState: UserState = {
  user: null,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    userInitials: computed(() => {
      const user = store.user();
      if (user?.firstName && user?.lastName) {
        return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
      }
      return 'U';
    }),
  })),

  withMethods((store) => {
    const authService = inject(AuthService);

    return {
      fetchCurrentUser() {
        const user = authService.getCurrentUser();
        patchState(store, { user });
      },
      getCurrentUser() {
        return store.user();
      },
    };
  })
);
