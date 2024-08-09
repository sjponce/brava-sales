import { Download, Visibility } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import DataTable from '@/components/dataTable/DataTable';
import sales from '@/redux/sales/actions';
import docs from '@/redux/docs/actions';
import Loading from '@/components/Loading';
import formatDate from '@/utils/formatDate';
import translateStatus from '@/utils/translateSalesStatus';
import ModalSalesOrderDetails from './ModalSalesOrderDetails';

const SalesOrderDataTable = () => {
  const dispatch = useDispatch();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({
    id: '',
    name: '',
  });

  const handleDetails = async (id) => {
    setSelectedRow({ ...selectedRow, id });
    await dispatch(sales.read({ entity: 'sales', id }));
    setOpenDetailsModal(true);
  };

  const handleDialogCancel = () => {
    setOpenCreateDialog(false);
  };

  const handleDialogAccept = () => {
    dispatch(sales.delete({ entity: 'sales', id: selectedRow.id }));
    setOpenCreateDialog(false);
  };

  const handleDownload = (id) => {
    dispatch(docs.generate({ docName: 'salesOrder', body: { id } }));
  };

  const salesOrderState = useSelector((store) => store.sales.listAll);
  const readSalesOrderState = useSelector((store) => store.sales.read);
  const createSalesOrderState = useSelector((store) => store.sales.create);
  const updateSalesOrderState = useSelector((store) => store.sales.update);
  const deleteSalesOrderState = useSelector((store) => store.sales.delete);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!salesOrderState?.result) return;
    const newRows = salesOrderState.result.items.result.map((item) => ({ ...item, id: item._id }));
    setRows(newRows);
  }, [salesOrderState]);

  const updateTable = () => {
    if (salesOrderState?.isLoading) return;
    dispatch(sales.listAll({ entity: 'sales' }));
  };

  useEffect(() => {
    updateTable();
  }, [createSalesOrderState, updateSalesOrderState, deleteSalesOrderState]);

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
            <IconButton size="small" onClick={() => handleDetails(id)}>
              <Visibility />
            </IconButton>
            <IconButton size="small" onClick={() => handleDownload(id)}>
              <Download />
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <Box display="flex" height="100%">
      <DataTable columns={columns} rows={rows} />
      <CustomDialog
        title={`Deshabilitar: ${selectedRow.name}`}
        text="Esta acción no se puede deshacer, ¿Desea continuar?"
        isOpen={openCreateDialog}
        onAccept={handleDialogAccept}
        onCancel={handleDialogCancel}
      />
      <ModalSalesOrderDetails
        productId={selectedRow.id}
        handlerOpen={setOpenDetailsModal}
        open={openDetailsModal}
      />
      <Loading isLoading={salesOrderState?.isLoading || readSalesOrderState?.isLoading} />
    </Box>
  );
};

export default SalesOrderDataTable;
