import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, EMPTY } from 'rxjs';
import { inject } from '@angular/core';
import { Customer, CustomerModel } from './customer-model';
import { CustomersApiService, CustomerFilters } from './api';

interface CustomerPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface CustomersIndexState {
  customers: CustomerModel[];
  isLoading: boolean;
  error: string | null;
  filters: CustomerFilters;
  pagination: CustomerPagination;
}

const initialState: CustomersIndexState = {
  customers: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    isActive: undefined,
    // Removí page y limit de filters
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const CustomersIndexStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    // Computed para verificar si hay clientes
    hasCustomers: computed(() => store.customers().length > 0),

    // Total de clientes (viene del backend)
    totalCustomers: computed(() => store.pagination().total),

    // Estadísticas básicas para la visualización
    stats: computed(() => {
      const customers = store.customers();
      const totalSpent = customers.reduce(
        (sum, customer) => sum + customer.totalSpent,
        0
      );
      const totalOrders = customers.reduce(
        (sum, customer) => sum + customer.totalOrders,
        0
      );

      return {
        totalCustomers: store.pagination().total,
        activeCustomers: customers.filter((c) => c.isActive).length,
        averageSpent: customers.length > 0 ? totalSpent / customers.length : 0,
        totalOrders: totalOrders,
      };
    }),

    // Info de paginación
    paginationInfo: computed(() => {
      const pagination = store.pagination();
      return {
        ...pagination,
        hasNextPage: pagination.page < pagination.totalPages,
        hasPreviousPage: pagination.page > 1,
        showingFrom: (pagination.page - 1) * pagination.limit + 1,
        showingTo: Math.min(
          pagination.page * pagination.limit,
          pagination.total
        ),
      };
    }),
  })),

  withMethods((store) => {
    const customersApiService = inject(CustomersApiService);

    return {
      // Cargar clientes desde el backend con paginación
      loadCustomers: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, { isLoading: true, error: null });
          }),
          switchMap(() => {
            // Combinar filtros con paginación
            const filters = {
              ...store.filters(),
              page: store.pagination().page,
              limit: store.pagination().limit,
            };

            return customersApiService.getCustomers(filters).pipe(
              tap((response) => {
                patchState(store, {
                  customers: response.customers,
                  pagination: {
                    page: response.page,
                    limit: store.pagination().limit,
                    total: response.total,
                    totalPages: response.totalPages,
                  },
                  isLoading: false,
                });
              }),
              catchError((error) => {
                patchState(store, {
                  isLoading: false,
                  error: 'Error al cargar los clientes',
                });
                return EMPTY;
              })
            );
          })
        )
      ),

      // Actualizar filtros - resetea a página 1 y recarga
      updateFilter(filterKey: keyof CustomerFilters, value: any) {
        const newFilters = { ...store.filters(), [filterKey]: value };

        patchState(store, {
          filters: newFilters,
          pagination: { ...store.pagination(), page: 1 },
        });

        // Recargar datos con nuevos filtros
        this.loadCustomers();
      },

      // Limpiar filtros
      clearFilters() {
        const defaultFilters: CustomerFilters = {
          search: '',
          isActive: undefined,
        };

        patchState(store, {
          filters: defaultFilters,
          pagination: { ...store.pagination(), page: 1 },
        });

        // Recargar datos sin filtros
        this.loadCustomers();
      },

      // Navegación de páginas
      goToPage(page: number) {
        const currentPagination = store.pagination();
        if (page >= 1 && page <= currentPagination.totalPages) {
          patchState(store, {
            pagination: { ...currentPagination, page },
          });
          this.loadCustomers();
        }
      },

      nextPage() {
        const currentPagination = store.pagination();
        if (currentPagination.page < currentPagination.totalPages) {
          this.goToPage(currentPagination.page + 1);
        }
      },

      previousPage() {
        const currentPagination = store.pagination();
        if (currentPagination.page > 1) {
          this.goToPage(currentPagination.page - 1);
        }
      },

      // Cambiar tamaño de página
      changePageSize(limit: number) {
        patchState(store, {
          pagination: { ...store.pagination(), limit, page: 1 },
        });
        this.loadCustomers();
      },

      // Refrescar datos
      refreshCustomers() {
        this.loadCustomers();
      },

      // Limpiar errores
      clearError() {
        patchState(store, { error: null });
      },

      // Actualizar un cliente en la lista (cuando se modifica desde otra parte)
      updateCustomerInList(updatedCustomer: CustomerModel) {
        const customers = store
          .customers()
          .map((customer) =>
            customer.id === updatedCustomer.id ? updatedCustomer : customer
          );

        patchState(store, { customers });
      },

      // Eliminar cliente de la lista (cuando se elimina desde otra parte)
      removeCustomerFromList(customerId: string) {
        const customers = store.customers().filter((c) => c.id !== customerId);
        patchState(store, { customers });

        // Recargar para actualizar la paginación
        this.loadCustomers();
      },

      // Agregar nuevo cliente a la lista (cuando se crea desde otra parte)
      addCustomerToList(newCustomer: Customer) {
        // Recargar para obtener la lista actualizada con paginación correcta
        this.loadCustomers();
      },
    };
  })
);
