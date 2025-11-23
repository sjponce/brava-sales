import { Download, Visibility } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DataTable from '@/components/dataTable/DataTable';
import sales from '@/redux/sales/actions';
import docs from '@/redux/docs/actions';
import Loading from '@/components/Loading';
import formatDate from '@/utils/formatDate';
import translateStatus from '@/utils/translateSalesStatus';
// import ModalSalesOrderDetails from './ModalSalesOrderDetails';
import stock from '@/redux/stock/actions';
import { selectCurrentItem } from '@/redux/sales/selectors';
import getProductImageMap from '@/utils/getProductImageMap';
import crud from '@/redux/crud/actions';
import { ModalSalesOrderContext } from '@/context/modalSalesOrderContext/ModalSalesOrderContext';

const SalesOrderDataTable = () => {
  const dispatch = useDispatch();
  // const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({
    id: '',
  });

  const { openModal } = useContext(ModalSalesOrderContext);

  const saleData = useSelector(selectCurrentItem)?.result;

  const handleDetails = async (id) => {
    setSelectedRow({ ...selectedRow, id });
    openModal(id);
  };

  useEffect(() => {
    if (saleData && saleData.products) {
      const ids = saleData.products?.map((product) => product.idStock);
      dispatch(stock.getStockProducts({ entity: 'stock', ids }));
    }
  }, [saleData]);

  const handleDownload = (id) => {
    dispatch(docs.generate({ docName: 'salesOrder', body: { id } }));
  };

  const location = useLocation();

  const salesOrderState = useSelector((store) => store.sales.listAll);
  const createSalesOrderState = useSelector((store) => store.sales.create);
  const updateSalesOrderState = useSelector((store) => store.sales.update);
  const deleteSalesOrderState = useSelector((store) => store.sales.delete);
  const reserveStockState = useSelector((store) => store.sales.reserveStock);
  const products = useSelector((store) => store.stock.listAll)?.result?.items?.result;

  useEffect(() => {
    if (!reserveStockState?.isSuccess || selectedRow.id === '') return;
    dispatch(sales.read({ entity: 'sales', id: selectedRow.id }));
    dispatch(crud.filter({ entity: 'stockReservation', options: { filter: 'salesOrder', equal: selectedRow.id } }));
  }, [reserveStockState]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!salesOrderState?.result) return;
    const newRows = salesOrderState.result?.items.result
      .map((item) => ({ ...item, id: item._id }))
    // Ordenar por fecha descendente (más reciente primero)
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    setRows(newRows);
  }, [salesOrderState]);

  const updateTable = () => {
    if (salesOrderState?.isLoading) return;
    dispatch(sales.listAll({ entity: 'sales' }));
  };

  useEffect(() => {
    updateTable();
  }, [createSalesOrderState, updateSalesOrderState, deleteSalesOrderState, reserveStockState]);

  const columns = [
    {
      field: 'salesOrderCode',
      headerName: 'Código',
      sortable: true,
      width: 150,
      renderCell: (params) => `${params.row.salesOrderCode || ''}`,
    },
    {
      field: 'customer',
      headerName: 'Cliente',
      width: 150,
      valueGetter: (params) => params.row.customer?.name || '',
      renderCell: (params) => `${params.row.customer?.name || ''}`,
    },
    {
      field: 'orderDate',
      headerName: 'Fecha del pedido',
      width: 150,
      renderCell: (params) => `${formatDate(params.row.orderDate)}`,
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 200,
      renderCell: (params) => `${translateStatus(params.row.status) || ''}`,
    },
    {
      field: 'actions',
      headerName: 'Acción',
      width: 100,
      printable: false,
      sortable: false,
      renderCell: (params) => {
        const { id } = params.row;
        return (
          <div className="actions">
            <Tooltip title="Ver detalles" arrow>
              <IconButton size="small" onClick={() => handleDetails(id)}>
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title="Descargar" arrow>
              <IconButton size="small" onClick={() => handleDownload(id)}>
                <Download />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(location.search);
      const installment = searchParams?.get('installment');
      const salesOrder = searchParams?.get('salesOrder');
      if (installment && salesOrder) {
        setSelectedRow({ id: salesOrder });
        await dispatch(sales.read({ entity: 'sales', id: salesOrder }));
        // setOpenDetailsModal(true);
      }
    };

    fetchData();
  }, [location]);

  useEffect(() => {
    if (!products) return;
    const productImgMap = getProductImageMap(products);
    dispatch(stock.setProductImageMap(productImgMap));
  }, [products]);

  return (
    <Box display="flex" height="100%">
      <DataTable columns={columns} rows={salesOrderState?.isLoading ? [] : rows} />
      <Loading
        isLoading={
          salesOrderState?.isLoading
        }
      />
    </Box>
  );
};

export default SalesOrderDataTable;
