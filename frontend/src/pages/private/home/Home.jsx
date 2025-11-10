import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  TrendingUp,
  Money,
  Assessment,
  Inventory,
  People,
  Warning,
  AccountBalance,
  Notifications,
} from '@mui/icons-material';
import sales from '@/redux/sales/actions';
import crud from '@/redux/crud/actions';
import stock from '@/redux/stock/actions';
import './home.scss';
import Loading from '@/components/Loading';

// Componente para las tarjetas de métricas
const MetricCard = ({ title, value, subtitle, icon, color = 'primary', trend, theme }) => {
  const getTrendColor = (trendValue) => {
    if (trendValue === 'Nuevo') return 'secondary';
    if (trendValue.startsWith('+')) return 'success';
    return 'error';
  };

  return (
    <Card
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette[color].main, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
        borderRadius: 2,
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 20px ${alpha(theme.palette[color].main, 0.15)}`,
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`,
              color: 'white',
            }}
          >
            {React.cloneElement(icon, { fontSize: 'small' })}
          </Box>
          {trend && (
            <Chip
              label={trend}
              size="small"
              color={getTrendColor(trend)}
            />
          )}
        </Box>
        <Typography variant="h5" fontWeight="bold" color={`${color}.main`} mb={0.5}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight="medium">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export const Home = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  // Estados del Redux
  const salesOrders = useSelector((state) => state.sales.listAll?.result?.items?.result || []);
  const customers = useSelector((state) => state.crud.listAll?.result?.items?.result || []);
  const products = useSelector((state) => state.stock.listAll?.result?.items?.result || []);
  const isLoadingSales = useSelector((state) => state.sales.listAll?.isLoading);
  const isLoadingCustomers = useSelector((state) => state.crud.listAll?.isLoading);
  const isLoadingProducts = useSelector((state) => state.stock.listAll?.isLoading);

  // Estados locales para métricas calculadas
  const [metrics, setMetrics] = useState({
    monthSales: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalExpenses: 0,
    profit: 0,
    lowStockProducts: 0,
    pendingPayments: 0,
    stockAlerts: [],
    salesGrowth: 0,
    profitGrowth: 0,
    lastMonthProfit: 0,
    lastMonthSales: 0
  });

  const calculateMetrics = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Mes anterior para comparación
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Ventas del mes actual
    const monthSales = salesOrders
      .filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      })
      .reduce((total, order) => total + (order.finalAmount || order.totalAmount || 0), 0);

    // Ventas del mes anterior
    const lastMonthSales = salesOrders
      .filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
      })
      .reduce((total, order) => total + (order.finalAmount || order.totalAmount || 0), 0);

    // Gastos del mes actual (descuentos aplicados)
    const totalExpenses = salesOrders
      .filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      })
      .reduce((total, order) => {
        const discount = order.discount || 0;
        const discountAmount = (order.totalAmount || 0) * (discount / 100);
        return total + discountAmount;
      }, 0);

    // Gastos del mes anterior
    const lastMonthExpenses = salesOrders
      .filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
      })
      .reduce((total, order) => {
        const discount = order.discount || 0;
        const discountAmount = (order.totalAmount || 0) * (discount / 100);
        return total + discountAmount;
      }, 0);

    // Pagos pendientes - suma de órdenes no pagadas completamente (FALTA CONTEMPLAR CUOTAS)
    const pendingPayments = salesOrders
      .filter((order) => order.paymentStatus !== 'Paid')
      .reduce((total, order) => total + (order.finalAmount || order.totalAmount || 0), 0);

    // Procesar productos con la estructura real del backend
    const allVariations = [];
    let totalProductCount = 0;
    if (Array.isArray(products)) {
      products.forEach((product) => {
        if (product.variations && Array.isArray(product.variations)) {
          product.variations.forEach((variation) => {
            allVariations.push({
              ...variation,
              productId: product._id,
              stockId: product.stockId,
              promotionalName: product.promotionalName,
              price: product.price,
              displayName: `${product.stockId} - ${variation.color}`,
            });
          });
          totalProductCount += product.variations.length;
        }
      });
    }

    const lowStockProducts = allVariations
      .filter((variation) => (variation.stock || 0) < 60 && (variation.stock || 0) > 0).length;

    const stockAlerts = allVariations
      .filter((variation) => (variation.stock || 0) < 60)
      .sort((a, b) => (a.stock || 0) - (b.stock || 0))
      .slice(0, 8);

    const profit = monthSales - totalExpenses;
    const lastMonthProfit = lastMonthSales - lastMonthExpenses;

    // Calcular porcentaje de crecimiento en ventas
    let salesGrowth = '0.0';
    if (lastMonthSales > 0) {
      salesGrowth = (((monthSales - lastMonthSales) / lastMonthSales) * 100).toFixed(1);
    } else if (monthSales > 0) {
      salesGrowth = '100.0';
    }

    // Calcular porcentaje de crecimiento en profit
    let profitGrowth = '0.0';
    if (lastMonthProfit !== 0) {
      profitGrowth = (((profit - lastMonthProfit) / Math.abs(lastMonthProfit)) * 100).toFixed(1);
    } else if (profit > 0) {
      profitGrowth = '100.0';
    }

    setMetrics({
      monthSales,
      totalProducts: totalProductCount,
      totalCustomers: customers.length,
      totalExpenses,
      profit,
      lowStockProducts,
      pendingPayments,
      stockAlerts,
      salesGrowth: parseFloat(salesGrowth),
      profitGrowth: parseFloat(profitGrowth),
      lastMonthProfit,
      lastMonthSales
    });
  };

  // Cargar datos iniciales
  useEffect(() => {
    dispatch(sales.listAll({ entity: 'sales' }));
    dispatch(crud.listAll({ entity: 'customer' }));
    dispatch(stock.listAll({ entity: 'stock' }));
  }, [dispatch]);

  // Calcular métricas cuando cambien los datos
  useEffect(() => {
    calculateMetrics();
  }, [salesOrders, customers, products]);
  const formatCurrency = (amount) => new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);

  // Función para calcular el trend de ventas
  const getSalesTrend = () => {
    if (metrics.lastMonthSales === 0 && metrics.monthSales > 0) {
      return 'Nuevo';
    }
    if (metrics.salesGrowth === 0) {
      return null;
    }
    return metrics.salesGrowth > 0 ? `+${metrics.salesGrowth}%` : `${metrics.salesGrowth}%`;
  };

  // Función para calcular el trend de profit
  const getProfitTrend = () => {
    if (metrics.lastMonthProfit === 0 && metrics.profit > 0) {
      return 'Nuevo';
    }
    if (metrics.profitGrowth === 0) {
      return null;
    }
    return metrics.profitGrowth > 0 ? `+${metrics.profitGrowth}%` : `${metrics.profitGrowth}%`;
  };

  // Obtener ventas recientes (últimas 5)
  const recentSales = salesOrders
    .slice()
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 5);

  // Funciones auxiliares para las alertas de stock
  const getStockLabel = (stockValue) => {
    if (stockValue === 0) return 'Sin Stock';
    if (stockValue <= 10) return 'Crítico';
    return 'Stock Bajo';
  };

  const getStockColor = (stockValue) => {
    if (stockValue === 0) return 'error';
    if (stockValue <= 10) return 'error';
    return 'warning';
  };

  const isLoading = isLoadingSales || isLoadingCustomers || isLoadingProducts;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Métricas principales */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Ventas del Mes"
            value={formatCurrency(metrics.monthSales)}
            subtitle="Ventas realizadas este mes"
            icon={<TrendingUp />}
            color="success"
            trend={getSalesTrend()}
            theme={theme}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Productos"
            value={metrics.totalProducts}
            subtitle="Productos en catálogo"
            icon={<Inventory />}
            color="secondary"
            theme={theme}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Clientes"
            value={metrics.totalCustomers}
            subtitle="Clientes registrados"
            icon={<People />}
            color="primary"
            theme={theme}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Stock Bajo"
            value={metrics.lowStockProducts}
            subtitle="Productos con stock bajo"
            icon={<Warning />}
            color="warning"
            theme={theme}
          />
        </Grid>
      </Grid>

      {/* Segunda fila de métricas */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Costo de oportunidad"
            value={formatCurrency(metrics.totalExpenses)}
            subtitle="Descuentos aplicados"
            icon={<Money />}
            color="error"
            theme={theme}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Estado de Resultados"
            value={formatCurrency(metrics.profit)}
            subtitle="Ganancia neta del mes"
            icon={<Assessment />}
            color={metrics.profit >= 0 ? 'success' : 'error'}
            trend={getProfitTrend()}
            theme={theme}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Saldo Total"
            value={formatCurrency(metrics.pendingPayments)}
            subtitle="Pagos pendientes"
            icon={<AccountBalance />}
            color="warning"
            theme={theme}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Alertas"
            value={metrics.stockAlerts.length}
            subtitle="Productos críticos"
            icon={<Notifications />}
            color="error"
            theme={theme}
          />
        </Grid>
      </Grid>

      {/* Contenido inferior */}
      <Grid container spacing={3}>
        {/* Alertas de stock */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%', bgcolor: 'info.main' }}>
            <Typography variant="h6" gutterBottom color="warning.main" fontWeight="bold">
              Alertas de Stock
            </Typography>
            {metrics.stockAlerts.length > 0 ? (
              <List dense>
                {metrics.stockAlerts.map((variation, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={variation.displayName}
                      secondary={`Stock: ${variation.stock || 0} unidades | Precio: ${formatCurrency(variation.price || 0)}`}
                    />
                    <Chip
                      label={getStockLabel(variation.stock || 0)}
                      color={getStockColor(variation.stock || 0)}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay alertas de stock críticas
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Ventas recientes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%', bgcolor: 'info.main' }}>
            <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
              Ventas Recientes
            </Typography>
            {recentSales.length > 0 ? (
              <List dense>
                {recentSales.map((sale, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>                    <ListItemText
                    primary={`${sale.salesOrderCode || sale._id}`}
                    secondary={(
                      <Box>
                        <Typography variant="body2">
                          {sale.customer?.name || 'Cliente N/A'}
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          {formatCurrency(sale.finalAmount || sale.totalAmount || 0)}
                        </Typography>
                      </Box>
                    )}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {new Date(sale.orderDate).toLocaleDateString('es-AR')}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No hay ventas recientes
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>      {isLoading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Loading isLoading={isLoading} />
        </Box>
      )}
    </Box>
  );
};

export default Home;
