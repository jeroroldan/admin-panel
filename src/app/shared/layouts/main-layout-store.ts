import { computed, ViewContainerRef } from '@angular/core';
import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  patchState,
} from '@ngrx/signals';

interface MainLayoutState {
  sidebarOpen: boolean;
  user: any;
  darkMode: boolean;
  loading: boolean;
  userDropdownOpen: boolean;
  currentPage: string;
}

const initialState: MainLayoutState = {
  sidebarOpen: false,
  user: {
    firstName: 'Usuario',
    lastName: 'Demo',
    email: 'usuario@demo.com',
    role: 'admin',
  }, // Usuario por defecto para que aparezca el avatar
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  loading: false,
  userDropdownOpen: false,
  currentPage: 'inicio',
};

export const MainLayoutStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    userInitials: computed(() => {
      const user = store.user();
      if (user?.firstName && user?.lastName) {
        return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
      }
      if (user?.firstName) {
        return user.firstName[0].toUpperCase();
      }
      return 'U';
    }),
    isSidebarOpen: computed(() => store.sidebarOpen()),
    isDarkMode: computed(() => store.darkMode()),
    isLoading: computed(() => store.loading()),
    isUserDropdownOpen: computed(() => store.userDropdownOpen()),
    getCurrentPageName: computed(() => store.currentPage()),
  })),

  withMethods((store) => {
    return {
      // Inicialización
      initialize(
        viewContainerRef?: ViewContainerRef,
        authService?: any,
        router?: any,
        modalService?: any
      ) {
        console.log('🚀 Initializing MainLayoutState...');

        // Sincroniza el tema
        this.syncThemeWithStorage();

        // Configura el modal si se provee
        if (viewContainerRef && modalService) {
          modalService.setViewContainer(viewContainerRef);
        }

        // Cargar usuario actual si se provee authService
        if (authService) {
          this.loadCurrentUser(authService);
        }

        // Actualizar página actual si se provee router
        if (router) {
          this.updateCurrentPage(router);
        }

        console.log('✅ MainLayoutState initialized');
      },

      // Gestión de usuario
      loadCurrentUser(authService: any) {
        try {
          const user = authService.getCurrentUser();

          if (user) {
            patchState(store, { user });
            console.log(
              '✅ User loaded successfully:',
              user.firstName,
              user.lastName
            );
          } else {
            console.log('⚠️ No user found, keeping default user');
          }
        } catch (error) {
          console.error('❌ Error loading user:', error);
          console.log('Using default user');
        }
      },

      getCurrentUser() {
        return store.user();
      },

      hasRole(role: string, authService?: any): boolean {
        if (authService) {
          try {
            return authService.hasRole(role as any);
          } catch (error) {
            console.error('Error checking role:', error);
          }
        }
        // Fallback: check user role directly
        const user = store.user();
        return user?.role === role;
      },

      hasAnyRole(roles: string[], authService?: any): boolean {
        if (authService) {
          try {
            return authService.hasAnyRole(roles as any);
          } catch (error) {
            console.error('Error checking roles:', error);
          }
        }
        // Fallback: check user role directly
        const user = store.user();
        return roles.includes(user?.role);
      },

      getRoleClass(role: string | undefined): string {
        switch (role) {
          case 'admin':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
          case 'manager':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
          case 'employee':
            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
          default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
      },

      logout(authService?: any, router?: any) {
        try {
          if (authService) {
            authService.logout();
          }
          this.closeUserDropdown();
          if (router) {
            router.navigate(['/auth/login']);
          }

          // Limpiar estado
          patchState(store, { user: null, userDropdownOpen: false });
        } catch (error) {
          console.error('Error during logout:', error);
        }
      },

      // Gestión de sidebar
      toggleSidebar() {
        patchState(store, { sidebarOpen: !store.sidebarOpen() });
      },

      setSidebarOpen(open: boolean) {
        patchState(store, { sidebarOpen: open });
      },

      // Gestión de dropdown de usuario
      toggleUserDropdown() {
        patchState(store, { userDropdownOpen: !store.userDropdownOpen() });
      },

      closeUserDropdown() {
        patchState(store, { userDropdownOpen: false });
      },

      // Gestión de tema
      toggleDarkMode() {
        patchState(store, { darkMode: !store.darkMode() });
        this.applyTheme(store.darkMode());
      },

      setDarkMode(value: boolean) {
        patchState(store, { darkMode: value });
        this.applyTheme(value);
      },

      applyTheme(isDark: boolean) {
        const root = document.documentElement;
        if (isDark) {
          root.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          root.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      },

      syncThemeWithStorage() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
          this.setDarkMode(true);
        } else if (theme === 'light') {
          this.setDarkMode(false);
        } else {
          this.setDarkMode(
            window.matchMedia('(prefers-color-scheme: dark)').matches
          );
        }
      },

      // Gestión de loading
      setLoading(value: boolean) {
        patchState(store, { loading: value });
      },

      // Gestión de navegación
      updateCurrentPage(router?: any) {
        if (!router) return;

        const url = router.url;
        let currentPage = 'inicio';

        if (url.includes('/dashboard')) currentPage = 'dashboard';
        else if (url.includes('/products')) currentPage = 'productos';
        else if (url.includes('/sales')) currentPage = 'ventas';
        else if (url.includes('/customers')) currentPage = 'clientes';
        else if (url.includes('/settings')) currentPage = 'configuración';

        patchState(store, { currentPage });
      },

      navigateTo(route: string, router?: any) {
        if (router) {
          router.navigate([route]);
          this.updateCurrentPage(router);
        }
      },

      // Gestión de clicks fuera del dropdown
      handleDocumentClick(event: Event) {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-dropdown-container')) {
          this.closeUserDropdown();
        }
      },

      // Métodos de utilidad
      refreshUserData(authService?: any) {
        if (authService) {
          this.loadCurrentUser(authService);
        }
      },

      // Método para cerrar todos los dropdowns/modales
      closeAllDropdowns() {
        this.closeUserDropdown();
      },

      // Método para resetear el estado (útil para testing o logout completo)
      resetState() {
        patchState(store, {
          sidebarOpen: false,
          user: null,
          userDropdownOpen: false,
          loading: false,
          currentPage: 'inicio',
        });
      },

      // Método para debug
      debugState() {
        console.log('🔍 Current state:', {
          user: store.user(),
          userInitials: store.userInitials(),
          sidebarOpen: store.sidebarOpen(),
          darkMode: store.darkMode(),
          currentPage: store.currentPage(),
        });
      },

      // Método para establecer usuario manualmente (útil para testing)
      setUser(user: any) {
        patchState(store, { user });
      },
    };
  })
);
