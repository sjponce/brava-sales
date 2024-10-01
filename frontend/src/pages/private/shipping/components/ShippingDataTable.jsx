import { Box, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Check, Cancel, EditRounded, Start } from '@mui/icons-material';
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

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!shippingState?.result) return;
    const newRows = shippingState.result?.items?.result?.map((item) => ({ ...item, id: item._id }));
    setRows(newRows);
  }, [shippingState, editShippingState]);

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
      crud.update({ entity: 'stockReservation', id: row._id, jsonData: { status: 'Delivered' } })
    );
  };

  const cancelShipping = async (row) => {
    await dispatch(
      crud.update({ entity: 'stockReservation', id: row._id, jsonData: { status: 'Cancelled' } })
    );
  };

  useEffect(() => {
    updateTable();
  }, [editShippingState]);

  const columns = [
    {
      field: 'salesOrder',
      headerName: 'Orden de venta',
      sortable: true,
      renderCell: (params) => {
        const {
          salesOrder: { salesOrderCode },
        } = params.row;
        return <span>{salesOrderCode}</span>;
      },
    },
    {
      field: 'status',
      headerName: 'Estado',
      sortable: true,
      renderCell: (params) => {
        const { status } = params.row;
        return (
          <Box display="flex" alignItems="center">
            <span>{translateStatus(status)}</span>
          </Box>
        );
      },
    },
    {
      field: 'product',
      headerName: 'Producto',
      sortable: true,
      width: 150,
      renderCell: (params) => {
        const shoeCode = params.row.product?.stockId || 'N/A';
        return <span>{shoeCode}</span>;
      },
    },
    {
      field: 'sizeTypes',
      headerName: 'Talles',
      sortable: false,
      width: 200,
      renderCell: (params) => {
        const sizeTypes = params.row.sizes.map((size) => size.size).join(', ');
        return <span>{sizeTypes}</span>;
      },
    },
    {
      field: 'totalShoes',
      headerName: 'Total de zapatos',
      sortable: true,
      width: 150,
      renderCell: (params) => {
        const totalShoes = params.row.sizes.reduce((acc, size) => acc + size.quantity, 0);
        return <span>{totalShoes}</span>;
      },
    },
    {
      field: 'clientName',
      headerName: 'Cliente',
      sortable: true,
      width: 200,
      renderCell: (params) => {
        const clientName = params.row.salesOrder?.customer?.name || 'N/A';
        return <span>{clientName}</span>;
      },
    },
    {
      field: 'clientAddress',
      headerName: 'Dirección',
      sortable: false,
      width: 250,
      renderCell: (params) => {
        const address = params.row.salesOrder?.customer?.address;
        const fullAddress = address
          ? `${address.street} ${address.streetNumber}, ${address.city}, ${address.state}`
          : 'N/A';
        return <span>{fullAddress}</span>;
      },
    },
    {
      field: 'departureDate',
      headerName: 'Fecha de salida',
      sortable: true,
      width: 150,
      renderCell: (params) => {
        const { departureDate } = params.row;
        return <span>{departureDate ? formatDate(departureDate) : '-'}</span>;
      },
    },
    {
      field: 'arrivalDate',
      headerName: 'Fecha de llegada',
      sortable: true,
      width: 150,
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
      renderCell: (params) => {
        const shippingMethod = params.row.shippingMethod || 'N/A';
        return <span>{translateShippingMethod(shippingMethod)}</span>;
      },
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
                <IconButton onClick={() => handleEdit(params.row)} size="small">
                  <EditRounded />
                </IconButton>
                <IconButton
                  disabled={!canStart}
                  onClick={() => handleStart(params.row)}
                  size="small">
                  <Start />
                </IconButton>
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
