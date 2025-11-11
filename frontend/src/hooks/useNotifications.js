/* eslint-disable no-underscore-dangle */
import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '@/config/notificationApiConfig';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    hasNext: false,
    hasPrev: false,
  });

  // Obtener notificaciones
  const fetchNotifications = useCallback(async (page = 1, unreadOnly = false) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const response = await notificationApi.getUserNotifications({
        page,
        limit: 10,
        unreadOnly,
      });

      // Procesar las notificaciones para aplanar la estructura
      const processedNotifications = (response.data.result || []).map((item) => ({
        // Tomar ID del NotificationRecipient
        id: item._id,
        _id: item._id,

        // Datos anidados de la notificación (primero)
        ...item.notification,
        // Datos del nivel superior (NotificationRecipient) - estos deben sobrescribir
        isRead: item.isRead,
        actionRequired: item.actionRequired,
        actionTaken: item.actionTaken,
        recipient: item.recipient,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,

        // IDs para referencia
        notificationId: item.notification._id,
        recipientId: item._id,
      }));

      if (page === 1) {
        setNotifications(processedNotifications);
      } else {
        setNotifications((prev) => [...prev, ...processedNotifications]);
      }

      setPagination({
        current: response.data.pagination?.current || 1,
        total: response.data.pagination?.total || 1,
        hasNext: response.data.pagination?.hasNext || false,
        hasPrev: response.data.pagination?.hasPrev || false,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar notificaciones');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Obtener count de no leídas
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      setUnreadCount(response.data.result?.count || 0);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, []);

  // Marcar como leída
  const markAsRead = useCallback(async (notificationId) => {
    try {
      // Buscar la notificación para obtener el ID correcto
      const notification = notifications.find((n) => n.id === notificationId
      || n._id === notificationId);

      console.log('Marking as read:', { notificationId, notification });

      // Usar el notificationId de la notificación anidada
      const realNotificationId = notification?.notificationId || notificationId;

      await notificationApi.markAsRead(realNotificationId);

      // Actualizar estado local
      setNotifications((prev) => prev.map((notif) => {
        if (notif.id === notificationId || notif._id === notificationId) {
          return { ...notif, isRead: true };
        }
        return notif;
      }));

      // Actualizar count
      await fetchUnreadCount();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al marcar como leída');
      console.error('Error marking as read:', err);
    }
  }, [fetchUnreadCount]);

  // Marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationApi.markAllAsRead();

      // Actualizar estado local
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));

      setUnreadCount(0);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al marcar todas como leídas');
      console.error('Error marking all as read:', err);
    }
  }, []);

  // Eliminar notificación
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationApi.deleteNotification(notificationId);

      // Actualizar estado local
      setNotifications((prev) => prev.filter((notification) => (
        notification.id !== notificationId && notification._id !== notificationId
      )));

      // Actualizar count si era no leída
      const deletedNotification = notifications.find((n) => (
        n.id === notificationId || n._id === notificationId
      ));
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar notificación');
      console.error('Error deleting notification:', err);
    }
  }, [notifications]);

  // Cargar más notificaciones (paginación)
  const loadMore = useCallback(() => {
    if (pagination.hasNext && !loading && !loadingMore) {
      fetchNotifications(pagination.current + 1);
    }
  }, [pagination.current, pagination.hasNext, loading, loadingMore, fetchNotifications]);

  // Refrescar notificaciones
  const refresh = useCallback(() => {
    fetchNotifications(1);
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  // Cargar datos iniciales
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Polling para obtener nuevas notificaciones
  useEffect(() => {
    const interval = setInterval(async () => {
      // Obtener el contador actual
      const currentUnreadCount = unreadCount;

      // Verificar si hay cambios en el contador
      try {
        const response = await notificationApi.getUnreadCount();
        const newUnreadCount = response.data.result?.count || 0;

        // Si el contador cambió, actualizar tanto el contador como las notificaciones
        if (newUnreadCount !== currentUnreadCount) {
          setUnreadCount(newUnreadCount);

          // Actualizar notificaciones transparentemente
          // Solo si aumentó el contador (nuevas notificaciones) o si ya hay notificaciones cargadas
          if (newUnreadCount > currentUnreadCount || notifications.length > 0) {
            fetchNotifications(1); // Refrescar desde la página 1
          }
        }
      } catch (err) {
        console.error('Error in notification polling:', err);
      }
    }, 30000); // Cada 30 segundos

    return () => clearInterval(interval);
  }, [fetchUnreadCount, unreadCount, notifications.length, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    loadingMore,
    error,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
    refresh,
  };
};

export default useNotifications;
