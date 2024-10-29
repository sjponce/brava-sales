import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Reports = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Fetch sales data from your API or use mock data
    const mockData = [
      { id: 1, date: '2023-04-01', product: 'Widget A', quantity: 10, revenue: 1000 },
      { id: 2, date: '2023-04-02', product: 'Widget B', quantity: 5, revenue: 750 },
      { id: 3, date: '2023-04-03', product: 'Widget C', quantity: 8, revenue: 1200 },
    ];
    setSalesData(mockData);
  }, []);

  const chartData = {
    labels: salesData.map((item) => item.date),
    datasets: [
      {
        label: 'Revenue',
        data: salesData.map((item) => item.revenue),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Quantity',
        data: salesData.map((item) => item.quantity),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Report',
      },
    },
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Typography variant="h4" gutterBottom>Reporte de ventas</Typography>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Product</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Revenue ($)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.product}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">{row.revenue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box>
        <Bar data={chartData} options={chartOptions} />
      </Box>
    </Box>
  );
};

export default Reports;
