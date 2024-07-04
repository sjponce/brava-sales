import { DeleteRounded, EditRounded } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import DataTable from '@/components/dataTable/DataTable';
import crud from '@/redux/crud/actions';
import Loading from '@/components/Loading';

const DataTableClients = () => {
  const dispatch = useDispatch();
  const [setOpen] = useState(false);
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

  const clientState = useSelector((store) => store.crud.listAll);
  const readClientState = useSelector((store) => store.crud.read);
  const createClientState = useSelector((store) => store.crud.create);
  const updateClientState = useSelector((store) => store.crud.update);
  const deleteClientState = useSelector((store) => store.crud.delete);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!clientState?.result) return;
    const newRows = clientState.result.items.result
      .filter((item) => item.role === 'Client')
      .map((item) => ({ ...item, id: item._id }));
    setRows(newRows);
  }, [clientState]);

  const handleEdit = async (id) => {
    setSelectedRow({ ...selectedRow, id });
    await dispatch(crud.read({ entity: 'user', id }));
    handleOpen(true);
  };

  const updateTable = () => {
    if (clientState?.isLoading) return;
    dispatch(crud.listAll({ entity: 'user' }));
  };

  useEffect(() => {
    updateTable();
  }, [createClientState, updateClientState, deleteClientState]);

  const columns = [
    {
      field: 'name',
      headerName: 'Nombre completo',
      width: 200,
      renderCell: (params) => `${params.row.name || ''}`,
    },
    {
      field: 'razonSocial',
      headerName: 'Razón Social',
      width: 150,
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
      field: 'tipoDocumento',
      headerName: 'Tipo de documento',
      width: 150,
    },
    {
      field: 'numeroDocumento',
      headerName: 'Número Documento',
      width: 150,
    },
    {
      field: 'condicionIVA',
      headerName: 'Condición IVA',
      width: 150,
    },
    {
      field: 'direccion',
      headerName: 'Dirección',
      width: 300,
      renderCell: (params) => {
        const address = params.value;
        if (Array.isArray(address)) {
          // Suponiendo que quieres mostrar los primeros 3 elementos del array
          return `${address[0]} ${address[1]}, ${address[5]}`;
        }
        return '';
      },
    },
    {
      field: 'actions',
      headerName: 'Acción',
      width: 100,
      printable: false,
      sortable: false,
      renderCell: (params) => {
        const { id, fullName } = params.row;
        const userState = useSelector((store) => store.auth.current);
        const isDisabled = userState.role !== 'admin' || clientState.isLoading;
        return (
          <div className="actions">
            <IconButton disabled={isDisabled} onClick={() => handleEdit(id)} size="small">
              <EditRounded />
            </IconButton>
            <IconButton disabled={isDisabled} onClick={() => handleDisable(id, fullName)} size="small">
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
      <Loading isLoading={clientState?.isLoading || readClientState?.isLoading} />
    </Box>
  );
};

export default DataTableClients;
