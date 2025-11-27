'use client';

import { ProtectedRoute } from '../../clerk-modules/components/auth/ProtectedRoute';
import { AuthButtons } from '../../clerk-modules/components/auth/AuthButtons';
import { useAuth } from '../../clerk-modules/utils/auth-utils';
import Link from 'next/link';
import styles from './dashboard.module.css';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

// Definir el tipo de datos para los préstamos
type Loan = {
  id: number;
  amount: number;
  status: 'Activo' | 'Pagado' | 'Pendiente';
  interestRate: number;
  nextPayment: string;
  totalPaid: number;
};

export default function Dashboard() {
  const { user } = useAuth();

  // Datos de ejemplo para préstamos
  const mockLoans: Loan[] = useMemo(() => [
    { id: 1, amount: 50000, status: 'Activo', interestRate: 12.5, nextPayment: '2024-01-15', totalPaid: 12500 },
    { id: 2, amount: 25000, status: 'Pagado', interestRate: 10.0, nextPayment: '-', totalPaid: 25000 },
    { id: 3, amount: 75000, status: 'Pendiente', interestRate: 15.0, nextPayment: '2024-01-20', totalPaid: 0 },
    { id: 4, amount: 100000, status: 'Activo', interestRate: 11.5, nextPayment: '2024-01-25', totalPaid: 30000 },
    { id: 5, amount: 35000, status: 'Pagado', interestRate: 9.5, nextPayment: '-', totalPaid: 35000 }
  ], []);

  // Definir las columnas con TanStack Table
  const columns = useMemo<ColumnDef<Loan>[]>(() => [
    {
      accessorKey: 'amount',
      header: 'Monto',
      cell: ({ getValue }) => {
        const amount = getValue() as number;
        return (
          <span className={styles.amountCell}>
            <strong>${amount.toLocaleString()}</strong>
          </span>
        );
      },
    },
    {
      accessorKey: 'interestRate',
      header: 'Tasa',
      cell: ({ getValue }) => {
        const rate = getValue() as number;
        return <span>{rate}%</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const getStatusClass = (status: string) => {
          switch (status) {
            case 'Activo': return styles.statusActive;
            case 'Pagado': return styles.statusPaid;
            case 'Pendiente': return styles.statusPending;
            default: return styles.statusPending;
          }
        };
        return (
          <span className={`${styles.statusBadge} ${getStatusClass(status)}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'nextPayment',
      header: 'Próximo Pago',
      cell: ({ getValue }) => <span>{getValue() as string}</span>,
    },
    {
      accessorKey: 'totalPaid',
      header: 'Pagado',
      cell: ({ getValue }) => {
        const paid = getValue() as number;
        return <span>${paid.toLocaleString()}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const loan = row.original;
        return (
          <div className={styles.actionButtons}>
            <button className={styles.actionLink}>
              Detalles
            </button>
            {loan.status === 'Activo' && (
              <button className={`${styles.actionLink} ${styles.success}`}>
                Pagar
              </button>
            )}
          </div>
        );
      },
    },
  ], []);

  // Crear la instancia de la tabla
  const table = useReactTable({
    data: mockLoans,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalActiveLoans = mockLoans.filter(loan => loan.status === 'Activo').length;
  const totalPending = mockLoans.filter(loan => loan.status === 'Pendiente').length;
  const totalAmount = mockLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const averageInterestRate = mockLoans.reduce((sum, loan) => sum + loan.interestRate, 0) / mockLoans.length;

  return (
    <ProtectedRoute>
      <div className={styles.dashboard}>
        <div className={styles.container}>
          <header className={styles.header}>
     
          </header>
          <br />
          <main className={styles.main}>
            {/* Welcome Card */}
            <div className={styles.welcomeCard}>
              <div className={styles.welcomeHeader}>
                <div className={styles.welcomeText}>
                  <h2>¡Bienvenido, {user?.firstName} {user?.lastName}! 👋</h2>
                  <p>Gestiona tus préstamos y solicita nuevos financiamientos</p>
                </div>
                <Link href="/loans/create" className={styles.primaryButton}>
                  + Solicitar Préstamo
                </Link>
              </div>
              
              {/* Stats Grid */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{totalActiveLoans}</div>
                  <div className={styles.statLabel}>Préstamos Activos</div>
                  <div className={styles.statDescription}>En proceso de pago</div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statValue}>${totalAmount.toLocaleString()}</div>
                  <div className={styles.statLabel}>Total Solicitado</div>
                  <div className={styles.statDescription}>Monto total aprobado</div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{totalPending}</div>
                  <div className={styles.statLabel}>Pendientes</div>
                  <div className={styles.statDescription}>En revisión</div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{averageInterestRate.toFixed(1)}%</div>
                  <div className={styles.statLabel}>Tasa Promedio</div>
                  <div className={styles.statDescription}>Interés anual</div>
                </div>
              </div>

              {/* Info Grid */}
              <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                  <h3>Información Personal</h3>
                  <div className={styles.infoContent}>
                    <div className={styles.infoItem}>
                      <strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}
                    </div>
                    <div className={styles.infoItem}>
                      <strong>Usuario ID:</strong> {user?.id?.substring(0, 8)}...
                    </div>
                    <div className={styles.infoItem}>
                      <strong>Miembro desde:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className={styles.infoCard}>
                  <h3>Acciones Rápidas</h3>
                  <div className={styles.quickActions}>
                    <Link href="/loans/create" className={styles.actionButton}>
                      Nuevo Préstamo
                    </Link>
                    <Link href="/loans" className={styles.actionButton}>
                      Ver Todos
                    </Link>
                    <Link href="/payments" className={styles.actionButton}>
                      Realizar Pago
                    </Link>
                    <Link href="/user-profile" className={styles.actionButton}>
                      Mi Perfil
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Loans Section con TanStack Table */}
            <div className={styles.loansSection}>
              <div className={styles.sectionHeader}>
                <h2>Préstamos Recientes</h2>
                <Link href="/loans" className={styles.viewAll}>
                  Ver todos →
                </Link>
              </div>
              
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <th key={header.id}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map(row => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}