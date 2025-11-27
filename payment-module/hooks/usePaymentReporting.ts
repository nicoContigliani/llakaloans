// import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
// import { 
//   PaymentsQuery, 
//   PaymentsResponse,
//   PaymentProvider,
//   PaymentFilters,
//   PaymentSort 
// } from '../types/payment';

// interface UsePaymentReportingOptions {
//   provider: PaymentProvider;
//   page?: number;
//   limit?: number;
//   filters?: PaymentFilters;
//   sort?: PaymentSort;
//   search?: string;
//   enabled?: boolean;
// }

// export const usePaymentReporting = (options: UsePaymentReportingOptions) => {
//   const {
//     provider,
//     page = 0,
//     limit = 20,
//     filters,
//     sort,
//     search,
//     enabled = true
//   } = options;

//   const query: PaymentsQuery = {
//     page,
//     limit,
//     filters,
//     sort,
//     search,
//   };

//   return useQuery({
//     queryKey: ['payments', provider, query],
//     queryFn: async (): Promise<PaymentsResponse> => {
//       const response = await fetch('/api/payment/reporting', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           provider,
//           query,
//         }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || 'Failed to fetch payments');
//       }

//       return response.json();
//     },
//     enabled,
//     staleTime: 5 * 60 * 1000, // 5 minutos
//     gcTime: 10 * 60 * 1000, // 10 minutos
//   });
// };

// export const useInfinitePaymentReporting = (
//   provider: PaymentProvider,
//   limit: number = 20,
//   filters?: PaymentFilters,
//   sort?: PaymentSort
// ) => {
//   return useInfiniteQuery({
//     queryKey: ['payments-infinite', provider, filters, sort],
//     queryFn: async ({ pageParam = 0 }): Promise<PaymentsResponse> => {
//       const query: PaymentsQuery = {
//         page: pageParam,
//         limit,
//         filters,
//         sort,
//       };

//       const response = await fetch('/api/payment/reporting', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           provider,
//           query,
//         }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || 'Failed to fetch payments');
//       }

//       return response.json();
//     },
//     initialPageParam: 0,
//     getNextPageParam: (lastPage) => {
//       return lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined;
//     },
//     getPreviousPageParam: (firstPage) => {
//       return firstPage.pagination.hasPrev ? firstPage.pagination.page - 1 : undefined;
//     },
//   });
// };



import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { 
  PaymentsQuery, 
  PaymentsResponse,
  PaymentProvider,
  PaymentFilters,
  PaymentSort 
} from '../types/payment';

interface UsePaymentReportingOptions {
  provider: PaymentProvider;
  page?: number;
  limit?: number;
  filters?: PaymentFilters;
  sort?: PaymentSort;
  search?: string;
  enabled?: boolean;
}

export const usePaymentReporting = (options: UsePaymentReportingOptions) => {
  const {
    provider,
    page = 0,
    limit = 20,
    filters,
    sort,
    search,
    enabled = true
  } = options;

  const query: PaymentsQuery = {
    page,
    limit,
    filters,
    sort,
    search,
  };

  return useQuery({
    queryKey: ['payments', provider, query],
    queryFn: async (): Promise<PaymentsResponse> => {
      const response = await fetch('/api/payment/reporting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          query,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch payments');
      }

      return response.json();
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useInfinitePaymentReporting = (
  provider: PaymentProvider,
  limit: number = 20,
  filters?: PaymentFilters,
  sort?: PaymentSort
) => {
  return useInfiniteQuery({
    queryKey: ['payments-infinite', provider, filters, sort],
    queryFn: async ({ pageParam = 0 }): Promise<PaymentsResponse> => {
      const query: PaymentsQuery = {
        page: pageParam,
        limit,
        filters,
        sort,
      };

      const response = await fetch('/api/payment/reporting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          query,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch payments');
      }

      return response.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.pagination.hasPrev ? firstPage.pagination.page - 1 : undefined;
    },
  });
};