import React, { useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  IconButton,
  Button,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Close,
  NotificationsActive,
  Info,
  Warning,
  Error as ErrorIcon,
  CheckCircle,
  Delete,
  MarkEmailRead,
  Refresh,
} from '@mui/icons-material';
import useNotifications from '@/hooks/useNotifications';
import { ModalSalesOrderContext } from '@/context/modalSalesOrderContext/ModalSalesOrderContext';

const NotificationCenter = ({ open, onClose }) => {
  const { openModal } = useContext(ModalSalesOrderContext);
  const {
    notifications,
    unreadCount,
    loading,
    loadingMore,
    error,
    pagination,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
    refresh,
  } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ORDER_CREATED':
      case 'ORDER_STATUS_CHANGED':
        return <CheckCircle color="success" />;
      case 'PAYMENT_RECEIVED':
        return <CheckCircle color="success" />;
      case 'INSTALLMENT_DUE':
      case 'PAYMENT_REMINDER':
        return <Warning color="warning" />;
      case 'PAYMENT_OVERDUE':
        return <Warning color="error" />;
      case 'STOCK_LOW':
      case 'STOCK_RESERVED':
      case 'STOCK_SHIPPED':
        return <ErrorIcon color="action" />;
      case 'CUSTOMER_REGISTERED':
      case 'SELLER_ASSIGNED':
        return <Info color="primary" />;
      default:
        return <Info color="primary" />;
    }
  };

  const getNotificationTitle = (type) => {
    switch (type) {
      case 'ORDER_CREATED':
        return 'Nuevo Pedido';
      case 'ORDER_STATUS_CHANGED':
        return 'Estado de Pedido Actualizado';
      case 'PAYMENT_RECEIVED':
        return 'Pago Recibido';
      case 'PAYMENT_OVERDUE':
        return 'Pago Vencido';
      case 'INSTALLMENT_DUE':
        return 'Cuota Vencida';
      case 'STOCK_RESERVED':
        return 'Stock Reservado';
      case 'STOCK_SHIPPED':
        return 'Producto Enviado';
      case 'CUSTOMER_REGISTERED':
        return 'Cliente Registrado';
      case 'SELLER_ASSIGNED':
        return 'Vendedor Asignado';
      case 'PAYMENT_REMINDER':
        return 'Recordatorio de Pago';
      case 'STOCK_LOW':
        return 'Stock Bajo';
      default:
        return 'Notificación';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Hace unos minutos';
    }
    if (diffInHours < 24) {
      return `Hace ${Math.floor(diffInHours)} horas`;
    }
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  const handleDelete = async (notificationId) => {
    await deleteNotification(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleRefresh = () => {
    refresh();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh',
          width: '90vw',
          maxWidth: '600px',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotificationsActive color="primary" />
          <Typography variant="h6">
            Notificaciones
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                size="small"
                color="error"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={handleRefresh} size="small" title="Actualizar">
            <Refresh />
          </IconButton>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 4,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {!loading && notifications.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 4,
              px: 2,
            }}
          >
            <NotificationsActive
              sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="body1" color="text.secondary" align="center">
              No tienes notificaciones
            </Typography>
          </Box>
        )}

        {!loading && notifications.length > 0 && (
          <List sx={{ py: 0 }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification._id || notification.id}>
                <ListItem
                  onClick={(e) => {
                    // Evitar que el click en los iconos de acción abra el modal
                    if (
                      e.target.closest('.notification-action-btn')
                    ) {
                      return;
                    }
                    const { relatedEntity } = notification;
                    if (relatedEntity?.entityType === 'SalesOrder') {
                      openModal(relatedEntity.entityId);
                      onClose();
                    }
                  }}
                  sx={{
                    py: 2,
                    px: 2,
                    bgcolor: notification.isRead
                      ? 'transparent'
                      : 'action.hover',
                    borderLeft: notification.isRead
                      ? 'none'
                      : '3px solid',
                    borderLeftColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    '&:hover': {
                      backgroundColor: 'action.selected',
                      cursor: 'pointer',
                    },
                  }}
                >
                  <Box sx={{ mt: 0.5 }}>
                    {getNotificationIcon(notification.type)}
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 0.5,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: notification.isRead ? 400 : 600,
                          flex: 1,
                          minWidth: 0,
                        }}
                        noWrap
                      >
                        {notification.title || getNotificationTitle(notification.type)}
                      </Typography>
                      {!notification.isRead && (
                        <Chip
                          label="Nuevo"
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ flexShrink: 0 }}
                        />
                      )}
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{
                        mb: 1,
                        lineHeight: 1.4,
                        wordBreak: 'break-word',
                      }}
                    >
                      {notification.message}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {formatDate(notification.createdAt)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flexShrink: 0 }}>
                    {!notification.isRead && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification._id || notification.id);
                        }}
                        title="Marcar como leída"
                        sx={{ p: 0.5 }}
                        className="notification-action-btn"
                      >
                        <MarkEmailRead fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification._id || notification.id);
                      }}
                      color="error"
                      title="Eliminar"
                      sx={{ p: 0.5 }}
                      className="notification-action-btn"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        {/* Controles de paginación */}
        {!loading && notifications.length > 0 && pagination.hasNext && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Button
              onClick={loadMore}
              variant="outlined"
              size="small"
              disabled={loadingMore}
              startIcon={loadingMore ? <CircularProgress size={16} /> : null}
            >
              {loadingMore ? 'Cargando...' : `Cargar más (Página ${pagination.current} de ${pagination.total})`}
            </Button>
          </Box>
        )}

        {/* Información de paginación */}
        {!loading && notifications.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 1,
              bgcolor: 'background',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {`Página ${pagination.current} de ${pagination.total} • ${notifications.length} notificaciones`}
            </Typography>
          </Box>
        )}
      </DialogContent>

      {notifications.length > 0 && (
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              startIcon={<MarkEmailRead />}
              variant="outlined"
              size="small"
            >
              Marcar todas como leídas
            </Button>
          )}
          <Button onClick={onClose} variant="contained" size="small">
            Cerrar
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default NotificationCenter;
