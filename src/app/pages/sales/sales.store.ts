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
import { SalesApiService, Sale, PaginatedSales, SaleFilters, CreateSaleDto, UpdateSaleDto, SaleStatus, PaymentMethod } from './sales-api.service';

// Re-export types for components
export type { Sale, PaginatedSales, SaleFilters, CreateSaleDto, UpdateSaleDto };
export { SaleStatus, PaymentMethod };

// State interfaces
interface SalesListState {
  sales: Sale[];
  loading: boolean;
  error: string | null;
  filters: SaleFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface SalesFormState {
  selectedSale: Sale | null;
  formLoading: boolean;
  formError: string | null;
  isEditing: boolean;
  formUpdateTrigger: number;
}

interface SalesModalState {
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isViewModalOpen: boolean;
}

interface SalesState extends SalesListState, SalesFormState, SalesModalState {}

// Initial state
const initialState: SalesState = {
  // List state
  sales: [],
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
  selectedSale: null,
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
export class SalesStore extends signalStore(
  withState(initialState),

  withComputed((store) => ({
    // List computed properties
    hasSales: computed(() => store.sales().length > 0),
    isLoading: computed(() => store.loading()),
    hasError: computed(() => !!store.error()),
    currentPage: computed(() => store.pagination().page),
    totalPages: computed(() => store.pagination().totalPages),
    hasNextPage: computed(() => store.pagination().page < store.pagination().totalPages),
    hasPrevPage: computed(() => store.pagination().page > 1),

    // Form computed properties
    isFormLoading: computed(() => store.formLoading()),
    hasFormError: computed(() => !!store.formError()),
    selectedSaleId: computed(() => store.selectedSale()?.id || null),
    formUpdateTrigger: computed(() => store.formUpdateTrigger()),

    // Filtered sales for display
    filteredSales: computed(() => {
      const sales = store.sales();
      const filters = store.filters();

      if (!filters.search && !filters.status && !filters.paymentMethod) {
        return sales;
      }

      return sales.filter(sale => {
        // Search filter
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          const matchesSearch =
            sale.customer.firstName.toLowerCase().includes(searchTerm) ||
            sale.customer.lastName.toLowerCase().includes(searchTerm) ||
            sale.customer.email.toLowerCase().includes(searchTerm) ||
            (sale.notes && sale.notes.toLowerCase().includes(searchTerm));

          if (!matchesSearch) return false;
        }

        // Status filter
        if (filters.status && sale.status !== filters.status) {
          return false;
        }

        // Payment method filter
        if (filters.paymentMethod && sale.paymentMethod !== filters.paymentMethod) {
          return false;
        }

        return true;
      });
    }),

    // Sales statistics
    salesStats: computed(() => {
      const sales = store.sales();
      const totalSales = sales.length;
      const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
      const completedSales = sales.filter(sale => sale.status === SaleStatus.COMPLETED).length;
      const pendingSales = sales.filter(sale => sale.status === SaleStatus.PENDING).length;

      return {
        totalSales,
        totalRevenue,
        completedSales,
        pendingSales,
        averageSale: totalSales > 0 ? totalRevenue / totalSales : 0,
      };
    }),

    // Modal computed properties
    isAnyModalOpen: computed(() =>
      store.isCreateModalOpen() || store.isEditModalOpen() || store.isViewModalOpen()
    ),
  })),

  withMethods((store) => {
    const salesApiService = inject(SalesApiService);
    const router = inject(Router);

    return {
      // List methods
      setFilters(filters: Partial<SaleFilters>) {
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

      // Load sales with current filters and pagination
      loadSales: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, { loading: true, error: null });
          }),
          switchMap(() => {
            const { page, limit } = store.pagination();
            const filters = store.filters();

            return salesApiService.getSales(page, limit, filters).pipe(
              tap((response) => {
                if (response.success && response.data) {
                  patchState(store, {
                    sales: response.data.sales,
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
                    error: response.message || 'Failed to load sales',
                    loading: false,
                  });
                }
              }),
              catchError((error) => {
                const errorMessage = error.error?.message || error.message || 'Failed to load sales';
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
      selectSale(sale: Sale | null) {
        patchState(store, {
          selectedSale: sale,
          isEditing: !!sale,
          formError: null,
        });
      },

      clearSelection() {
        patchState(store, {
          selectedSale: null,
          isEditing: false,
          formError: null,
        });
      },

      // Create sale
      createSale: rxMethod<CreateSaleDto>(
        pipe(
          tap(() => {
            patchState(store, { formLoading: true, formError: null });
          }),
          switchMap((saleData) =>
            salesApiService.createSale(saleData).pipe(
              tap((response) => {
                if (response.success && response.data) {
                  // Add new sale to the list
                  const currentSales = store.sales();
                  patchState(store, {
                    sales: [response.data, ...currentSales],
                    pagination: {
                      ...store.pagination(),
                      total: store.pagination().total + 1,
                    },
                    selectedSale: response.data,
                    formLoading: false,
                    isCreateModalOpen: false, // Close modal on success
                  });
                } else {
                  patchState(store, {
                    formError: response.message || 'Failed to create sale',
                    formLoading: false,
                  });
                }
              }),
              catchError((error) => {
                const errorMessage = error.error?.message || error.message || 'Failed to create sale';
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

      // Update sale
      updateSale: rxMethod<{ id: string; data: UpdateSaleDto }>(
        pipe(
          tap(() => {
            patchState(store, { formLoading: true, formError: null });
          }),
          switchMap(({ id, data }) =>
            salesApiService.updateSale(id, data).pipe(
              tap((response) => {
                if (response.success && response.data) {
                  // Update sale in the list
                  const currentSales = store.sales();
                  const updatedSales = currentSales.map((sale) =>
                    sale.id === id ? response.data : sale
                  );

                  patchState(store, {
                    sales: updatedSales,
                    selectedSale: response.data,
                    formLoading: false,
                  });
                } else {
                  patchState(store, {
                    formError: response.message || 'Failed to update sale',
                    formLoading: false,
                  });
                }
              }),
              catchError((error) => {
                const errorMessage = error.error?.message || error.message || 'Failed to update sale';
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

      // Delete sale
      deleteSale: rxMethod<string>(
        pipe(
          tap(() => {
            patchState(store, { formLoading: true, formError: null });
          }),
          switchMap((id) =>
            salesApiService.deleteSale(id).pipe(
              tap((response) => {
                if (response.success) {
                  // Remove sale from the list
                  const currentSales = store.sales();
                  const filteredSales = currentSales.filter((sale) => sale.id !== id);

                  patchState(store, {
                    sales: filteredSales,
                    pagination: {
                      ...store.pagination(),
                      total: Math.max(0, store.pagination().total - 1),
                    },
                    selectedSale: null,
                    formLoading: false,
                  });

                  // Navigate back to list
                  router.navigate(['/sales']);
                } else {
                  patchState(store, {
                    formError: response.message || 'Failed to delete sale',
                    formLoading: false,
                  });
                }
              }),
              catchError((error) => {
                const errorMessage = error.error?.message || error.message || 'Failed to delete sale';
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

      // Load single sale
      loadSale: rxMethod<string>(
        pipe(
          tap(() => {
            patchState(store, { formLoading: true, formError: null });
          }),
          switchMap((id) =>
            salesApiService.getSale(id).pipe(
              tap((response) => {
                if (response.success && response.data) {
                  patchState(store, {
                    selectedSale: response.data,
                    formLoading: false,
                  });
                } else {
                  patchState(store, {
                    formError: response.message || 'Failed to load sale',
                    formLoading: false,
                  });
                }
              }),
              catchError((error) => {
                const errorMessage = error.error?.message || error.message || 'Failed to load sale';
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

      // Navigation helpers
      navigateToList() {
        router.navigate(['/sales']);
      },

      navigateToCreate() {
        router.navigate(['/sales/create']);
      },

      navigateToEdit(id: string) {
        router.navigate(['/sales', id, 'edit']);
      },

      navigateToDetail(id: string) {
        router.navigate(['/sales', id]);
      },

      // Modal methods
      openCreateModal() {
        patchState(store, {
          isCreateModalOpen: true,
          selectedSale: null,
          isEditing: false,
          formError: null,
        });
      },

      closeCreateModal() {
        patchState(store, {
          isCreateModalOpen: false,
          selectedSale: null,
          isEditing: false,
          formError: null,
        });
      },

      openEditModal(sale: Sale) {
        patchState(store, {
          isEditModalOpen: true,
          selectedSale: sale,
          isEditing: true,
          formError: null,
          formUpdateTrigger: store.formUpdateTrigger() + 1,
        });
      },

      closeEditModal() {
        patchState(store, {
          isEditModalOpen: false,
          selectedSale: null,
          isEditing: false,
          formError: null,
        });
      },

      openViewModal(sale: Sale) {
        patchState(store, {
          isViewModalOpen: true,
          selectedSale: sale,
          formError: null,
        });
      },

      closeViewModal() {
        patchState(store, {
          isViewModalOpen: false,
          selectedSale: null,
        });
      },

      closeAllModals() {
        patchState(store, {
          isCreateModalOpen: false,
          isEditModalOpen: false,
          isViewModalOpen: false,
          selectedSale: null,
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
          selectedSale: null,
          isEditing: false,
          formError: null,
          formLoading: false,
        });
      },
    };
  })
) {}
