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
  Inventory,
  AttachMoney,
  Assessment,
  VisibilityOff,
  Visibility
} from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import stock from '@/redux/stock/actions';
import sales from '@/redux/sales/actions';
import Loading from '@/components/Loading';

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

const ProductsReport = () => {
  const products = useSelector((store) => store.stock.listAll?.result?.items?.result);
  const salesOrders = useSelector((store) => store.sales.listAll?.result?.items?.result);
  const [productChartData, setProductChartData] = useState({});
  const [showRevenue, setShowRevenue] = useState(true);
  const [startDate, setStartDate] = useState(() => dayjs().startOf('day').subtract(3, 'month'));
  const [endDate, setEndDate] = useState(() => dayjs().startOf('day'));
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    dispatch(stock.listAll({ entity: 'stock' }));
    dispatch(sales.listAll({ entity: 'sales' }));
  }, [dispatch]);

  useEffect(() => {
    if (products) {
      setSelectedProducts(products.map((product) => product._id));
    }
  }, [products]);

  // Cálculo de métricas resumen
  const metrics = useMemo(() => {
    if (!salesOrders || !products) return null;

    const filteredSalesOrders = salesOrders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
    });

    let totalRevenue = 0;
    let totalQuantity = 0;
    let totalProducts = 0;
    const productSales = {};

    filteredSalesOrders.forEach((order) => {
      order.products.forEach((product) => {
        const productId = product.product;
        const productRevenue = product.price
          * product.sizes.reduce((sum, size) => sum + size.quantity, 0);
        const productQuantity = product.sizes.reduce((sum, size) => sum + size.quantity, 0);

        totalRevenue += productRevenue;
        totalQuantity += productQuantity;

        if (!productSales[productId]) {
          productSales[productId] = { revenue: 0, quantity: 0 };
          totalProducts += 1;
        }
        productSales[productId].revenue += productRevenue;
        productSales[productId].quantity += productQuantity;
      });
    });

    const bestSellingProduct = Object.entries(productSales)
      .sort(([, a], [, b]) => b.quantity - a.quantity)[0];

    const topRevenueProduct = Object.entries(productSales)
      .sort(([, a], [, b]) => b.revenue - a.revenue)[0];

    const bestSellingProductName = bestSellingProduct
      ? products.find((p) => p._id === bestSellingProduct[0])?.stockId || 'N/A'
      : 'N/A';

    const topRevenueProductName = topRevenueProduct
      ? products.find((p) => p._id === topRevenueProduct[0])?.stockId || 'N/A'
      : 'N/A';

    return {
      totalRevenue,
      totalQuantity,
      totalProducts,
      bestSellingProduct: bestSellingProductName,
      topRevenueProduct: topRevenueProductName,
      averageRevenuePerProduct: totalProducts > 0 ? totalRevenue / totalProducts : 0
    };
  }, [salesOrders, products, startDate, endDate]);

  useEffect(() => {
    if (salesOrders && products) {
      const filteredSalesOrders = salesOrders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
      });

      const productTotals = {};
      const productQuantities = {};

      filteredSalesOrders.forEach((order) => {
        order.products.forEach((product) => {
          const productId = product.product;
          const productRevenue = product.price
            * product.sizes.reduce((sum, size) => sum + size.quantity, 0);
          const productQuantity = product.sizes.reduce((sum, size) => sum + size.quantity, 0);

          if (productTotals[productId]) {
            productTotals[productId] += productRevenue;
            productQuantities[productId] += productQuantity;
          } else {
            productTotals[productId] = productRevenue;
            productQuantities[productId] = productQuantity;
          }
        });
      });

      const labels = products.map((product) => product.stockId);
      const revenueData = products.map((product) => productTotals[product._id] || 0);
      const quantityData = products.map((product) => productQuantities[product._id] || 0);

      const sortedData = labels
        .map((label, index) => ({
          label,
          revenue: revenueData[index],
          quantity: quantityData[index],
        }))
        .sort((a, b) => (showRevenue ? b.revenue - a.revenue : b.quantity - a.quantity));

      setProductChartData({
        labels: sortedData.map((data) => data.label),
        datasets: [
          {
            label: showRevenue ? 'Monto Recaudado (ARS)' : 'Cantidad Vendida',
            data: showRevenue
              ? sortedData.map((data) => data.revenue)
              : sortedData.map((data) => data.quantity),
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
  }, [salesOrders, products, showRevenue, startDate, endDate, theme]);

  const filteredChartData = {
    ...productChartData,
    labels: productChartData.labels?.filter((_, index) => selectedProducts
      .includes(products[index]._id)),
    datasets: productChartData.datasets?.map((dataset) => ({
      ...dataset,
      data: dataset.data?.filter((_, index) => selectedProducts.includes(products[index]._id)),
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
          Reporte de Ventas por Productos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Análisis detallado del rendimiento de productos y métricas de ventas
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
              icon={<Inventory />}
              title="Unidades Vendidas"
              value={metrics.totalQuantity.toLocaleString()}
              subtitle="Total de productos vendidos"
              color="secondary"
              theme={theme}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<TrendingUp />}
              title="Producto Más Vendido"
              value={metrics.bestSellingProduct}
              subtitle="Por cantidad de unidades"
              color="success"
              theme={theme}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<Assessment />}
              title="Mayor Facturación"
              value={metrics.topRevenueProduct}
              subtitle="Por ingresos generados"
              color="warning"
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
              startIcon={showRevenue ? <AttachMoney /> : <Inventory />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'medium',
                minWidth: 160,
              }}
            >
              {showRevenue ? 'Mostrar Cantidad' : 'Mostrar Ingresos'}
            </Button>
          </Box>
        </Box>

        {/* Selector de Productos */}
        {showFilters && (
          <Box mb={3}>
            <Autocomplete
              multiple
              size="small"
              options={products || []}
              disableCloseOnSelect
              getOptionLabel={(option) => option.stockId}
              value={products?.filter((product) => selectedProducts.includes(product._id)) || []}
              onChange={(event, newValue) => setSelectedProducts(
                newValue.map((product) => product._id)
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
                    label={option.stockId}
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
                  {option.stockId}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filtrar productos"
                  placeholder="Selecciona los productos a mostrar"
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
                      title: (context) => `Producto: ${context[0].label}`,
                      label: (context) => {
                        const value = context.parsed.y;
                        return showRevenue
                          ? `Ingresos: ${value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}`
                          : `Cantidad: ${value.toLocaleString()} unidades`;
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
              <Assessment sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
              <Typography variant="h6" gutterBottom>
                No hay datos disponibles
              </Typography>
              <Typography variant="body2" align="center">
                {(() => {
                  if (!products) return 'Cargando productos...';
                  if (!salesOrders) return 'Cargando ventas...';
                  return 'No se encontraron ventas para el período seleccionado';
                })()}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
      <Loading isLoading={!products || !salesOrders} />
    </Box>
  );
};

export default ProductsReport;
