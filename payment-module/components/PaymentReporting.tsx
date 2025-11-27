// 'use client';

// import React, { useState, useMemo } from 'react';
// import { usePaymentReporting } from '@/payment-module/hooks/usePaymentReporting';
// import { PaymentProvider, PaymentFilters, PaymentSort } from '@/payment-module/types/payment';
// import styles from './PaymentReporting.module.css';

// interface PaymentReportingProps {
//   provider: PaymentProvider;
//   defaultFilters?: PaymentFilters;
//   defaultSort?: PaymentSort;
// }

// export const PaymentReporting: React.FC<PaymentReportingProps> = ({
//   provider,
//   defaultFilters = {},
//   defaultSort = { field: 'createdAt', direction: 'desc' }
// }) => {
//   const [page, setPage] = useState(0);
//   const [filters, setFilters] = useState<PaymentFilters>(defaultFilters);
//   const [sort, setSort] = useState<PaymentSort>(defaultSort);
//   const [expandedPayment, setExpandedPayment] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   const { data, isLoading, error, refetch } = usePaymentReporting({
//     provider,
//     page,
//     limit: 10,
//     filters,
//     sort,
//     enabled: true,
//   });

//   // Filtrar pagos localmente por búsqueda
//   const filteredPayments = useMemo(() => {
//     if (!data?.payments) return [];
//     if (!searchTerm) return data.payments;

//     const term = searchTerm.toLowerCase();
//     return data.payments.filter(payment => 
//       payment.id.toLowerCase().includes(term) ||
//       payment.payer?.email?.toLowerCase().includes(term) ||
//       payment.description?.toLowerCase().includes(term) ||
//       payment.status.toLowerCase().includes(term) ||
//       payment.paymentMethod?.toLowerCase().includes(term)
//     );
//   }, [data?.payments, searchTerm]);

//   const handleFilterChange = (newFilters: PaymentFilters) => {
//     setFilters(newFilters);
//     setPage(0);
//   };

//   const handleSortChange = (field: string) => {
//     setSort(prev => ({
//       field: field as any,
//       direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
//     }));
//   };

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//     setExpandedPayment(null);
//   };

//   const togglePaymentDetails = (paymentId: string) => {
//     setExpandedPayment(expandedPayment === paymentId ? null : paymentId);
//   };

//   const clearAllFilters = () => {
//     setFilters({});
//     setSearchTerm('');
//     setPage(0);
//   };

//   if (error) {
//     return (
//       <div className={styles.errorContainer}>
//         <h3>❌ Error loading payments</h3>
//         <p>{error.message}</p>
//         <button 
//           onClick={() => refetch()}
//           className={styles.retryButton}
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       {/* Header con controles */}
//       <div className={styles.header}>
//         <div className={styles.headerTop}>
//           <h2 className={styles.title}>📊 Payment Reports</h2>
//           <div className={styles.searchBox}>
//             <input
//               type="text"
//               placeholder="Search by ID, email, description..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className={styles.searchInput}
//             />
//             {searchTerm && (
//               <button 
//                 onClick={() => setSearchTerm('')}
//                 className={styles.clearSearch}
//               >
//                 ✕
//               </button>
//             )}
//           </div>
//         </div>

//         <FilterControls
//           filters={filters}
//           onFilterChange={handleFilterChange}
//           onClearAll={clearAllFilters}
//         />
//       </div>

//       {/* Resumen */}
//       {data?.summary && (
//         <SummaryCards summary={data.summary} />
//       )}

//       {/* Tabla de pagos */}
//       <div className={styles.tableContainer}>
//         {isLoading ? (
//           <div className={styles.loading}>
//             <div className={styles.spinner}></div>
//             Loading payments...
//           </div>
//         ) : (
//           <>
//             <PaymentTable
//               payments={filteredPayments}
//               sort={sort}
//               onSortChange={handleSortChange}
//               expandedPayment={expandedPayment}
//               onToggleDetails={togglePaymentDetails}
//             />
            
//             {/* Paginación */}
//             {data && data.pagination.total > 0 && (
//               <Pagination
//                 pagination={data.pagination}
//                 onPageChange={handlePageChange}
//                 currentPage={page}
//               />
//             )}

//             {/* Estado vacío */}
//             {filteredPayments.length === 0 && !isLoading && (
//               <div className={styles.emptyState}>
//                 <div className={styles.emptyIcon}>📭</div>
//                 <h3>No payments found</h3>
//                 <p>Try adjusting your filters or search terms</p>
//                 <button onClick={clearAllFilters} className={styles.clearButton}>
//                   Clear all filters
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // Componente de Filtros Mejorado
// const FilterControls: React.FC<{
//   filters: PaymentFilters;
//   onFilterChange: (filters: PaymentFilters) => void;
//   onClearAll: () => void;
// }> = ({ filters, onFilterChange, onClearAll }) => {
//   const [localFilters, setLocalFilters] = useState<PaymentFilters>(filters);
//   const [showFilters, setShowFilters] = useState(false);

//   const applyFilters = () => {
//     onFilterChange({ ...localFilters });
//   };

//   const hasActiveFilters = Object.keys(filters).length > 0;

//   return (
//     <div className={styles.filterSection}>
//       <div className={styles.filterHeader}>
//         <button 
//           onClick={() => setShowFilters(!showFilters)}
//           className={styles.filterToggle}
//         >
//           🎯 {showFilters ? 'Hide Filters' : 'Show Filters'}
//           {hasActiveFilters && <span className={styles.filterBadge}>Active</span>}
//         </button>
        
//         {hasActiveFilters && (
//           <button onClick={onClearAll} className={styles.clearAllButton}>
//             🗑️ Clear All
//           </button>
//         )}
//       </div>

//       {showFilters && (
//         <div className={styles.filterContainer}>
//           <div className={styles.filterGrid}>
//             <div className={styles.filterGroup}>
//               <label>Status</label>
//               <select
//                 value={localFilters.status?.[0] || ''}
//                 onChange={(e) => setLocalFilters((prev:any) => ({
//                   ...prev,
//                   status: e.target.value ? [e.target.value] : undefined
//                 }))}
//                 className={styles.filterSelect}
//               >
//                 <option value="">All Status</option>
//                 <option value="approved">✅ Approved</option>
//                 <option value="pending">⏳ Pending</option>
//                 <option value="rejected">❌ Rejected</option>
//                 <option value="refunded">↩️ Refunded</option>
//                 <option value="cancelled">🚫 Cancelled</option>
//               </select>
//             </div>

//             <div className={styles.filterGroup}>
//               <label>Date From</label>
//               <input
//                 type="date"
//                 value={localFilters.dateFrom || ''}
//                 onChange={(e) => setLocalFilters(prev => ({
//                   ...prev,
//                   dateFrom: e.target.value
//                 }))}
//                 className={styles.filterInput}
//               />
//             </div>

//             <div className={styles.filterGroup}>
//               <label>Date To</label>
//               <input
//                 type="date"
//                 value={localFilters.dateTo || ''}
//                 onChange={(e) => setLocalFilters(prev => ({
//                   ...prev,
//                   dateTo: e.target.value
//                 }))}
//                 className={styles.filterInput}
//               />
//             </div>

//             <div className={styles.filterGroup}>
//               <label>Min Amount</label>
//               <input
//                 type="number"
//                 placeholder="0"
//                 value={localFilters.minAmount || ''}
//                 onChange={(e) => setLocalFilters(prev => ({
//                   ...prev,
//                   minAmount: e.target.value ? Number(e.target.value) : undefined
//                 }))}
//                 className={styles.filterInput}
//               />
//             </div>

//             <div className={styles.filterGroup}>
//               <label>Max Amount</label>
//               <input
//                 type="number"
//                 placeholder="10000"
//                 value={localFilters.maxAmount || ''}
//                 onChange={(e) => setLocalFilters(prev => ({
//                   ...prev,
//                   maxAmount: e.target.value ? Number(e.target.value) : undefined
//                 }))}
//                 className={styles.filterInput}
//               />
//             </div>
//           </div>

//           <div className={styles.filterActions}>
//             <button onClick={applyFilters} className={styles.applyButton}>
//               ✅ Apply Filters
//             </button>
//             <button onClick={() => setLocalFilters({})} className={styles.clearButton}>
//               🗑️ Clear
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Componente de Resumen
// const SummaryCards: React.FC<{ summary: any }> = ({ summary }) => (
//   <div className={styles.summaryContainer}>
//     <div className={`${styles.summaryCard} ${styles.total}`}>
//       <div className={styles.summaryIcon}>💰</div>
//       <div className={styles.summaryContent}>
//         <h3>Total Amount</h3>
//         <p className={styles.amount}>${summary.totalAmount.toLocaleString()}</p>
//       </div>
//     </div>
//     <div className={`${styles.summaryCard} ${styles.approved}`}>
//       <div className={styles.summaryIcon}>✅</div>
//       <div className={styles.summaryContent}>
//         <h3>Approved</h3>
//         <p className={styles.amount}>${summary.approvedAmount.toLocaleString()}</p>
//       </div>
//     </div>
//     <div className={`${styles.summaryCard} ${styles.pending}`}>
//       <div className={styles.summaryIcon}>⏳</div>
//       <div className={styles.summaryContent}>
//         <h3>Pending</h3>
//         <p className={styles.amount}>${summary.pendingAmount.toLocaleString()}</p>
//       </div>
//     </div>
//     <div className={`${styles.summaryCard} ${styles.refunded}`}>
//       <div className={styles.summaryIcon}>↩️</div>
//       <div className={styles.summaryContent}>
//         <h3>Refunded</h3>
//         <p className={styles.amount}>${summary.refundedAmount.toLocaleString()}</p>
//       </div>
//     </div>
//   </div>
// );

// // Componente de Tabla Expandible
// const PaymentTable: React.FC<{
//   payments: any[];
//   sort: PaymentSort;
//   onSortChange: (field: string) => void;
//   expandedPayment: string | null;
//   onToggleDetails: (paymentId: string) => void;
// }> = ({ payments, sort, onSortChange, expandedPayment, onToggleDetails }) => (
//   <div className={styles.tableWrapper}>
//     <table className={styles.table}>
//       <thead>
//         <tr>
//           <th className={styles.expandColumn}></th>
//           <th>
//             <SortButton 
//               field="createdAt" 
//               currentSort={sort}
//               onClick={onSortChange}
//               label="Date"
//             />
//           </th>
//           <th>ID</th>
//           <th>Payer</th>
//           <th>
//             <SortButton 
//               field="amount" 
//               currentSort={sort}
//               onClick={onSortChange}
//               label="Amount"
//             />
//           </th>
//           <th>
//             <SortButton 
//               field="status" 
//               currentSort={sort}
//               onClick={onSortChange}
//               label="Status"
//             />
//           </th>
//           <th>Method</th>
//         </tr>
//       </thead>
//       <tbody>
//         {payments.map((payment) => (
//           <React.Fragment key={payment.id}>
//             <tr className={`${styles.tableRow} ${expandedPayment === payment.id ? styles.expanded : ''}`}>
//               <td className={styles.expandCell}>
//                 <button 
//                   onClick={() => onToggleDetails(payment.id)}
//                   className={styles.expandButton}
//                   aria-label={expandedPayment === payment.id ? 'Collapse details' : 'Expand details'}
//                 >
//                   {expandedPayment === payment.id ? '▼' : '►'}
//                 </button>
//               </td>
//               <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
//               <td className={styles.idCell}>{payment.id}</td>
//               <td>
//                 <div className={styles.payerInfo}>
//                   <div className={styles.payerEmail}>{payment.payer?.email || 'N/A'}</div>
//                   {payment.payer?.firstName && (
//                     <div className={styles.payerName}>
//                       {payment.payer.firstName} {payment.payer.lastName}
//                     </div>
//                   )}
//                 </div>
//               </td>
//               <td className={styles.amountCell}>
//                 <div className={styles.amountWrapper}>
//                   <span className={styles.amountValue}>
//                     ${payment.amount.toLocaleString()}
//                   </span>
//                   <span className={styles.currency}>{payment.currency}</span>
//                 </div>
//               </td>
//               <td>
//                 <span className={`${styles.status} ${styles[payment.status]}`}>
//                   {payment.status}
//                 </span>
//               </td>
//               <td className={styles.methodCell}>
//                 <span className={styles.methodBadge}>
//                   {payment.paymentMethod}
//                 </span>
//               </td>
//             </tr>
            
//             {/* Detalles expandidos */}
//             {expandedPayment === payment.id && (
//               <tr className={styles.detailsRow}>
//                 <td colSpan={7}>
//                   <PaymentDetails payment={payment} />
//                 </td>
//               </tr>
//             )}
//           </React.Fragment>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// // Componente de detalles del pago
// const PaymentDetails: React.FC<{ payment: any }> = ({ payment }) => (
//   <div className={styles.detailsContainer}>
//     <div className={styles.detailsGrid}>
//       <div className={styles.detailSection}>
//         <h4>📋 Basic Information</h4>
//         <div className={styles.detailItem}>
//           <span className={styles.detailLabel}>External Reference:</span>
//           <span className={styles.detailValue}>{payment.externalReference || 'N/A'}</span>
//         </div>
//         <div className={styles.detailItem}>
//           <span className={styles.detailLabel}>Description:</span>
//           <span className={styles.detailValue}>{payment.description || 'N/A'}</span>
//         </div>
//         <div className={styles.detailItem}>
//           <span className={styles.detailLabel}>Live Mode:</span>
//           <span className={styles.detailValue}>
//             {payment.liveMode ? '🟢 Production' : '🟡 Sandbox'}
//           </span>
//         </div>
//       </div>

//       <div className={styles.detailSection}>
//         <h4>👤 Payer Details</h4>
//         <div className={styles.detailItem}>
//           <span className={styles.detailLabel}>Email:</span>
//           <span className={styles.detailValue}>{payment.payer?.email || 'N/A'}</span>
//         </div>
//         <div className={styles.detailItem}>
//           <span className={styles.detailLabel}>Name:</span>
//           <span className={styles.detailValue}>
//             {payment.payer?.firstName || 'N/A'} {payment.payer?.lastName || ''}
//           </span>
//         </div>
//         {payment.payer?.identification && (
//           <div className={styles.detailItem}>
//             <span className={styles.detailLabel}>ID:</span>
//             <span className={styles.detailValue}>
//               {payment.payer.identification.type} {payment.payer.identification.number}
//             </span>
//           </div>
//         )}
//       </div>

//       {payment.transactionDetails && (
//         <div className={styles.detailSection}>
//           <h4>💳 Transaction Details</h4>
//           <div className={styles.detailItem}>
//             <span className={styles.detailLabel}>Net Amount:</span>
//             <span className={styles.detailValue}>
//               ${payment.transactionDetails.netAmount?.toLocaleString() || 'N/A'}
//             </span>
//           </div>
//           <div className={styles.detailItem}>
//             <span className={styles.detailLabel}>Total Paid:</span>
//             <span className={styles.detailValue}>
//               ${payment.transactionDetails.totalPaidAmount?.toLocaleString() || 'N/A'}
//             </span>
//           </div>
//         </div>
//       )}

//       <div className={styles.detailSection}>
//         <h4>⚙️ Additional Info</h4>
//         <div className={styles.detailItem}>
//           <span className={styles.detailLabel}>Payment Type:</span>
//           <span className={styles.detailValue}>{payment.paymentType || 'N/A'}</span>
//         </div>
//         <div className={styles.detailItem}>
//           <span className={styles.detailLabel}>Created:</span>
//           <span className={styles.detailValue}>
//             {new Date(payment.createdAt).toLocaleString()}
//           </span>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Componente de botón de ordenamiento
// const SortButton: React.FC<{
//   field: string;
//   currentSort: PaymentSort;
//   onClick: (field: string) => void;
//   label: string;
// }> = ({ field, currentSort, onClick, label }) => (
//   <button 
//     onClick={() => onClick(field)}
//     className={styles.sortButton}
//   >
//     {label} 
//     {currentSort.field === field && (
//       <span className={styles.sortIndicator}>
//         {currentSort.direction === 'asc' ? '↑' : '↓'}
//       </span>
//     )}
//   </button>
// );

// // Componente de Paginación Mejorado
// const Pagination: React.FC<{
//   pagination: any;
//   onPageChange: (page: number) => void;
//   currentPage: number;
// }> = ({ pagination, onPageChange, currentPage }) => {
//   const totalPages = pagination.totalPages;
  
//   // Generar rango de páginas para mostrar
//   const getPageNumbers = () => {
//     const pages = [];
//     const showPages = 5; // Número máximo de páginas a mostrar
    
//     let startPage = Math.max(0, currentPage - Math.floor(showPages / 2));
//     let endPage = Math.min(totalPages - 1, startPage + showPages - 1);
    
//     // Ajustar si estamos cerca del inicio
//     if (endPage - startPage + 1 < showPages) {
//       startPage = Math.max(0, endPage - showPages + 1);
//     }
    
//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }
    
//     return pages;
//   };

//   return (
//     <div className={styles.pagination}>
//       <div className={styles.paginationInfo}>
//         Showing {pagination.page * pagination.limit + 1} to{' '}
//         {Math.min((pagination.page + 1) * pagination.limit, pagination.total)} of{' '}
//         {pagination.total} payments
//       </div>
      
//       <div className={styles.paginationControls}>
//         <button
//           onClick={() => onPageChange(0)}
//           disabled={!pagination.hasPrev}
//           className={styles.pageButton}
//         >
//           ⏮️ First
//         </button>
        
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={!pagination.hasPrev}
//           className={styles.pageButton}
//         >
//           ◀️ Previous
//         </button>

//         {getPageNumbers().map(pageNum => (
//           <button
//             key={pageNum}
//             onClick={() => onPageChange(pageNum)}
//             className={`${styles.pageButton} ${currentPage === pageNum ? styles.activePage : ''}`}
//           >
//             {pageNum + 1}
//           </button>
//         ))}

//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={!pagination.hasNext}
//           className={styles.pageButton}
//         >
//           Next ▶️
//         </button>
        
//         <button
//           onClick={() => onPageChange(totalPages - 1)}
//           disabled={!pagination.hasNext}
//           className={styles.pageButton}
//         >
//           Last ⏭️
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaymentReporting;




'use client';

import React, { useState, useMemo } from 'react';
import { usePaymentReporting } from '@/payment-module/hooks/usePaymentReporting';
import { PaymentProvider, PaymentFilters, PaymentSort } from '@/payment-module/types/payment';
import { PaymentFilters as FiltersComponent } from './PaymentFilters';
import styles from './PaymentReporting.module.css';

interface PaymentReportingProps {
  provider: PaymentProvider;
  defaultFilters?: PaymentFilters;
  defaultSort?: PaymentSort;
}

export const PaymentReporting: React.FC<PaymentReportingProps> = ({
  provider,
  defaultFilters = {},
  defaultSort = { field: 'createdAt', direction: 'desc' }
}) => {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<PaymentFilters>(defaultFilters);
  const [sort, setSort] = useState<PaymentSort>(defaultSort);
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error, refetch } = usePaymentReporting({
    provider,
    page,
    limit: 10,
    filters,
    sort,
    enabled: true,
  });

  // Filtrar pagos localmente por búsqueda
  const filteredPayments = useMemo(() => {
    if (!data?.payments) return [];
    if (!searchTerm) return data.payments;

    const term = searchTerm.toLowerCase();
    return data.payments.filter(payment => 
      payment.id.toLowerCase().includes(term) ||
      payment.payer?.email?.toLowerCase().includes(term) ||
      payment.description?.toLowerCase().includes(term) ||
      payment.status.toLowerCase().includes(term) ||
      payment.paymentMethod?.toLowerCase().includes(term) ||
      payment.metadata?.propertyId?.toLowerCase().includes(term) ||
      payment.metadata?.loanId?.toLowerCase().includes(term) ||
      payment.metadata?.reservationId?.toLowerCase().includes(term)
    );
  }, [data?.payments, searchTerm]);

  const handleFilterChange = (newFilters: PaymentFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleSortChange = (field: string) => {
    setSort(prev => ({
      field: field as any,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setExpandedPayment(null);
  };

  const togglePaymentDetails = (paymentId: string) => {
    setExpandedPayment(expandedPayment === paymentId ? null : paymentId);
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchTerm('');
    setPage(0);
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>❌ Error cargando pagos</h3>
        <p>{error.message}</p>
        <button 
          onClick={() => refetch()}
          className={styles.retryButton}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header con controles */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h2 className={styles.title}>📊 Reportes de Pagos</h2>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Buscar por ID, email, propiedad, préstamo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className={styles.clearSearch}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <FiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={clearAllFilters}
        />
      </div>

      {/* Resumen */}
      {data?.summary && (
        <SummaryCards summary={data.summary} />
      )}

      {/* Tabla de pagos */}
      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            Cargando pagos...
          </div>
        ) : (
          <>
            <PaymentTable
              payments={filteredPayments}
              sort={sort}
              onSortChange={handleSortChange}
              expandedPayment={expandedPayment}
              onToggleDetails={togglePaymentDetails}
            />
            
            {/* Paginación */}
            {data && data.pagination.total > 0 && (
              <Pagination
                pagination={data.pagination}
                onPageChange={handlePageChange}
                currentPage={page}
              />
            )}

            {/* Estado vacío */}
            {filteredPayments.length === 0 && !isLoading && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📭</div>
                <h3>No se encontraron pagos</h3>
                <p>Intente ajustar sus filtros o términos de búsqueda</p>
                <button onClick={clearAllFilters} className={styles.clearButton}>
                  Limpiar todos los filtros
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Componente de Resumen (se mantiene igual)
const SummaryCards: React.FC<{ summary: any }> = ({ summary }) => (
  <div className={styles.summaryContainer}>
    <div className={`${styles.summaryCard} ${styles.total}`}>
      <div className={styles.summaryIcon}>💰</div>
      <div className={styles.summaryContent}>
        <h3>Total</h3>
        <p className={styles.amount}>${summary.totalAmount.toLocaleString()}</p>
      </div>
    </div>
    <div className={`${styles.summaryCard} ${styles.approved}`}>
      <div className={styles.summaryIcon}>✅</div>
      <div className={styles.summaryContent}>
        <h3>Aprobados</h3>
        <p className={styles.amount}>${summary.approvedAmount.toLocaleString()}</p>
      </div>
    </div>
    <div className={`${styles.summaryCard} ${styles.pending}`}>
      <div className={styles.summaryIcon}>⏳</div>
      <div className={styles.summaryContent}>
        <h3>Pendientes</h3>
        <p className={styles.amount}>${summary.pendingAmount.toLocaleString()}</p>
      </div>
    </div>
    {summary.accommodationAmount > 0 && (
      <div className={`${styles.summaryCard} ${styles.accommodation}`}>
        <div className={styles.summaryIcon}>🏨</div>
        <div className={styles.summaryContent}>
          <h3>Alojamiento</h3>
          <p className={styles.amount}>${summary.accommodationAmount.toLocaleString()}</p>
        </div>
      </div>
    )}
    {summary.loanAmount > 0 && (
      <div className={`${styles.summaryCard} ${styles.loan}`}>
        <div className={styles.summaryIcon}>💰</div>
        <div className={styles.summaryContent}>
          <h3>Préstamos</h3>
          <p className={styles.amount}>${summary.loanAmount.toLocaleString()}</p>
        </div>
      </div>
    )}
  </div>
);

// Componente de Tabla (se mantiene igual, pero puedes agregar columnas específicas)
const PaymentTable: React.FC<{
  payments: any[];
  sort: PaymentSort;
  onSortChange: (field: string) => void;
  expandedPayment: string | null;
  onToggleDetails: (paymentId: string) => void;
}> = ({ payments, sort, onSortChange, expandedPayment, onToggleDetails }) => (
  <div className={styles.tableWrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.expandColumn}></th>
          <th>
            <SortButton 
              field="createdAt" 
              currentSort={sort}
              onClick={onSortChange}
              label="Fecha"
            />
          </th>
          <th>ID</th>
          <th>Pagador</th>
          <th>
            <SortButton 
              field="amount" 
              currentSort={sort}
              onClick={onSortChange}
              label="Monto"
            />
          </th>
          <th>
            <SortButton 
              field="status" 
              currentSort={sort}
              onClick={onSortChange}
              label="Estado"
            />
          </th>
          <th>Método</th>
          <th>Categoría</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((payment) => (
          <React.Fragment key={payment.id}>
            <tr className={`${styles.tableRow} ${expandedPayment === payment.id ? styles.expanded : ''}`}>
              <td className={styles.expandCell}>
                <button 
                  onClick={() => onToggleDetails(payment.id)}
                  className={styles.expandButton}
                >
                  {expandedPayment === payment.id ? '▼' : '►'}
                </button>
              </td>
              <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
              <td className={styles.idCell}>{payment.id}</td>
              <td>
                <div className={styles.payerInfo}>
                  <div className={styles.payerEmail}>{payment.payer?.email || 'N/A'}</div>
                </div>
              </td>
              <td className={styles.amountCell}>
                <div className={styles.amountWrapper}>
                  <span className={styles.amountValue}>
                    ${payment.amount.toLocaleString()}
                  </span>
                  <span className={styles.currency}>{payment.currency}</span>
                </div>
              </td>
              <td>
                <span className={`${styles.status} ${styles[payment.status]}`}>
                  {payment.status}
                </span>
              </td>
              <td className={styles.methodCell}>
                <span className={styles.methodBadge}>
                  {payment.paymentMethod}
                </span>
              </td>
              <td>
                <span className={styles.categoryBadge}>
                  {payment.metadata?.category || 'other'}
                </span>
              </td>
            </tr>
            
            {expandedPayment === payment.id && (
              <tr className={styles.detailsRow}>
                <td colSpan={8}>
                  <PaymentDetails payment={payment} />
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
);

// Componente de detalles (se mantiene igual)
const PaymentDetails: React.FC<{ payment: any }> = ({ payment }) => (
  <div className={styles.detailsContainer}>
    <div className={styles.detailsGrid}>
      {/* Detalles básicos */}
      <div className={styles.detailSection}>
        <h4>📋 Información Básica</h4>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Referencia Externa:</span>
          <span className={styles.detailValue}>{payment.externalReference || 'N/A'}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Descripción:</span>
          <span className={styles.detailValue}>{payment.description || 'N/A'}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Modo:</span>
          <span className={styles.detailValue}>
            {payment.liveMode ? '🟢 Producción' : '🟡 Sandbox'}
          </span>
        </div>
      </div>

      {/* Metadata específica */}
      <div className={styles.detailSection}>
        <h4>🏷️ Metadata</h4>
        {payment.metadata?.propertyId && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Propiedad:</span>
            <span className={styles.detailValue}>{payment.metadata.propertyId}</span>
          </div>
        )}
        {payment.metadata?.loanId && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Préstamo:</span>
            <span className={styles.detailValue}>{payment.metadata.loanId}</span>
          </div>
        )}
        {payment.metadata?.reservationId && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Reserva:</span>
            <span className={styles.detailValue}>{payment.metadata.reservationId}</span>
          </div>
        )}
        {payment.metadata?.installmentNumber && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Cuota:</span>
            <span className={styles.detailValue}>
              {payment.metadata.installmentNumber}
              {payment.metadata.totalInstallments && ` de ${payment.metadata.totalInstallments}`}
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Componentes auxiliares (se mantienen igual)
const SortButton: React.FC<{
  field: string;
  currentSort: PaymentSort;
  onClick: (field: string) => void;
  label: string;
}> = ({ field, currentSort, onClick, label }) => (
  <button 
    onClick={() => onClick(field)}
    className={styles.sortButton}
  >
    {label} 
    {currentSort.field === field && (
      <span className={styles.sortIndicator}>
        {currentSort.direction === 'asc' ? '↑' : '↓'}
      </span>
    )}
  </button>
);

const Pagination: React.FC<{
  pagination: any;
  onPageChange: (page: number) => void;
  currentPage: number;
}> = ({ pagination, onPageChange, currentPage }) => {
  const totalPages = pagination.totalPages;
  
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    
    let startPage = Math.max(0, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages - 1, startPage + showPages - 1);
    
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(0, endPage - showPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className={styles.pagination}>
      <div className={styles.paginationInfo}>
        Mostrando {pagination.page * pagination.limit + 1} a{' '}
        {Math.min((pagination.page + 1) * pagination.limit, pagination.total)} de{' '}
        {pagination.total} pagos
      </div>
      
      <div className={styles.paginationControls}>
        <button
          onClick={() => onPageChange(0)}
          disabled={!pagination.hasPrev}
          className={styles.pageButton}
        >
          ⏮️ Primera
        </button>
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPrev}
          className={styles.pageButton}
        >
          ◀️ Anterior
        </button>

        {getPageNumbers().map(pageNum => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`${styles.pageButton} ${currentPage === pageNum ? styles.activePage : ''}`}
          >
            {pageNum + 1}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNext}
          className={styles.pageButton}
        >
          Siguiente ▶️
        </button>
        
        <button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={!pagination.hasNext}
          className={styles.pageButton}
        >
          Última ⏭️
        </button>
      </div>
    </div>
  );
};

export default PaymentReporting;