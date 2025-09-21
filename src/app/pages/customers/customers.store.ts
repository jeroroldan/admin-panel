import { Injectable, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  patchState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, EMPTY, map } from 'rxjs';
import { computed } from '@angular/core';
import { Router } from '@angular/router';
import { CustomersApiService, Customer, PaginatedCustomers, CustomerFilters, CreateCustomerDto, UpdateCustomerDto } from './customers-api.service';

// State interfaces
interface CustomersListState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  filters: CustomerFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CustomersFormState {
  selectedCustomer: Customer | null;
  formLoading: boolean;
  formError: string | null;
  isEditing: boolean;
  formUpdateTrigger: number;
}

interface CustomersModalState {
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isViewModalOpen: boolean;
}

interface CustomersState extends CustomersListState, CustomersFormState, CustomersModalState {}

// Initial state
const initialState: CustomersState = {
  // List state
  customers: [],
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  // Form state
  selectedCustomer: null,
  formLoading: false,
  formError: null,
  isEditing: false,
  formUpdateTrigger: 0,

  // Modal state
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isViewModalOpen: false,
};

@Injectable({ providedIn: 'root' })
export class CustomersStore extends signalStore(
  withState(initialState),

  withComputed((store) => ({
    // List computed properties
    hasCustomers: computed(() => store.customers().length > 0),
    isLoading: computed(() => store.loading()),
    hasError: computed(() => !!store.error()),
    currentPage: computed(() => store.pagination().page),
    totalPages: computed(() => store.pagination().totalPages),
    hasNextPage: computed(() => store.pagination().page < store.pagination().totalPages),
    hasPrevPage: computed(() => store.pagination().page > 1),

    // Form computed properties
    isFormLoading: computed(() => store.formLoading()),
    hasFormError: computed(() => !!store.formError()),
    selectedCustomerId: computed(() => store.selectedCustomer()?.id || null),

    // Filtered customers for display (server-side filtering is now handled by the API)
    filteredCustomers: computed(() => {
      return store.customers();
    }),

    // Customer statistics
    customerStats: computed(() => {
      const customers = store.customers();
      const totalCustomers = customers.length;
      const activeCustomers = customers.filter(customer => customer.isActive).length;
      const customersWithEmail = customers.filter(customer => customer.email).length;
      const customersWithPhone = customers.filter(customer => customer.phone).length;

      return {
        totalCustomers,
        activeCustomers,
        inactiveCustomers: totalCustomers - activeCustomers,
        customersWithEmail,
        customersWithPhone,
        emailCoverage: totalCustomers > 0 ? (customersWithEmail / totalCustomers) * 100 : 0,
        phoneCoverage: totalCustomers > 0 ? (customersWithPhone / totalCustomers) * 100 : 0,
      };
    }),

    // Modal computed properties
    isAnyModalOpen: computed(() =>
      store.isCreateModalOpen() || store.isEditModalOpen() || store.isViewModalOpen()
    ),
  })),

  withMethods((store) => {
    const customersApiService = inject(CustomersApiService);
    const router = inject(Router);

    return {
      // List methods
      setFilters(filters: Partial<CustomerFilters>) {
        patchState(store, {
          filters: { ...store.filters(), ...filters },
          pagination: { ...store.pagination(), page: 1 }, // Reset to first page when filtering
        });
      },

      clearFilters() {
        patchState(store, {
          filters: {},
          pagination: { ...store.pagination(), page: 1 },
        });
      },

      setPage(page: number) {
        if (page >= 1 && page <= store.pagination().totalPages) {
          patchState(store, {
            pagination: { ...store.pagination(), page },
          });
        }
      },

      setLimit(limit: number) {
        patchState(store, {
          pagination: { ...store.pagination(), limit, page: 1 },
        });
      },

      // Load customers with current filters and pagination
      loadCustomers: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, { loading: true, error: null });
          }),
          switchMap(() => {
            const { page, limit } = store.pagination();
            const filters = store.filters();

            return customersApiService.getCustomers(page, limit, filters).pipe(
              tap((response) => {
                if (response.success && response.data) {
                  patchState(store, {
                    customers: response.data.customers,
                    pagination: {
                      page: response.data.page,
                      limit: response.data.limit,
                      total: response.data.total,
                      totalPages: response.data.totalPages,
                    },
                    loading: false,
                  });
                } else {
                  patchState(store, {
                    error: response.message || 'Failed to load customers',
                    loading: false,
                  });
                }
              }),
              catchError((error) => {
                const errorMessage = error.error?.message || error.message || 'Failed to load customers';
                patchState(store, {
                  error: errorMessage,
                  loading: false,
                });
                return EMPTY;
              })
            );
          })
        )
      ),

      // Form methods
      selectCustomer(customer: Customer | null) {
        patchState(store, {
          selectedCustomer: customer,
          isEditing: !!customer,
          formError: null,
        });
      },

      clearSelection() {
        patchState(store, {
          selectedCustomer: null,
          isEditing: false,
          formError: null,
        });
      },

      // Create customer
      createCustomer: rxMethod<CreateCustomerDto>(
        pipe(
          tap(() => {
            patchState(store, { formLoading: true, formError: null });
          }),
          switchMap((customerData) =>
            customersApiService.createCustomer(customerData).pipe(
              tap((customer) => {
                // Add new customer to the list
                const currentCustomers = store.customers();
                patchState(store, {
                  customers: [customer, ...currentCustomers],
                  pagination: {
                    ...store.pagination(),
                    total: store.pagination().total + 1,
                  },
                  selectedCustomer: customer,
                  formLoading: false,
                  isCreateModalOpen: false, // Close modal on success
                });
              }),
              catchError((error) => {
                const errorMessage = error.error?.message || error.message || 'Failed to create customer';
                patchState(store, {
                  formError: errorMessage,
                  formLoading: false,
                });
                return EMPTY;
              })
            )
          )
        )
      ),

      // Update customer
      updateCustomer: rxMethod<{ id: string; data: UpdateCustomerDto }>(
        pipe(
          tap(() => {
            patchState(store, { formLoading: true, formError: null });
          }),
          switchMap(({ id, data }) =>
            customersApiService.updateCustomer(id, data).pipe(
              tap((response) => {
                if (response.success && response.data) {
                  // Update customer in the list
                  const currentCustomers = store.customers();
                  const updatedCustomers = currentCustomers.map((customer) =>
                    customer.id === id ? (response.data as Customer) : customer
                  );

                  patchState(store, {
                    customers: updatedCustomers,
                    selectedCustomer: response.data,
                    formLoading: false,
                    isEditModalOpen: false, // Close modal on success
                  });
                } else {
                  patchState(store, {
                    formError: response.message || 'Failed to update customer',
                    formLoading: false,
                  });
                }
              }),
              catchError((error) => {
                const errorMessage = error.error?.message || error.message || 'Failed to update customer';
                patchState(store, {
                  formError: errorMessage,
                  formLoading: false,
                });
                return EMPTY;
              })
            )
          )
        )
      ),

      // Delete customer
      deleteCustomer: rxMethod<string>(
        pipe(
          tap(() => {
            patchState(store, { formLoading: true, formError: null });
          }),
          switchMap((id) =>
            customersApiService.deleteCustomer(id).pipe(
              tap((response) => {
                if (response.success) {
                  // Remove customer from the list
                  const currentCustomers = store.customers();
                  const filteredCustomers = currentCustomers.filter((customer) => customer.id !== id);

                  patchState(store, {
                    customers: filteredCustomers,
                    pagination: {
                      ...store.pagination(),
                      total: Math.max(0, store.pagination().total - 1),
                    },
                    selectedCustomer: null,
                    formLoading: false,
                  });
                } else {
                  patchState(store, {
                    formError: response.message || 'Failed to delete customer',
                    formLoading: false,
                  });
                }
              }),
              catchError((error) => {
                const errorMessage = error.error?.message || error.message || 'Failed to delete customer';
                patchState(store, {
                  formError: errorMessage,
                  formLoading: false,
                });
                return EMPTY;
              })
            )
          )
        )
      ),

      // Load single customer
      loadCustomer: rxMethod<string>(
        pipe(
          tap(() => {
            patchState(store, { formLoading: true, formError: null });
          }),
          switchMap((id) =>
            customersApiService.getCustomer(id).pipe(
              tap((response) => {
                if (response.success && response.data) {
                  patchState(store, {
                    selectedCustomer: response.data,
                    formLoading: false,
                  });
                } else {
                  patchState(store, {
                    formError: response.message || 'Failed to load customer',
                    formLoading: false,
                  });
                }
              }),
              catchError((error) => {
                const errorMessage = error.error?.message || error.message || 'Failed to load customer';
                patchState(store, {
                  formError: errorMessage,
                  formLoading: false,
                });
                return EMPTY;
              })
            )
          )
        )
      ),

      // Search customers by email (for sales integration)
      searchCustomersByEmail: rxMethod<string>(
        pipe(
          switchMap((email) =>
            customersApiService.searchCustomersByEmail(email).pipe(
              map((customers) => customers || []),
              catchError(() => EMPTY)
            )
          )
        )
      ),

      // Navigation helpers
      navigateToList() {
        router.navigate(['/customers']);
      },

      navigateToCreate() {
        router.navigate(['/customers/create']);
      },

      navigateToEdit(id: string) {
        router.navigate(['/customers', id, 'edit']);
      },

      navigateToDetail(id: string) {
        router.navigate(['/customers', id]);
      },

      // Modal methods
      openCreateModal() {
        patchState(store, {
          isCreateModalOpen: true,
          selectedCustomer: null,
          isEditing: false,
          formError: null,
        });
      },

      closeCreateModal() {
        patchState(store, {
          isCreateModalOpen: false,
          selectedCustomer: null,
          isEditing: false,
          formError: null,
        });
      },

      openEditModal(customer: Customer) {
        patchState(store, {
          isEditModalOpen: true,
          selectedCustomer: customer,
          isEditing: true,
          formError: null,
          formUpdateTrigger: store.formUpdateTrigger() + 1, // Trigger form update
        });
      },

      closeEditModal() {
        patchState(store, {
          isEditModalOpen: false,
          selectedCustomer: null,
          isEditing: false,
          formError: null,
        });
      },

      openViewModal(customer: Customer) {
        patchState(store, {
          isViewModalOpen: true,
          selectedCustomer: customer,
          formError: null,
        });
      },

      closeViewModal() {
        patchState(store, {
          isViewModalOpen: false,
          selectedCustomer: null,
        });
      },

      closeAllModals() {
        patchState(store, {
          isCreateModalOpen: false,
          isEditModalOpen: false,
          isViewModalOpen: false,
          selectedCustomer: null,
          isEditing: false,
          formError: null,
        });
      },

      // Utility methods
      clearErrors() {
        patchState(store, {
          error: null,
          formError: null,
        });
      },

      resetForm() {
        patchState(store, {
          selectedCustomer: null,
          isEditing: false,
          formError: null,
          formLoading: false,
        });
      },
    };
  })
) {}
