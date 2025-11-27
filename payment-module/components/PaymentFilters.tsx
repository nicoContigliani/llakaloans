'use client';

import React, { useState } from 'react';
import { PaymentFilters as PaymentFiltersType, PaymentCategory, PaymentFrequency } from '../types/payment';
import styles from './PaymentReporting.module.css';

interface PaymentFiltersProps {
  filters: PaymentFiltersType;
  onFilterChange: (filters: PaymentFiltersType) => void;
  onClearAll: () => void;
}

export const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  filters,
  onFilterChange,
  onClearAll
}) => {
  const [localFilters, setLocalFilters] = useState<PaymentFiltersType>(filters);
  const [activeTab, setActiveTab] = useState<'basic' | 'accommodation' | 'loans' | 'advanced'>('basic');

  const applyFilters = () => {
    onFilterChange({ ...localFilters });
  };

  const clearFilters = () => {
    const cleared = {};
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  // Contar filtros activos por categoría
  const getActiveFilterCount = (filterType: keyof PaymentFiltersType) => {
    const value = filters[filterType];
    if (Array.isArray(value)) return value.length;
    return value ? 1 : 0;
  };

  const basicFilterCount = 
    getActiveFilterCount('status') +
    getActiveFilterCount('dateFrom') +
    getActiveFilterCount('dateTo') +
    getActiveFilterCount('minAmount') +
    getActiveFilterCount('maxAmount');

  const accommodationFilterCount = 
    getActiveFilterCount('propertyId') +
    getActiveFilterCount('reservationId') +
    getActiveFilterCount('accommodationCategory');

  const loansFilterCount = 
    getActiveFilterCount('loanId') +
    getActiveFilterCount('installmentNumber') +
    getActiveFilterCount('dueDateFrom') +
    getActiveFilterCount('dueDateTo');

  const advancedFilterCount = 
    getActiveFilterCount('category') +
    getActiveFilterCount('frequency') +
    getActiveFilterCount('userId') +
    getActiveFilterCount('liveMode');

  return (
    <div className={styles.filterSection}>
      <div className={styles.filterHeader}>
        <div className={styles.filterTabs}>
          <button
            onClick={() => setActiveTab('basic')}
            className={`${styles.filterTab} ${activeTab === 'basic' ? styles.activeTab : ''}`}
          >
            🎯 Básicos
            {basicFilterCount > 0 && <span className={styles.filterCount}>{basicFilterCount}</span>}
          </button>
          <button
            onClick={() => setActiveTab('accommodation')}
            className={`${styles.filterTab} ${activeTab === 'accommodation' ? styles.activeTab : ''}`}
          >
            🏨 Alojamiento
            {accommodationFilterCount > 0 && <span className={styles.filterCount}>{accommodationFilterCount}</span>}
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`${styles.filterTab} ${activeTab === 'loans' ? styles.activeTab : ''}`}
          >
            💰 Préstamos
            {loansFilterCount > 0 && <span className={styles.filterCount}>{loansFilterCount}</span>}
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`${styles.filterTab} ${activeTab === 'advanced' ? styles.activeTab : ''}`}
          >
            ⚙️ Avanzados
            {advancedFilterCount > 0 && <span className={styles.filterCount}>{advancedFilterCount}</span>}
          </button>
        </div>
        
        {hasActiveFilters && (
          <button onClick={onClearAll} className={styles.clearAllButton}>
            🗑️ Limpiar Todo
          </button>
        )}
      </div>

      <div className={styles.filterContainer}>
        {/* PESTAÑA BÁSICOS */}
        {activeTab === 'basic' && (
          <div className={styles.filterGrid}>
            <div className={styles.filterGroup}>
              <label>Estado del Pago</label>
              <select
                multiple
                value={localFilters.status || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setLocalFilters(prev => ({ ...prev, status: selected as any }));
                }}
                className={styles.filterSelect}
                size={6}
              >
                <option value="approved">✅ Aprobado</option>
                <option value="pending">⏳ Pendiente</option>
                <option value="rejected">❌ Rechazado</option>
                <option value="refunded">↩️ Reembolsado</option>
                <option value="cancelled">🚫 Cancelado</option>
                <option value="in_process">🔄 En proceso</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Monto Mínimo</label>
              <input
                type="number"
                placeholder="0"
                value={localFilters.minAmount || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  minAmount: e.target.value ? Number(e.target.value) : undefined
                }))}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Monto Máximo</label>
              <input
                type="number"
                placeholder="100000"
                value={localFilters.maxAmount || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  maxAmount: e.target.value ? Number(e.target.value) : undefined
                }))}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Fecha Desde</label>
              <input
                type="date"
                value={localFilters.dateFrom || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  dateFrom: e.target.value
                }))}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Fecha Hasta</label>
              <input
                type="date"
                value={localFilters.dateTo || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  dateTo: e.target.value
                }))}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Método de Pago</label>
              <select
                multiple
                value={localFilters.paymentMethod || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setLocalFilters(prev => ({ ...prev, paymentMethod: selected }));
                }}
                className={styles.filterSelect}
                size={4}
              >
                <option value="credit_card">💳 Tarjeta Crédito</option>
                <option value="debit_card">💳 Tarjeta Débito</option>
                <option value="bank_transfer">🏦 Transferencia</option>
                <option value="digital_wallet">📱 Billetera Digital</option>
              </select>
            </div>
          </div>
        )}

        {/* PESTAÑA ALOJAMIENTO */}
        {activeTab === 'accommodation' && (
          <div className={styles.filterGrid}>
            <div className={styles.filterGroup}>
              <label>ID de Propiedad</label>
              <input
                type="text"
                placeholder="prop_123..."
                value={localFilters.propertyId || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  propertyId: e.target.value
                }))}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>ID de Reserva</label>
              <input
                type="text"
                placeholder="res_456..."
                value={localFilters.reservationId || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  reservationId: e.target.value
                }))}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Categoría Alojamiento</label>
              <select
                multiple
                value={localFilters.accommodationCategory || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setLocalFilters(prev => ({ ...prev, accommodationCategory: selected }));
                }}
                className={styles.filterSelect}
                size={4}
              >
                <option value="hotel">🏨 Hotel</option>
                <option value="apartment">🏢 Apartamento</option>
                <option value="house">🏠 Casa</option>
                <option value="hostel">🛏️ Hostel</option>
              </select>
            </div>
          </div>
        )}

        {/* PESTAÑA PRÉSTAMOS */}
        {activeTab === 'loans' && (
          <div className={styles.filterGrid}>
            <div className={styles.filterGroup}>
              <label>ID de Préstamo</label>
              <input
                type="text"
                placeholder="loan_789..."
                value={localFilters.loanId || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  loanId: e.target.value
                }))}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Número de Cuota</label>
              <input
                type="number"
                placeholder="1"
                min="1"
                value={localFilters.installmentNumber || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  installmentNumber: e.target.value ? Number(e.target.value) : undefined
                }))}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Total de Cuotas</label>
              <input
                type="number"
                placeholder="12"
                min="1"
                value={localFilters.totalInstallments || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  totalInstallments: e.target.value ? Number(e.target.value) : undefined
                }))}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Vencimiento Desde</label>
              <input
                type="date"
                value={localFilters.dueDateFrom || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  dueDateFrom: e.target.value
                }))}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Vencimiento Hasta</label>
              <input
                type="date"
                value={localFilters.dueDateTo || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  dueDateTo: e.target.value
                }))}
                className={styles.filterInput}
              />
            </div>
          </div>
        )}

        {/* PESTAÑA AVANZADOS */}
        {activeTab === 'advanced' && (
          <div className={styles.filterGrid}>
            <div className={styles.filterGroup}>
              <label>Categoría de Pago</label>
              <select
                multiple
                value={localFilters.category || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setLocalFilters(prev => ({ ...prev, category: selected as PaymentCategory[] }));
                }}
                className={styles.filterSelect}
                size={6}
              >
                <option value="accommodation">🏨 Alojamiento</option>
                <option value="loan">💰 Préstamo</option>
                <option value="subscription">📅 Suscripción</option>
                <option value="service">🔧 Servicio</option>
                <option value="product">📦 Producto</option>
                <option value="refund">↩️ Reembolso</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Frecuencia</label>
              <select
                multiple
                value={localFilters.frequency || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setLocalFilters(prev => ({ ...prev, frequency: selected as PaymentFrequency[] }));
                }}
                className={styles.filterSelect}
                size={5}
              >
                <option value="one_time">🔄 Único</option>
                <option value="daily">📅 Diario</option>
                <option value="weekly">📅 Semanal</option>
                <option value="monthly">📅 Mensual</option>
                <option value="yearly">📅 Anual</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>ID de Usuario</label>
              <input
                type="text"
                placeholder="user_123..."
                value={localFilters.userId || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  userId: e.target.value
                }))}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Email del Pagador</label>
              <input
                type="email"
                placeholder="cliente@email.com"
                value={localFilters.payerEmail || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  payerEmail: e.target.value
                }))}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Modo</label>
              <select
                value={localFilters.liveMode === undefined ? '' : localFilters.liveMode.toString()}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  liveMode: e.target.value === '' ? undefined : e.target.value === 'true'
                }))}
                className={styles.filterSelect}
              >
                <option value="">Todos</option>
                <option value="true">🟢 Producción</option>
                <option value="false">🟡 Sandbox</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Con Cuotas</label>
              <select
                value={localFilters.hasInstallments === undefined ? '' : localFilters.hasInstallments.toString()}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  hasInstallments: e.target.value === '' ? undefined : e.target.value === 'true'
                }))}
                className={styles.filterSelect}
              >
                <option value="">Todos</option>
                <option value="true">✅ Con cuotas</option>
                <option value="false">❌ Sin cuotas</option>
              </select>
            </div>
          </div>
        )}

        <div className={styles.filterActions}>
          <button onClick={applyFilters} className={styles.applyButton}>
            ✅ Aplicar Filtros
          </button>
          <button onClick={clearFilters} className={styles.clearButton}>
            🗑️ Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};