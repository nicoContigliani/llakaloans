import { useState, useEffect, useCallback } from 'react';
import { NotificationHistory, NotificationFilters } from '../types/notification';

interface NotificationStats {
  _id: string;
  total: number;
  sent: number;
  failed: number;
}

interface UseNotificationHistoryReturn {
  history: NotificationHistory[];
  loading: boolean;
  error: string | null;
  filters: NotificationFilters;
  setFilters: (filters: NotificationFilters) => void;
  stats: NotificationStats[] | null;
  refresh: () => void;
}

export const useNotificationHistory = (): UseNotificationHistoryReturn => {
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<NotificationFilters>({});
  const [stats, setStats] = useState<NotificationStats[] | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.channel) queryParams.append('channel', filters.channel);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`/api/notification/history?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notification history');
      }
      
      const data = await response.json();
      setHistory(data.history || []);
      setStats(data.stats || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const refresh = useCallback(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    filters,
    setFilters,
    stats,
    refresh,
  };
};