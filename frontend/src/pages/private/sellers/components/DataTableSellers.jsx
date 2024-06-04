/* eslint-disable no-underscore-dangle */
import { DeleteRounded, EditRounded } from '@mui/icons-material';
import { Avatar, Box, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import DataTable from '@/components/dataTable/DataTable';
import { request } from '@/request';

const DataTableSellers = () => {
  const [rows, setRows] = useState([]);
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

  const updateTable = async () => {
    const response = await request.listAll({ entity: 'user' });
    if (response) {
      const updatedRows = response.result.map((row) => ({
        ...row,
        id: row._id,
      }));
      setRows(updatedRows);
    }
  };

  useEffect(() => {
    updateTable();
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
        const { id, name, role } = params.row;
        const isDisabled = role === 'ADMIN';
        return (
          <div className="actions">
            <IconButton size="small">
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

  const handleDialogCancel = () => {
    setDialogOpen(false);
  };

  const handleDialogAccept = async () => {
    setDialogOpen(false);
  };

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
