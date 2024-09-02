import { DeleteRounded, EditRounded } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import DataTable from '@/components/dataTable/DataTable';
import crud from '@/redux/crud/actions';
import AddCustomerModal from './AddCustomerModal';
import Loading from '@/components/Loading';

const DataTableCustomers = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({
    id: '',
    name: '',
  });

  const handleOpen = (value) => {
    setOpen(value);
  };

  const handleDisable = (id, name) => {
    setSelectedRow({ ...selectedRow, id, name });
    setDialogOpen(true);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
  };

  const handleDialogAccept = () => {
    dispatch(crud.delete({ entity: 'customer', id: selectedRow.id }));
    setDialogOpen(false);
  };

  const customerState = useSelector((store) => store.crud.listAll);
  const readCustomerState = useSelector((store) => store.crud.read);
  const createCustomerState = useSelector((store) => store.crud.create);
  const updateCustomerState = useSelector((store) => store.crud.update);
  const deleteCustomerState = useSelector((store) => store.crud.delete);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!customerState?.result) return;
    const newRows = customerState.result?.items?.result
      .map((item) => ({ ...item, id: item._id }));
    setRows(newRows);
  }, [customerState]);

  const handleEdit = async (id) => {
    setSelectedRow({ ...selectedRow, id });
    await dispatch(crud.read({ entity: 'customer', id }));
    handleOpen(true);
  };

  const updateTable = () => {
    if (customerState?.isLoading) return;
    dispatch(crud.listAll({ entity: 'customer' }));
  };

  useEffect(() => {
    updateTable();
  }, [createCustomerState, updateCustomerState, deleteCustomerState]);

  const columns = [
    {
      field: 'name',
      headerName: 'Nombre/Razón Social',
      width: 200,
      renderCell: (params) => `${params.row.name || ''}`,
    },
    {
      field: 'email',
      headerName: 'Correo electrónico',
      width: 200,
    },
    {
      field: 'number',
      headerName: 'Número de teléfono',
      width: 150,
    },
    {
      field: 'documentType',
      headerName: 'Tipo de documento',
      width: 150,
    },
    {
      field: 'documentNumber',
      headerName: 'Número Documento',
      width: 150,
    },
    {
      field: 'ivaCondition',
      headerName: 'Condición IVA',
      width: 150,
    },
    {
      field: 'address',
      headerName: 'Dirección',
      width: 300,
      renderCell: (params) => {
        const { address } = params.row;
        return `${address?.street || ''} ${address?.streetNumber || ''}, ${address?.city || ''}, ${address?.state || ''}`;
      },
    },
    {
      field: 'enabled',
      headerName: 'Activo',
      width: 100,
      sortable: false,
      type: 'boolean',
      editable: false,
      getValueGetter: (params) => !params.row.enabled,
    },
    {
      field: 'actions',
      headerName: 'Acción',
      width: 100,
      printable: false,
      sortable: false,
      renderCell: (params) => {
        const { id, name } = params.row;
        const userState = useSelector((store) => store.auth.current);
        const isDisabled = userState.role !== 'admin' || customerState.isLoading;
        return (
          <div className="actions">
            <IconButton disabled={isDisabled} onClick={() => handleEdit(id)} size="small">
              <EditRounded />
            </IconButton>
            <IconButton disabled={isDisabled} onClick={() => handleDisable(id, name)} size="small">
              <DeleteRounded />
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
        isOpen={dialogOpen}
        onAccept={handleDialogAccept}
        onCancel={handleDialogCancel}
      />
      <AddCustomerModal idSeller={`${selectedRow.id}`} open={open} handlerOpen={handleOpen} />
      <Loading isLoading={customerState?.isLoading || readCustomerState?.isLoading} />
    </Box>
  );
};

export default DataTableCustomers;
