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
import { ProductsApiService, Product, ProductFilters } from './products-api.service';

interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
  pagination: ProductPagination;
}

const initialState: ProductsState = {
  products: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    isActive: undefined,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    hasProducts: computed(() => store.products().length > 0),
    totalProducts: computed(() => store.pagination().total),
    stats: computed(() => {
      const products = store.products();
      const activeProducts = products.filter(p => p.isActive).length;
      const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
      const outOfStock = products.filter(p => p.stock === 0).length;
      const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

      return {
        totalProducts: store.pagination().total,
        activeProducts,
        lowStock,
        outOfStock,
        totalValue,
      };
    }),
    paginationInfo: computed(() => {
      const pagination = store.pagination();
      return {
        ...pagination,
        hasNextPage: pagination.page < pagination.totalPages,
        hasPreviousPage: pagination.page > 1,
        showingFrom: (pagination.page - 1) * pagination.limit + 1,
        showingTo: Math.min(pagination.page * pagination.limit, pagination.total),
      };
    }),
  })),

  withMethods((store) => {
    const productsApiService = inject(ProductsApiService);

    return {
      loadProducts: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, { isLoading: true, error: null });
          }),
          switchMap(() => {
            const filters = {
              ...store.filters(),
              page: store.pagination().page,
              limit: store.pagination().limit,
            };

            return productsApiService.getProducts(
              filters.page,
              filters.limit,
              filters
            ).pipe(
              tap((response) => {
                patchState(store, {
                  products: response.products,
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
                  error: 'Error al cargar los productos',
                });
                return EMPTY;
              })
            );
          })
        )
      ),

      updateFilter(filterKey: keyof ProductFilters, value: any) {
        const newFilters = { ...store.filters(), [filterKey]: value };
        patchState(store, {
          filters: newFilters,
          pagination: { ...store.pagination(), page: 1 },
        });
        this.loadProducts();
      },

      clearFilters() {
        const defaultFilters: ProductFilters = {
          search: '',
          category: '',
          isActive: undefined,
        };
        patchState(store, {
          filters: defaultFilters,
          pagination: { ...store.pagination(), page: 1 },
        });
        this.loadProducts();
      },

      goToPage(page: number) {
        const currentPagination = store.pagination();
        if (page >= 1 && page <= currentPagination.totalPages) {
          patchState(store, {
            pagination: { ...currentPagination, page },
          });
          this.loadProducts();
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

      changePageSize(limit: number) {
        patchState(store, {
          pagination: { ...store.pagination(), limit, page: 1 },
        });
        this.loadProducts();
      },

      refreshProducts() {
        this.loadProducts();
      },

      clearError() {
        patchState(store, { error: null });
      },

      updateProductInList(updatedProduct: Product) {
        const products = store
          .products()
          .map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          );
        patchState(store, { products });
      },

      removeProductFromList(productId: string) {
        const products = store.products().filter((p) => p.id !== productId);
        patchState(store, { products });
        this.loadProducts();
      },

      addProductToList(newProduct: Product) {
        this.loadProducts();
      },
    };
  })
);
