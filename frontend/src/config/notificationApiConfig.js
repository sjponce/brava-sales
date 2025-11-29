import axios from 'axios';

const NOTIFICATION_API_BASE_URL = 'https://localhost:443/api/notifications';

export const notificationApi = {
  // Obtener notificaciones del usuario
  getUserNotifications: async (params = {}) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${NOTIFICATION_API_BASE_URL}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        unreadOnly: params.unreadOnly || false,
      },
    });
    return response;
  },

  // Marcar notificación como leída
  markAsRead: async (notificationId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${NOTIFICATION_API_BASE_URL}/mark-read`,
      { notificationIds: [notificationId] },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  },

  // Marcar todas las notificaciones como leídas
  markAllAsRead: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${NOTIFICATION_API_BASE_URL}/mark-read`,
      { notificationIds: null }, // null = marcar todas
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  },

  // Obtener count de notificaciones no leídas
  getUnreadCount: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${NOTIFICATION_API_BASE_URL}/unread-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },

  // Eliminar notificación
  deleteNotification: async (notificationId) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${NOTIFICATION_API_BASE_URL}/${notificationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
};

export default notificationApi;
