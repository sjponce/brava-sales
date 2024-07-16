import { DeleteRounded, EditRounded } from '@mui/icons-material';
import { Avatar, Box, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import DataTable from '@/components/dataTable/DataTable';
import crud from '@/redux/crud/actions';
import AddSalesOrderModal from './AddSalesOrderModal';
import Loading from '@/components/Loading';

const SalesOrderDataTable = () => {
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
    dispatch(crud.delete({ entity: 'user', id: selectedRow.id }));
    setDialogOpen(false);
  };

  const salesOrderState = useSelector((store) => store.crud.listAll);
  const readSalesOrderState = useSelector((store) => store.crud.read);
  const createSalesOrderState = useSelector((store) => store.crud.create);
  const updateSalesOrderState = useSelector((store) => store.crud.update);
  const deleteSalesOrderState = useSelector((store) => store.crud.delete);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!salesOrderState?.result) return;
    const newRows = salesOrderState.result.items.result.map((item) => ({ ...item, id: item._id }));
    setRows(newRows);
  }, [salesOrderState]);

  const handleEdit = async (id) => {
    setSelectedRow({ ...selectedRow, id });
    await dispatch(crud.read({ entity: 'user', id }));
    handleOpen(true);
  };

  const updateTable = () => {
    if (salesOrderState?.isLoading) return;
    dispatch(crud.listAll({ entity: 'user' }));
  };

  useEffect(() => {
    updateTable();
  }, [createSalesOrderState, updateSalesOrderState, deleteSalesOrderState]);

  const columns = [
    {
      field: 'photo',
      headerName: 'Foto',
      sortable: false,
      width: 50,
      renderCell: (params) => (
        <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
          <Avatar src={params.value} sx={{ width: 30, height: 30 }} />
        </Box>
      ),
    },
    {
      field: 'name',
      headerName: 'Nombre',
      width: 150,
      renderCell: (params) => `${params.row.name || ''}`,
    },
    {
      field: 'surname',
      headerName: 'Apellido',
      width: 150,
      renderCell: (params) => `${params.row.surname || ''}`,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
    },
    {
      field: 'role',
      headerName: 'Rol',
      width: 110,
      renderCell: (params) => `${params.row.role === 'admin' ? 'Administrador' : 'Vendedor'}`,
    },
    {
      field: 'phone',
      headerName: 'Teléfono',
      sortable: false,
      width: 100,
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
        const isDisabled = userState.role !== 'admin' || salesOrderState.isLoading;
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
        text="Esta accion no se puede deshacer, ¿Desea continuar?"
        isOpen={dialogOpen}
        onAccept={handleDialogAccept}
        onCancel={handleDialogCancel}
      />
      <AddSalesOrderModal idSalesOrder={`${selectedRow.id}`} open={open} handlerOpen={handleOpen} />
      <Loading isLoading={salesOrderState?.isLoading || readSalesOrderState?.isLoading} />
    </Box>
  );
};

export default SalesOrderDataTable;
