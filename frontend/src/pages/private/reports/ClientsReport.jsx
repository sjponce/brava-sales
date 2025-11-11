/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  Autocomplete,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  IconButton,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  TrendingUp,
  People,
  AttachMoney,
  Assessment,
  ShoppingCart,
  VisibilityOff,
  Visibility
} from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useSelector, useDispatch } from 'react-redux';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import sales from '@/redux/sales/actions';
import crud from '@/redux/crud/actions';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MetricCard = ({ icon, title, value, subtitle, color = 'primary', theme }) => (
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

const ClientsReport = () => {
  const customers = useSelector((store) => store.crud.listAll?.result?.items?.result);
  const salesOrders = useSelector((store) => store.sales.listAll?.result?.items?.result);
  const [clientChartData, setClientChartData] = useState({});
  const [showRevenue, setShowRevenue] = useState(true);
  const [startDate, setStartDate] = useState(() => dayjs().startOf('day').subtract(3, 'month'));
  const [endDate, setEndDate] = useState(() => dayjs().startOf('day'));
  const [selectedClients, setSelectedClients] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    dispatch(crud.listAll({ entity: 'customer' }));
    dispatch(sales.listAll({ entity: 'sales' }));
  }, [dispatch]);

  useEffect(() => {
    if (customers) {
      setSelectedClients(customers.map((customer) => customer._id));
    }
  }, [customers]);

  // Cálculo de métricas resumen
  const metrics = useMemo(() => {
    if (!salesOrders || !customers) return null;

    const filteredSalesOrders = salesOrders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
    });

    let totalRevenue = 0;
    let totalOrders = 0;
    let activeCustomers = 0;
    const customerStats = {};

    filteredSalesOrders.forEach((order) => {
      const customerId = order.customer._id;
      const customerName = order.customer.name;
      const orderTotal = order.totalAmount;

      totalRevenue += orderTotal;
      totalOrders += 1;

      if (!customerStats[customerId]) {
        customerStats[customerId] = {
          name: customerName,
          totalAmount: 0,
          orderCount: 0,
        };
        activeCustomers += 1;
      }
      customerStats[customerId].totalAmount += orderTotal;
      customerStats[customerId].orderCount += 1;
    });

    const bestCustomer = Object.entries(customerStats)
      .sort(([, a], [, b]) => b.totalAmount - a.totalAmount)[0];

    const mostFrequentCustomer = Object.entries(customerStats)
      .sort(([, a], [, b]) => b.orderCount - a.orderCount)[0];

    const bestCustomerName = bestCustomer
      ? customers.find((c) => c._id === bestCustomer[0])?.name || 'N/A'
      : 'N/A';

    const mostFrequentCustomerName = mostFrequentCustomer
      ? customers.find((c) => c._id === mostFrequentCustomer[0])?.name || 'N/A'
      : 'N/A';

    return {
      totalRevenue,
      totalOrders,
      activeCustomers,
      bestCustomer: bestCustomerName,
      mostFrequentCustomer: mostFrequentCustomerName,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
    };
  }, [salesOrders, customers, startDate, endDate]);

  useEffect(() => {
    if (salesOrders && customers) {
      const filteredSalesOrders = salesOrders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
      });

      const clientTotals = {};

      filteredSalesOrders.forEach((order) => {
        const clientId = order.customer._id;
        const clientName = order.customer.name;
        const orderTotal = order.totalAmount;

        if (clientTotals[clientId]) {
          clientTotals[clientId].totalAmount += orderTotal;
          clientTotals[clientId].orderCount += 1;
        } else {
          clientTotals[clientId] = {
            name: clientName,
            totalAmount: orderTotal,
            orderCount: 1,
          };
        }
      });

      const labels = customers.map((customer) => customer.name);
      const revenueData = customers.map((customer) => clientTotals[customer._id]?.totalAmount || 0);
      const orderCountData = customers
        .map((customer) => clientTotals[customer._id]?.orderCount || 0);

      const sortedData = labels
        .map((label, index) => ({
          label,
          revenue: revenueData[index],
          orderCount: orderCountData[index],
        }))
        .sort((a, b) => (showRevenue ? b.revenue - a.revenue : b.orderCount - a.orderCount));

      setClientChartData({
        labels: sortedData.map((data) => data.label),
        datasets: [
          {
            label: showRevenue ? 'Monto Total (ARS)' : 'Cantidad de Pedidos',
            data: showRevenue ? sortedData.map((data) => data.revenue) : sortedData
              .map((data) => data.orderCount),
            backgroundColor: showRevenue
              ? alpha(theme.palette.primary.main, 0.8)
              : alpha(theme.palette.secondary.main, 0.8),
            borderColor: showRevenue
              ? theme.palette.primary.main
              : theme.palette.secondary.main,
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      });
    }
  }, [salesOrders, customers, showRevenue, startDate, endDate, theme]);

  const filteredChartData = {
    ...clientChartData,
    labels: clientChartData.labels?.filter((_, index) => selectedClients
      .includes(customers[index]._id)),
    datasets: clientChartData.datasets?.map((dataset) => ({
      ...dataset,
      data: dataset.data?.filter((_, index) => selectedClients.includes(customers[index]._id)),
    })),
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box mb={4}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary.main"
          gutterBottom
          sx={{ mb: 1 }}
        >
          Reporte de Ventas por Clientes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Análisis detallado del comportamiento de clientes y métricas de ventas
        </Typography>
      </Box>

      {/* Métricas Resumen */}
      {metrics && (
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<AttachMoney />}
              title="Ingresos Totales"
              value={metrics.totalRevenue.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 0
              })}
              subtitle="En el período seleccionado"
              color="primary"
              theme={theme}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<ShoppingCart />}
              title="Pedidos Totales"
              value={metrics.totalOrders.toLocaleString()}
              subtitle="Órdenes completadas"
              color="secondary"
              theme={theme}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<People />}
              title="Clientes Activos"
              value={metrics.activeCustomers.toLocaleString()}
              subtitle="Con al menos un pedido"
              color="success"
              theme={theme}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<TrendingUp />}
              title="Ticket Promedio"
              value={metrics.averageOrderValue.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 0
              })}
              subtitle="Valor promedio por pedido"
              color="warning"
              theme={theme}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <MetricCard
              icon={<Assessment />}
              title="Mejor Cliente (Facturación)"
              value={metrics.bestCustomer}
              subtitle="Cliente con mayor monto total"
              color="error"
              theme={theme}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <MetricCard
              icon={<People />}
              title="Cliente Más Frecuente"
              value={metrics.mostFrequentCustomer}
              subtitle="Cliente con más pedidos"
              color="success"
              theme={theme}
            />
          </Grid>
        </Grid>
      )}

      {/* Controles y Filtros */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Filtros de Fecha y Toggle */}
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'flex-start' }}
          gap={3}
          mb={3}
        >
          <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }} flex={1}>
            <DatePicker
              label="Fecha de inicio"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  sx: { minWidth: 200 }
                }
              }}
            />
            <DatePicker
              label="Fecha de fin"
              value={endDate}
              minDate={startDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  sx: { minWidth: 200 }
                }
              }}
            />
          </Box>

          <Box display="flex" gap={2} alignItems="center">
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
              }}
            >
              {showFilters ? <VisibilityOff /> : <Visibility />}
            </IconButton>

            <Button
              onClick={() => setShowRevenue(!showRevenue)}
              variant="contained"
              size="medium"
              startIcon={showRevenue ? <AttachMoney /> : <ShoppingCart />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'medium',
                minWidth: 160,
              }}
            >
              {showRevenue ? 'Mostrar Pedidos' : 'Mostrar Ingresos'}
            </Button>
          </Box>
        </Box>

        {/* Selector de Clientes */}
        {showFilters && (
          <Box mb={3}>
            <Autocomplete
              multiple
              size="small"
              options={customers || []}
              disableCloseOnSelect
              getOptionLabel={(option) => option.name}
              value={customers?.filter((client) => selectedClients.includes(client._id)) || []}
              onChange={(event, newValue) => setSelectedClients(
                newValue.map((client) => client._id)
              )}
              ListboxProps={{
                style: {
                  maxHeight: 200,
                  overflow: 'auto',
                },
              }}
              renderTags={(value, getTagProps) => {
                const visibleTags = value.slice(0, 3).map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.name}
                    size="small"
                    {...getTagProps({ index })}
                    key={option._id}
                  />
                ));
                if (value.length > 3) {
                  visibleTags.push(
                    <Chip
                      key="more"
                      variant="outlined"
                      label={`+${value.length - 3} más`}
                      size="small"
                    />
                  );
                }
                return visibleTags;
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    style={{ marginRight: 8 }}
                    checked={selected}
                    size="small"
                  />
                  {option.name}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filtrar clientes"
                  placeholder="Selecciona los clientes a mostrar"
                  fullWidth
                  size="small"
                />
              )}
            />
          </Box>
        )}

        <Divider sx={{ mb: 3 }} />

        {/* Gráfico */}
        <Box
          sx={{
            height: 500,
            position: 'relative',
            '& canvas': {
              borderRadius: 2,
            }
          }}
        >
          {filteredChartData.labels?.length > 0 ? (
            <Bar
              data={filteredChartData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                interaction: {
                  intersect: false,
                  mode: 'index',
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    backgroundColor: alpha(theme.palette.background.paper, 0.95),
                    titleColor: theme.palette.text.primary,
                    bodyColor: theme.palette.text.primary,
                    borderColor: alpha(theme.palette.divider, 0.2),
                    borderWidth: 1,
                    cornerRadius: 12,
                    displayColors: false,
                    callbacks: {
                      title: (context) => `Cliente: ${context[0].label}`,
                      label: (context) => {
                        const value = context.parsed.y;
                        return showRevenue
                          ? `Facturación: ${value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}`
                          : `Pedidos: ${value.toLocaleString()} órdenes`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      color: theme.palette.text.secondary,
                      font: {
                        size: 11,
                        weight: 'medium',
                      },
                      maxRotation: 45,
                    },
                  },
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: alpha(theme.palette.divider, 0.1),
                      drawBorder: false,
                    },
                    ticks: {
                      color: theme.palette.text.secondary,
                      font: {
                        size: 11,
                        weight: 'medium',
                      },
                      callback: (value) => (showRevenue
                        ? `${(value / 1000).toLocaleString()}K`
                        : value.toLocaleString()),
                    },
                  },
                },
              }}
            />
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="100%"
              color="text.secondary"
            >
              <People sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
              <Typography variant="h6" gutterBottom>
                No hay datos disponibles
              </Typography>
              <Typography variant="body2" align="center">
                {(() => {
                  if (!customers) return 'Cargando clientes...';
                  if (!salesOrders) return 'Cargando ventas...';
                  return 'No se encontraron ventas para el período seleccionado';
                })()}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ClientsReport;
