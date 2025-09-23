/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/NotificationsView/NotificationsView.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Users, CheckSquare, Calendar, Mail, Bell, RefreshCw } from 'lucide-react';

const NotificationsView: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollIntervalRef = useRef<number>(10000); // Start with 10 seconds
  const noActivityCountRef = useRef<number>(0);
  const supabase = createClientComponentClient();

  // Fetch notifications from API
  const fetchNotifications = async (showNewNotificationAlert = false) => {
    try {
      const response = await fetch('/api/dashboard/notifications?limit=50');
      const data = await response.json();

      if (response.ok) {
        const newNotifications = data.notifications || [];
        const newUnreadCount = data.unreadCount || 0;

        // Check for new notifications since last fetch
        if (
          showNewNotificationAlert &&
          lastFetchTime &&
          notifications.length > 0
        ) {
          const newNotificationsSinceLastFetch = newNotifications.filter(
            (notification: any) => {
              const notificationTime = new Date(notification.created_at);
              return notificationTime > lastFetchTime && !notification.read;
            }
          );

          // Reset activity counter if new notifications found
          if (newNotificationsSinceLastFetch.length > 0) {
            noActivityCountRef.current = 0;
          }

          // Show browser notification for new notifications
          if (
            newNotificationsSinceLastFetch.length > 0 &&
            Notification.permission === 'granted'
          ) {
            newNotificationsSinceLastFetch.forEach((notification: any) => {
              new Notification(notification.title, {
                body: notification.message,
                icon: '/favicon.ico',
                tag: `notification-${notification.id}`,
                silent: false,
              });
            });
          }

          // Show visual indicator for new notifications
          if (newNotificationsSinceLastFetch.length > 0) {
            console.log(
              `🔔 ${newNotificationsSinceLastFetch.length} new notification(s) received`
            );
          }
        }

        setNotifications(newNotifications);
        setUnreadCount(newUnreadCount);
        setLastFetchTime(new Date());

        if (isLoading) {
          setIsLoading(false);
        }

        return true; // Indicate successful fetch
      } else {
        console.error('Error fetching notifications:', data.error);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Adaptive polling function
  const adaptivePolling = async () => {
    const success = await fetchNotifications(true);

    if (success) {
      // If no new notifications for a while, slow down polling
      noActivityCountRef.current++;

      const maxInterval = 60000; // Max 1 minute
      if (
        noActivityCountRef.current > 6 &&
        pollIntervalRef.current < maxInterval
      ) {
        pollIntervalRef.current = Math.min(
          pollIntervalRef.current * 1.5,
          maxInterval
        );
        console.log(
          `📡 Slowing down polling to ${pollIntervalRef.current / 1000}s`
        );

        // Restart interval with new timing
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = setInterval(
            adaptivePolling,
            pollIntervalRef.current
          );
        }
      }
    }
  };

  // Speed up polling when user is active
  const handleUserActivity = () => {
    if (pollIntervalRef.current > 10000) {
      pollIntervalRef.current = 10000;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = setInterval(
          adaptivePolling,
          pollIntervalRef.current
        );
      }
      console.log('🏃 User active - speeding up polling');
    }
    noActivityCountRef.current = 0; // Reset activity counter
  };

  // Set up polling for new notifications
  useEffect(() => {
    // Initial fetch
    fetchNotifications(false);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Start adaptive polling
    pollingIntervalRef.current = setInterval(
      adaptivePolling,
      pollIntervalRef.current
    );

    // Listen for user activity to speed up polling
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Fast polling when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchNotifications(true);
        handleUserActivity(); // Reset to fast polling
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, []);

  // Update timeAgo every minute for existing notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev =>
        prev.map(notification => {
          const createdAt = new Date(notification.created_at);
          const now = new Date();
          const diffInMinutes = Math.floor(
            (now.getTime() - createdAt.getTime()) / (1000 * 60)
          );

          let timeAgo;
          if (diffInMinutes < 1) timeAgo = 'Just now';
          else if (diffInMinutes < 60) timeAgo = `${diffInMinutes}m ago`;
          else {
            const diffInHours = Math.floor(diffInMinutes / 60);
            if (diffInHours < 24) timeAgo = `${diffInHours}h ago`;
            else {
              const diffInDays = Math.floor(diffInHours / 24);
              if (diffInDays < 7) timeAgo = `${diffInDays}d ago`;
              else timeAgo = createdAt.toLocaleDateString();
            }
          }

          return { ...notification, timeAgo };
        })
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'questionnaire':
        return <CheckSquare className="w-5 h-5 text-green-500" />;
      case 'appointment':
      case 'appointment_scheduled':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'reminder_sent':
        return <Mail className="w-5 h-5 text-orange-500" />;
      case 'reminder':
        return <Mail className="w-5 h-5 text-orange-500" />; // Legacy support
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/dashboard/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true }),
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      } else {
        console.error('Error marking all notifications as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/dashboard/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        console.error('Error marking notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    fetchNotifications(false);
    handleUserActivity(); // Speed up polling
  };

  return (
    <div className="bg-white border-2 border-black rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-sm rounded-full px-2 py-1 font-medium">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh notifications"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-500">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Bell className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500 text-center">You're all caught up! New notifications will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                !notification.read
                  ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => !notification.read && markNotificationAsRead(notification.id)}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {notification.timeAgo}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-1 animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsView;