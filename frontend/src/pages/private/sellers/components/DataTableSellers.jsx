import { DeleteRounded, EditRounded } from '@mui/icons-material';
import { Avatar, Box, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import DataTable from '@/components/dataTable/DataTable';
import crud from '@/redux/crud/actions';
import AddSellerModal from './AddSellerModal';
import Loading from '@/components/Loading';

const DataTableSellers = () => {
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
    setDialogOpen(false);
  };

  const sellerState = useSelector((store) => store.crud.listAll);
  const readSellerState = useSelector((store) => store.crud.read);
  const createSellerState = useSelector((store) => store.crud.create);
  const updateSellerState = useSelector((store) => store.crud.update);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!sellerState?.result) return;
    const newRows = sellerState.result.items.result.map((item) => ({ ...item, id: item._id }));
    setRows(newRows);
  }, [sellerState]);

  const handleEdit = async (id) => {
    setSelectedRow({ ...selectedRow, id });
    await dispatch(crud.read({ entity: 'user', id }));
    handleOpen(true);
  };

  const updateTable = () => {
    if (sellerState?.isLoading) return;
    dispatch(crud.listAll({ entity: 'user' }));
  };

  useEffect(() => {
    updateTable();
  }, [createSellerState, updateSellerState]);

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
      renderCell: (params) => `${params.row.name || ''} ${params.row.surname || ''}`,
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
      renderCell: (params) => `${params.row.role === 'ADMIN' ? 'Administrador' : 'Vendedor'}`,
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
        const isDisabled = userState.role !== 'ADMIN';
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
      <AddSellerModal idSeller={`${selectedRow.id}`} open={open} handlerOpen={handleOpen} />
      <Loading isLoading={sellerState?.isLoading || readSellerState?.isLoading} />
    </Box>
  );
};

export default DataTableSellers;
