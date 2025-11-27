'use client';

import React, { useState, useEffect } from 'react';
import { useNotificationHistory } from '../hooks/useNotificationHistory';
import { NotificationFilters, NotificationHistory as NotificationHistoryType } from '../types/notification';
import styles from './NotificationHistory.module.css';

interface NotificationHistoryProps {
  limit?: number;
  showFilters?: boolean;
  className?: string;
}

export const NotificationHistory: React.FC<NotificationHistoryProps> = ({
  limit = 20,
  showFilters = true,
  className = ''
}) => {
  const { history, loading, error, filters, setFilters, stats } = useNotificationHistory();
  const [localLimit, setLocalLimit] = useState(limit);

  const handleFilterChange = (newFilters: Partial<NotificationFilters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return styles.statusSent;
      case 'failed':
        return styles.statusFailed;
      case 'pending':
        return styles.statusPending;
      default:
        return '';
    }
  };

  if (error) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.error}>
          Error loading notification history: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Notification History</h3>
        {stats && (
          <div className={styles.stats}>
            {stats.map(stat => (
              <div key={stat._id} className={styles.statItem}>
                <span className={styles.statChannel}>{stat._id}:</span>
                <span className={styles.statCount}>{stat.sent}/{stat.total}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showFilters && (
        <div className={styles.filters}>
          <select
            value={filters.channel || ''}
            onChange={(e) => handleFilterChange({ 
              channel: e.target.value as NotificationFilters['channel'] 
            })}
            className={styles.filterSelect}
          >
            <option value="">All Channels</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
          </select>

          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange({ 
              status: e.target.value as NotificationFilters['status'] 
            })}
            className={styles.filterSelect}
          >
            <option value="">All Status</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>

          <input
            type="text"
            placeholder="Search..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            className={styles.searchInput}
          />
        </div>
      )}

      <div className={styles.historyList}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : history.length === 0 ? (
          <div className={styles.empty}>No notifications found</div>
        ) : (
          history.slice(0, localLimit).map(notification => (
            <div key={notification.id} className={styles.historyItem}>
              <div className={styles.itemHeader}>
                <span className={styles.channel}>{notification.channel}</span>
                <span className={`${styles.status} ${getStatusColor(notification.status)}`}>
                  {notification.status}
                </span>
                <span className={styles.date}>
                  {formatDate(notification.createdAt)}
                </span>
              </div>
              
              <div className={styles.itemContent}>
                {notification.subject && (
                  <div className={styles.subject}>{notification.subject}</div>
                )}
                <div className={styles.content}>{notification.content}</div>
                <div className={styles.recipients}>
                  To: {notification.to.join(', ')}
                </div>
                {notification.error && (
                  <div className={styles.errorMessage}>
                    Error: {notification.error}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {history.length > localLimit && (
        <button
          onClick={() => setLocalLimit(localLimit + 10)}
          className={styles.loadMore}
        >
          Load More
        </button>
      )}
    </div>
  );
};