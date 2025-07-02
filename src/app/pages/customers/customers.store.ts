import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CustomersApiService, Customer, CustomerFilters, CustomerListResponse } from './api';

type CustomersState = {
  customers: Customer[];
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  filters: CustomerFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const initialState: CustomersState = {
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const CustomersStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    filteredCustomers: computed(() => {
      const customers = store.customers();
      const filters = store.filters();

      if (!filters.search) return customers;

      const searchTerm = filters.search.toLowerCase();
      return customers.filter(customer =>
        customer.firstName.toLowerCase().includes(searchTerm) ||
        customer.lastName.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm)
      );
    }),
    hasCustomers: computed(() => store.customers().length > 0),
    totalCustomers: computed(() => store.pagination().total),
  })),
  withMethods((store) => {
    const customersApiService = inject(CustomersApiService);

    return {
      // Cargar clientes
      loadCustomers: rxMethod<{ page?: number; limit?: number; filters?: CustomerFilters }>(
        switchMap(({ page = 1, limit = 10, filters = {} }) => {
          patchState(store, {
            isLoading: true,
            error: null,
            filters: { ...store.filters(), ...filters },
            pagination: {
              ...store.pagination(),
              page,
              limit
            }
          });

          return customersApiService.getCustomers(page, limit, filters).pipe(
            tap((response: CustomerListResponse) => {
              patchState(store, {
                customers: response.customers,
                isLoading: false,
                pagination: {
                  page: response.page,
                  limit: response.limit,
                  total: response.total,
                  totalPages: response.totalPages,
                }
              });
            }),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Error al cargar clientes'
              });
              return of(null);
            })
          );
        })
      ),

      // Cargar cliente por ID
      loadCustomerById: rxMethod<string>(
        switchMap((id) => {
          patchState(store, { isLoading: true, error: null });

          return customersApiService.getCustomerById(id).pipe(
            tap((customer: Customer) => {
              patchState(store, {
                selectedCustomer: customer,
                isLoading: false
              });
            }),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Error al cargar cliente'
              });
              return of(null);
            })
          );
        })
      ),

      // Crear cliente
      createCustomer: rxMethod<{ firstName: string; lastName: string; email: string; phone?: string; address?: string; city?: string; country?: string }>(
        switchMap((customerData) => {
          patchState(store, { isLoading: true, error: null });

          return customersApiService.createCustomer(customerData).pipe(
            tap((newCustomer: Customer) => {
              patchState(store, {
                customers: [...store.customers(), newCustomer],
                isLoading: false,
                pagination: {
                  ...store.pagination(),
                  total: store.pagination().total + 1
                }
              });
            }),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Error al crear cliente'
              });
              return of(null);
            })
          );
        })
      ),

      // Actualizar cliente
      updateCustomer: rxMethod<{ id: string; data: Partial<Customer> }>(
        switchMap(({ id, data }) => {
          patchState(store, { isLoading: true, error: null });

          return customersApiService.updateCustomer(id, data).pipe(
            tap((updatedCustomer: Customer) => {
              const customers = store.customers().map(customer =>
                customer.id === id ? updatedCustomer : customer
              );
              patchState(store, {
                customers,
                selectedCustomer: store.selectedCustomer()?.id === id ? updatedCustomer : store.selectedCustomer(),
                isLoading: false
              });
            }),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Error al actualizar cliente'
              });
              return of(null);
            })
          );
        })
      ),

      // Eliminar cliente
      deleteCustomer: rxMethod<string>(
        switchMap((id) => {
          patchState(store, { isLoading: true, error: null });

          return customersApiService.deleteCustomer(id).pipe(
            tap(() => {
              const customers = store.customers().filter(customer => customer.id !== id);
              patchState(store, {
                customers,
                selectedCustomer: store.selectedCustomer()?.id === id ? null : store.selectedCustomer(),
                isLoading: false,
                pagination: {
                  ...store.pagination(),
                  total: Math.max(0, store.pagination().total - 1)
                }
              });
            }),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Error al eliminar cliente'
              });
              return of(null);
            })
          );
        })
      ),

      // Métodos para gestión de filtros
      setSearchFilter: (search: string) => {
        patchState(store, {
          filters: { ...store.filters(), search }
        });
      },

      setActiveFilter: (isActive: boolean | undefined) => {
        patchState(store, {
          filters: { ...store.filters(), isActive }
        });
      },

      setLocationFilter: (city?: string, country?: string) => {
        patchState(store, {
          filters: { ...store.filters(), city, country }
        });
      },

      setDateFilter: (dateFrom?: string, dateTo?: string) => {
        patchState(store, {
          filters: { ...store.filters(), dateFrom, dateTo }
        });
      },

      clearFilters: () => {
        patchState(store, {
          filters: {}
        });
      },

      // Métodos para paginación
      setPage: (page: number) => {
        patchState(store, {
          pagination: { ...store.pagination(), page }
        });
      },

      setLimit: (limit: number) => {
        patchState(store, {
          pagination: { ...store.pagination(), limit, page: 1 }
        });
      },

      // Limpiar estado
      clearError: () => {
        patchState(store, { error: null });
      },

      clearSelectedCustomer: () => {
        patchState(store, { selectedCustomer: null });
      },

      reset: () => {
        patchState(store, initialState);
      }
    };
  })
);
