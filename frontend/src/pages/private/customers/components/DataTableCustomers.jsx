import { DeleteRounded, EditRounded, LockOpenRounded } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import DataTable from '@/components/dataTable/DataTable';
import { resetPassword } from '@/redux/auth/actions';
import crud from '@/redux/crud/actions';
import AddCustomerModal from './AddCustomerModal';
import Loading from '@/components/Loading';

const DataTableCustomers = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogResetOpen, setDialogResetOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({
    id: '',
    name: '',
    email: '',
    documentNumber: '',
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

  const handleDialogResetCancel = () => {
    setDialogResetOpen(false);
  };

  const handleDialogResetAccept = () => {
    dispatch(
      resetPassword({
        email: selectedRow.email,
        password: selectedRow.documentNumber,
      })
    );
    setDialogResetOpen(false);
  };

  const customerState = useSelector((store) => store.crud.listAll);
  const readCustomerState = useSelector((store) => store.crud.read);
  const updateCustomerState = useSelector((store) => store.crud.update);
  const deleteCustomerState = useSelector((store) => store.crud.delete);
  const createUserState = useSelector((state) => state.auth);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!customerState?.result) return;
    const newRows = customerState.result?.items?.result.map((item) => ({ ...item, id: item._id }));
    setRows(newRows);
  }, [customerState]);

  const handleEdit = async (id) => {
    setSelectedRow({ ...selectedRow, id });
    await dispatch(crud.read({ entity: 'customer', id }));
    handleOpen(true);
  };

  const handleResetPassword = async (id, name, email, documentNumber) => {
    setSelectedRow({ ...selectedRow, id, name, email, documentNumber });
    setDialogResetOpen(true);
  };

  const updateTable = () => {
    if (customerState?.isLoading) return;
    dispatch(crud.listAll({ entity: 'customer' }));
  };

  useEffect(() => {
    updateTable();
  }, [createUserState.result, updateCustomerState, deleteCustomerState]);

  const columns = [
    {
      field: 'name',
      headerName: 'Nombre/Razón',
      width: 150,
      renderCell: (params) => `${params.row.name || ''}`,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
    },
    {
      field: 'number',
      headerName: 'Teléfono',
      width: 150,
    },
    {
      field: 'documentType',
      headerName: 'Tipo D.',
      width: 65,
    },
    {
      field: 'documentNumber',
      headerName: 'Número D.',
      width: 150,
    },
    {
      field: 'ivaCondition',
      headerName: 'Cond. IVA',
      width: 90,
      renderCell: (params) => {
        const getIvaConditionShort = (ivaCondition) => {
          switch (ivaCondition) {
            case 'Responsable Inscripto':
              return 'RI';
            case 'Monotributista':
              return 'MTR';
            case 'Consumidor final':
              return 'CF';
            default:
              return 'No definido';
          }
        };
        return (
          <Tooltip title={params.row.ivaCondition || 'No definido'}>
            {getIvaConditionShort(params.row.ivaCondition)}
          </Tooltip>
        );
      },
    },
    {
      field: 'state',
      headerName: 'Provincia',
      renderCell: (params) => `${params.row.address?.state || ''}`,
    },
    {
      field: 'city',
      headerName: 'Ciudad',
      renderCell: (params) => `${params.row.address?.city || ''}`,
    },
    {
      field: 'address',
      headerName: 'Dirección',
      width: 180,
      renderCell: (params) => {
        const { address } = params.row;
        return `${address?.street || ''} ${address?.streetNumber || ''}`;
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
      width: 150,
      printable: false,
      sortable: false,
      renderCell: (params) => {
        const { id, name, email, documentNumber } = params.row;
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
            <IconButton
              disabled={isDisabled}
              onClick={() => handleResetPassword(id, name, email, documentNumber)}
              size="small">
              <LockOpenRounded />
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
      <CustomDialog
        title={`Blanquear contraseña de: ${selectedRow.name}`}
        text="Esta acción no se puede deshacer, ¿Desea continuar?"
        isOpen={dialogResetOpen}
        onAccept={handleDialogResetAccept}
        onCancel={handleDialogResetCancel}
      />
      <AddCustomerModal idCustomer={`${selectedRow.id}`} open={open} handlerOpen={handleOpen} />
      <Loading
        isLoading={
          customerState?.isLoading || readCustomerState?.isLoading || createUserState?.isLoading
        }
      />
    </Box>
  );
};

export default DataTableCustomers;
