/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, Checkbox, Autocomplete } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useSelector, useDispatch } from 'react-redux';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import sales from '@/redux/sales/actions';
import crud from '@/redux/crud/actions';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ClientsReport = () => {
  const customers = useSelector((store) => store.crud.listAll?.result?.items?.result);
  const salesOrders = useSelector((store) => store.sales.listAll?.result?.items?.result);
  const [clientChartData, setClientChartData] = useState({});
  const [showRevenue, setShowRevenue] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedClients, setSelectedClients] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(crud.listAll({ entity: 'customer' }));
    dispatch(sales.listAll({ entity: 'sales' }));
  }, [dispatch]);

  useEffect(() => {
    if (customers) {
      setSelectedClients(customers.map((customer) => customer._id));
    }
  }, [customers]);

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

      // Ordenar los datos de mayor a menor
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
            backgroundColor: showRevenue ? 'rgba(75, 192, 192, 0.6)' : 'rgba(153, 102, 255, 0.6)',
            borderColor: showRevenue ? 'rgba(75, 192, 192, 1)' : 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
        ],
      });
    }
  }, [salesOrders, customers, showRevenue, startDate, endDate]);

  const handleClientSelection = (event, newValue) => {
    setSelectedClients(newValue.map((client) => client._id));
  };

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
    <Box width="100%">
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        borderRadius={2}
        marginBottom="20px">
        <Typography variant="h4" color="primary">Reporte de ventas por cliente</Typography>
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
        {filteredChartData.labels ? (
          <Bar
            data={filteredChartData}
            options={{
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
          />
        ) : (
          <Typography variant="body1">Cargando datos...</Typography>
        )}
        <Autocomplete
          multiple
          size="small"
          id="checkboxes-tags-demo"
          options={customers || []}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          value={customers?.filter((client) => selectedClients.includes(client._id)) || []}
          onChange={handleClientSelection}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox style={{ marginRight: 8 }} checked={selected} />
              {option.name}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Seleccionar clientes" fullWidth size="small" margin="normal" />
          )}
        />
      </Box>
    </Box>
  );
};

export default ClientsReport;
