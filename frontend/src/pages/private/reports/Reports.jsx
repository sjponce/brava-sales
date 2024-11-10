import { Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import crud from '@/redux/crud/actions';
import stock from '@/redux/stock/actions';
import sales from '@/redux/sales/actions';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const Reports = () => {
  const dispatch = useDispatch();
  const customerState = useSelector((state) => state.crud.listAll);
  const productState = useSelector((state) => state.stock.listAll);
  const salesOrderState = useSelector((state) => state.sales.listAll);

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [dateFrom, setDateFrom] = useState(dayjs().subtract(30, 'days').format('YYYY-MM-DD'));
  const [dateTo, setDateTo] = useState(dayjs().format('YYYY-MM-DD'));
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productChartData, setProductChartData] = useState({ labels: [], datasets: [] });
  const [clientChartData, setClientChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    dispatch(crud.listAll({ entity: 'customer' }));
    dispatch(stock.listAll({ entity: 'stock' }));
    dispatch(sales.listAll({ entity: 'sales' }));
  }, [dispatch]);

  useEffect(() => {
    if (customerState?.result) {
      const customerList = customerState.result.items.result.map((item) => ({
        id: item._id,
        name: item.name,
      }));
      setCustomers(customerList);
    }
  }, [customerState]);

  useEffect(() => {
    if (productState?.result) {
      const productList = productState.result.items.result.map((item) => ({
        id: item._id,
        name: item.stockId,
      }));
      setProducts(productList);
    }
  }, [productState]);

  const calculateProductTotals = () => {
    if (!salesOrderState?.result?.result) return {};

    const productTotals = {};

    // Iterar a través de cada orden
    salesOrderState.result.items.result.forEach((order) => {
      // Iterar en cada producto de la orden
      order.products.forEach((product) => {
        const productId = product.product;

        // Verificar y almacenar los detalles del producto en caso de que no existan en productTotals
        if (!productTotals[productId]) {
          productTotals[productId] = {
            name: product.product,
            totalAmount: 0,
            totalQuantity: 0,
            totalOrders: 0,
          };
        }

        // inicializar variables de cantidad e importe para este producto en la orden
        let orderProductQuantity = 0;
        let orderProductAmount = 0;

        // Calcular la cantidad y el importe por cada tamaño
        product.sizes.forEach((size) => {
          orderProductQuantity += size.quantity;
          orderProductAmount += size.quantity * product.price;
        });

        // Agregar a los totales del producto
        productTotals[productId].totalQuantity += orderProductQuantity;
        productTotals[productId].totalAmount += orderProductAmount;
        productTotals[productId].totalOrders += 1;
      });
    });

    return productTotals;
  };

  const calculateClientTotals = () => {
    if (!salesOrderState?.result) return {};
    const clientTotals = {};
    
    salesOrderState.result.items.result
      .filter(order => {
        const orderDate = dayjs(order.orderDate);
        return orderDate.isAfter(dayjs(dateFrom)) && orderDate.isBefore(dayjs(dateTo));
      })
      .forEach((order) => {
        const clientId = order.customer._id;
        const clientName = order.customer.name;
  
        if (!clientTotals[clientId]) {
          clientTotals[clientId] = {
            name: clientName,
            orderCount: 0,
            totalAmount: 0,
            orders: []
          };
        }
  
        clientTotals[clientId].orderCount++;
        clientTotals[clientId].totalAmount += order.totalAmount;
        clientTotals[clientId].orders.push({
          code: order.salesOrderCode,
          date: order.orderDate,
          amount: order.totalAmount
        });
      });
  
    return clientTotals;
  };
  

  const updateProductChartData = () => {
    console.log("Calculando totales de productos...");
    const productTotals = calculateProductTotals();

    // Filtrar los productos según el producto seleccionado
    const filteredProducts = selectedProduct
      ? products.filter((product) => product.id === selectedProduct)
      : products;

    console.log("Productos filtrados:", filteredProducts);

    const labels = filteredProducts.map((product) => {
      const productData = productTotals[product.id];
      return `${product.name} (${productData?.totalQuantity || 0} unidades)`;
    });

    const data = filteredProducts.map((product) => productTotals[product.id]?.totalAmount || 0);

    setProductChartData({
      labels: labels,
      datasets: [{
        label: 'Monto total vendido',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }]
    });
  };

  const updateClientChartData = () => {
    const clientTotals = calculateClientTotals();
    const filteredClients = selectedClient
      ? customers.filter((client) => client.id === selectedClient)
      : customers;

    const labels = filteredClients.map((client) => {
      const clientData = clientTotals[client.id];
      return `${client.name} (${clientData?.orderCount || 0} órdenes)`;
    });

    const data = filteredClients.map((client) => clientTotals[client.id]?.totalAmount || 0);

    setClientChartData({
      labels: labels,
      datasets: [
        {
          label: 'Monto total en ventas',
          data: data,
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        }
      ],
    });
  };

  useEffect(() => {
    updateProductChartData();
    updateClientChartData();
  }, [salesOrderState, selectedProduct, selectedClient, products, customers, dateFrom, dateTo]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Typography variant="h4" gutterBottom>Reporte de ventas</Typography>

      <Box display="flex" gap={2} mb={4}>
        <TextField
          label="Fecha desde"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Fecha hasta"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Cliente</InputLabel>
          <Select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            label="Cliente"
            disabled={customerState?.isLoading}
          >
            <MenuItem value="">Todos</MenuItem>
            {customers.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Producto</InputLabel>
          <Select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            label="Producto"
            disabled={productState?.isLoading}
          >
            <MenuItem value="">Todos</MenuItem>
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box height="400px" width="100%">
        <Typography variant="h5">Reporte de ventas por producto</Typography>
        <Bar
          data={productChartData}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 10000,
                  callback: (value) => `${value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}`,
                },
              },
            },
          }}
        />
      </Box>

      <Box height="400px" width="100%" mt={4}>
        <Typography variant="h5">Reporte de ventas por cliente</Typography>
        <Bar
          data={clientChartData}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 10000,
                  callback: (value) => `${value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}`,
                },
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Reports;
