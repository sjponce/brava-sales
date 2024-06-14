import { DeleteRounded, EditRounded } from '@mui/icons-material';
import { Avatar, Box, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import DataTable from '@/components/dataTable/DataTable';
import crud from '@/redux/crud/actions';

const DataTableSellers = () => {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({
    id: 0,
    email: '',
    name: '',
    surname: '',
    enabled: '',
    role: '',
    phone: '',
    photo: '',
  });

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
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!sellerState?.result) return;
    const newRows = sellerState.result.items.result.map((item) => ({ ...item, id: item._id }));
    setRows(newRows);
  }, [sellerState]);

  useEffect(() => {
    dispatch(crud.listAll({ entity: 'user' }));
  }, []);

  const columns = [
    {
      field: 'photo',
      headerName: 'Foto',
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
            <IconButton disabled={isDisabled} size="small">
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
    </Box>
  );
};

export default DataTableSellers;
