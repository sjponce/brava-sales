/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, Checkbox, Autocomplete } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import stock from '@/redux/stock/actions';
import sales from '@/redux/sales/actions';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProductsReport = () => {
  const products = useSelector((store) => store.stock.listAll?.result?.items?.result);
  const salesOrders = useSelector((store) => store.sales.listAll?.result?.items?.result);
  const [productChartData, setProductChartData] = useState({});
  const [showRevenue, setShowRevenue] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(stock.listAll({ entity: 'stock' }));
    dispatch(sales.listAll({ entity: 'sales' }));
  }, [dispatch]);

  useEffect(() => {
    if (products) {
      setSelectedProducts(products.map((product) => product._id));
    }
  }, [products]);

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

      // Ordenar los datos de mayor a menor
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
            backgroundColor: showRevenue ? 'rgba(75, 192, 192, 0.6)' : 'rgba(153, 102, 255, 0.6)',
            borderColor: showRevenue ? 'rgba(75, 192, 192, 1)' : 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
        ],
      });
    }
  }, [salesOrders, products, showRevenue, startDate, endDate]);

  const handleProductSelection = (event, newValue) => {
    setSelectedProducts(newValue.map((product) => product._id));
  };

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
    <Box width="100%">
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        borderRadius={2}
        marginBottom="20px">
        <Typography variant="h4" color="primary">Reporte de ventas por productos</Typography>
        <Button
          onClick={() => setShowRevenue(!showRevenue)}
          variant="text"
          size="large"
          color="primary">
          <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            Monto / Cantidad
          </Typography>
        </Button>
      </Box>
      <Box bgcolor="info.main" p={2} borderRadius={2.5}>
        <Box display="flex" mb={2} justifyContent="space-between">
          <Box display="flex" gap={2}>
            <DatePicker
              label="Fecha de inicio"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
            <DatePicker
              label="Fecha de fin"
              value={endDate}
              minDate={startDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
          </Box>
        </Box>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {filteredChartData.labels ? (
            <Bar
              data={filteredChartData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => (showRevenue
                        ? `${value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}`
                        : value),
                    },
                  },
                },
              }}
              height="100%"
            />
          ) : (
            <Typography variant="body1">Cargando datos...</Typography>
          )}
        </Box>
        <Autocomplete
          multiple
          size="small"
          id="checkboxes-tags-demo"
          options={products || []}
          disableCloseOnSelect
          getOptionLabel={(option) => option.stockId}
          value={products?.filter((product) => selectedProducts.includes(product._id)) || []}
          onChange={handleProductSelection}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox style={{ marginRight: 8 }} checked={selected} />
              {option.stockId}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Seleccionar productos" fullWidth size="small" margin="normal" />
          )}
        />
      </Box>
    </Box>
  );
};

export default ProductsReport;
