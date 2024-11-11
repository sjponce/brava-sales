import { Box, IconButton, Popover, Tooltip, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Check, Cancel, EditRounded, Start, Visibility } from '@mui/icons-material';
import DataTable from '@/components/dataTable/DataTable';
import Loading from '@/components/Loading';
import sales from '@/redux/sales/actions';
import translateStatus from '@/utils/translateSalesStatus';
import formatDate from '@/utils/formatDate';
import EditShippingModal from './EditShippingModal';
import translateShippingMethod from '@/utils/translateShippingMethod';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import crud from '@/redux/crud/actions';

const ShippingDataTable = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [startDialogOpen, setStartDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);

  const [selectedRow, setSelectedRow] = useState({});
  const shippingState = useSelector((store) => store.sales.listAllStockReservations);
  const editShippingState = useSelector((store) => store.crud.update);
  const approveShippingState = useSelector((store) => store.sales.updateStockReservationStatus);
  const [rows, setRows] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentProducts, setCurrentProducts] = useState([]);

  const handleClick = (event, products) => {
    setAnchorEl(event.currentTarget);
    setCurrentProducts(products);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentProducts([]);
  };

  useEffect(() => {
    if (!shippingState?.result) return;
    const newRows = shippingState.result?.items?.result?.map((item) => ({ ...item, id: item._id }));
    setRows(newRows);
  }, [shippingState, editShippingState, approveShippingState]);

  const updateTable = () => {
    if (shippingState?.isLoading) return;
    dispatch(sales.listAllStockReservations({ entity: 'sales' }));
  };

  const handleOpen = (value) => {
    setOpen(value);
  };

  const handleEdit = async (row) => {
    setSelectedRow({ ...row });
    handleOpen(true);
  };

  const handleStart = (row) => {
    setSelectedRow({ ...row });
    setStartDialogOpen(true);
  };

  const handleCancel = (row) => {
    setSelectedRow({ ...row });
    setCancelDialogOpen(true);
  };

  const handleApprove = (row) => {
    setSelectedRow({ ...row });
    setApproveDialogOpen(true);
  };

  const startShipping = async (row) => {
    await dispatch(
      crud.update({ entity: 'stockReservation', id: row._id, jsonData: { status: 'Shipped' } })
    );
  };

  const approveShipping = async (row) => {
    await dispatch(
      sales.updateStockReservationStatus({ jsonData: { id: row._id, status: 'Delivered' } })
    );
  };

  const cancelShipping = async (row) => {
    await dispatch(
      sales.updateStockReservationStatus({ jsonData: { id: row._id, status: 'Cancelled' } })
    );
  };

  useEffect(() => {
    updateTable();
  }, [editShippingState]);

  const columns = [
    {
      field: 'salesOrder',
      headerName: 'N° Venta',
      sortable: true,
      valueGetter: (params) => params.row.salesOrder?.salesOrderCode,
    },
    {
      field: 'status',
      headerName: 'Estado',
      sortable: true,
      valueGetter: (params) => translateStatus(params.row.status),
    },
    {
      field: 'products',
      headerName: 'Productos',
      sortable: true,
      width: 100,
      renderCell: (params) => {
        const { products } = params.row;
        return (
          <Box display="flex" alignItems="center" width="100%" justifyContent="center">
            <IconButton onClick={(event) => handleClick(event, products)}>
              <Visibility />
            </IconButton>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}>
              <Box p={2}>
                {currentProducts.map((product) => (
                  <Box key={product.idStock} mb={1}>
                    <Typography variant="subtitle2">
                      {product.stockId} - {product.color}
                    </Typography>
                    <Typography variant="body2">
                      Talles:{' '}
                      {product.sizes.map((size) => `${size.size} (${size.quantity})`).join(', ')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Popover>
          </Box>
        );
      },
    },
    {
      field: 'totalShoes',
      headerName: 'Cant. total',
      sortable: true,
      width: 100,
      valueGetter: (params) =>
        params.row.products.reduce(
          (total, product) => total + product.sizes.reduce((sum, size) => sum + size.quantity, 0),
          0
        ),
    },
    {
      field: 'clientName',
      headerName: 'Cliente',
      sortable: true,
      width: 150,
      valueGetter: (params) => params.row.salesOrder?.customer?.name,
    },
    {
      field: 'clientAddress',
      headerName: 'Dirección',
      width: 200,
      valueGetter: (params) => {
        const address = params.row.salesOrder?.customer?.address;
        return address
          ? `${address.street} ${address.streetNumber}, ${address.city}, ${address.state}`
          : 'N/A';
      },
    },
    {
      field: 'departureDate',
      headerName: 'Salida',
      sortable: true,
      width: 100,
      renderCell: (params) => {
        const { departureDate } = params.row;
        return <span>{departureDate ? formatDate(departureDate) : '-'}</span>;
      },
    },
    {
      field: 'arrivalDate',
      headerName: 'Llegada',
      sortable: true,
      width: 100,
      renderCell: (params) => {
        const { arrivalDate } = params.row;
        return <span>{arrivalDate ? formatDate(arrivalDate) : '-'}</span>;
      },
    },
    {
      field: 'shippingMethod',
      headerName: 'Método de envío',
      sortable: true,
      width: 150,
      valueGetter: (params) => translateShippingMethod(params.row.shippingMethod),
    },
    {
      field: 'shippingCode',
      headerName: 'Código de envío',
      sortable: true,
      width: 150,
      renderCell: (params) => {
        const shippingCode = params.row.shippingCode || 'N/A';
        return <span>{translateShippingMethod(shippingCode)}</span>;
      },
    },
    {
      field: 'actions',
      headerName: 'Acción',
      width: 150,
      printable: false,
      sortable: false,
      renderCell: (params) => {
        const { status, departureDate, arrivalDate, shippingMethod } = params.row;
        const canStart = departureDate && arrivalDate && shippingMethod;
        return (
          <div className="actions">
            {status === 'Reserved' && (
              <>
                <Tooltip title="Editar envío">
                  <IconButton onClick={() => handleEdit(params.row)} size="small">
                    <EditRounded />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Iniciar envío">
                  <IconButton
                    disabled={!canStart}
                    onClick={() => handleStart(params.row)}
                    size="small">
                    <Start />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {status === 'Shipped' && (
              <>
                <IconButton onClick={() => handleApprove(params.row)} size="small">
                  <Check />
                </IconButton>
                <IconButton onClick={() => handleCancel(params.row)} size="small">
                  <Cancel />
                </IconButton>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Box display="flex" height="100%">
      <DataTable columns={columns} rows={rows} data-test-id="shipping-data-table" />
      <Loading isLoading={shippingState?.isLoading} />
      <EditShippingModal shipping={selectedRow} open={open} handlerOpen={setOpen} />
      <CustomDialog
        title="Iniciar envío"
        text="¿Está seguro de que desea iniciar este envío?"
        isOpen={startDialogOpen}
        onAccept={() => {
          startShipping(selectedRow);
          setStartDialogOpen(false);
        }}
        onCancel={() => setStartDialogOpen(false)}
      />

      <CustomDialog
        title="Cancelar envío"
        text="Esta acción no se puede deshacer. ¿Está seguro de que desea cancelar este envío?"
        isOpen={cancelDialogOpen}
        onAccept={() => {
          cancelShipping(selectedRow);
          setCancelDialogOpen(false);
        }}
        onCancel={() => setCancelDialogOpen(false)}
      />

      <CustomDialog
        title="Aprobar envío"
        text="¿Está seguro de que desea aprobar este envío?"
        isOpen={approveDialogOpen}
        onAccept={() => {
          approveShipping(selectedRow);
          setApproveDialogOpen(false);
        }}
        onCancel={() => setApproveDialogOpen(false)}
      />
    </Box>
  );
};

export default ShippingDataTable;
