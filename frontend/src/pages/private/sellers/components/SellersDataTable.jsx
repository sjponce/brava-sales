import {
  EditRounded, GppBadRounded, GppGoodRounded, KeyRounded,
} from '@mui/icons-material';
import {
  Avatar, Box, IconButton, Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import DataTable from '@/components/dataTable/DataTable';
import crud from '@/redux/crud/actions';
import AddSellerModal from './AddSellerModal';
import Loading from '@/components/Loading';
import UpdatePasswordModal from './UpdatePasswordModal';

const SellersDataTable = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openPass, setOpenPass] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({
    id: '',
    name: '',
    userId: '',
  });

  const handleOpen = (value) => {
    setOpen(value);
  };

  const handleDisable = (userId, name, enabled) => {
    setSelectedRow({
      ...selectedRow, userId, name, enabled,
    });
    setDialogOpen(true);
  };

  const handleUpdatePassword = (userId) => {
    setSelectedRow({ ...selectedRow, userId });
    setOpenPass(true);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
  };

  const handleDialogAccept = () => {
    dispatch(crud.disable({ entity: 'user', id: selectedRow.userId }));
    setDialogOpen(false);
  };

  const sellerState = useSelector((store) => store.crud.listAll);
  const readSellerState = useSelector((store) => store.crud.read);
  const createUserState = useSelector((state) => state.auth);
  const disableSellersState = useSelector((store) => store.crud.disable);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!sellerState?.result) return;
    const newRows = sellerState.result?.items?.result.map((item) => ({ ...item, id: item._id }));
    setRows(newRows);
  }, [sellerState]);

  const handleEdit = async (id) => {
    setSelectedRow({ ...selectedRow, id });
    await dispatch(crud.read({ entity: 'seller', id }));
    handleOpen(true);
  };

  const updateTable = () => {
    if (sellerState?.isLoading) return;
    dispatch(crud.listAll({ entity: 'seller' }));
  };

  useEffect(() => {
    updateTable();
  }, [createUserState.result, disableSellersState]);

  const columns = [
    {
      field: 'photo',
      headerName: 'Foto',
      sortable: false,
      width: 75,
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
      renderCell: (params) => `${params.row.user?.email || ''}`,
      width: 200,
    },
    {
      field: 'role',
      headerName: 'Rol',
      width: 110,
      renderCell: (params) => `${params.row.user?.role === 'admin' ? 'Administrador' : 'Vendedor'}`,
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
      type: 'boolean',
      sortable: false,
      editable: false,
      valueGetter: (params) => (params.row.user?.enabled),
    },
    {
      field: 'actions',
      headerName: 'Acción',
      width: 120,
      printable: false,
      sortable: false,
      renderCell: (params) => {
        const { name, id, user } = params.row;
        const userState = useSelector((store) => store.auth.current);
        const isDisabled = userState.role !== 'admin' || sellerState?.isLoading;
        return (
          <div className="actions">
            <IconButton disabled={isDisabled} onClick={() => handleEdit(id)} size="small">
              <Tooltip title="Editar">
                <EditRounded />
              </Tooltip>
            </IconButton>
            <IconButton disabled={isDisabled} onClick={() => handleUpdatePassword(user._id)} size="small">
              <Tooltip title="Cambiar contraseña">
                <KeyRounded />
              </Tooltip>
            </IconButton>
            <IconButton disabled={isDisabled} onClick={() => handleDisable(user._id, name, user?.enabled)} size="small">
              <Tooltip title={`${user?.enabled ? 'Deshabilitar' : 'Habilitar'} usuario`}>
                {user?.enabled ? <GppBadRounded /> : <GppGoodRounded />}
              </Tooltip>
            </IconButton>
          </div>
        );
      },
    },
  ];
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <DataTable columns={columns} rows={rows} />
      <CustomDialog
        title={`${selectedRow.enabled ? 'Deshabilitar' : 'Habilitar'}: ${selectedRow.name}`}
        text="Esta acción no se puede deshacer, ¿Desea continuar?"
        isOpen={dialogOpen}
        onAccept={handleDialogAccept}
        onCancel={handleDialogCancel}
      />
      <UpdatePasswordModal idUser={`${selectedRow.userId}`} open={openPass} handlerOpen={setOpenPass} />
      <AddSellerModal idSeller={`${selectedRow.id}`} open={open} handlerOpen={handleOpen} />
      <Loading isLoading={
        sellerState?.isLoading || readSellerState?.isLoading || createUserState?.isLoading
        || disableSellersState?.isLoading
        } />
    </Box>
  );
};

export default SellersDataTable;
