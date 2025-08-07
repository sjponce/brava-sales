import { DeleteRounded } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import DataTable from '@/components/dataTable/DataTable';
import Loading from '@/components/Loading';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import crud from '@/redux/crud/actions';
import formatDate from '@/utils/formatDate';
import translateStatus from '@/utils/translateSalesStatus';

const TripsDataTable = () => {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({
    id: '',
    description: '',
  });

  const tripState = useSelector((store) => store.crud.listAll);
  const readTripState = useSelector((store) => store.crud.read);
  const updateTripState = useSelector((store) => store.crud.update);
  const createTripState = useSelector((store) => store.crud.create);
  const deleteTripState = useSelector((store) => store.crud.delete);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!tripState?.result) return;
    const newRows = tripState.result?.items?.result.map((item) => ({ ...item, id: item._id }));
    setRows(newRows ?? []);
  }, [tripState]);

  const handleDelete = (id, description) => {
    setSelectedRow({ ...selectedRow, id, description });
    setDialogOpen(true);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
  };

  const handleDialogAccept = () => {
    dispatch(crud.delete({ entity: 'trip', id: selectedRow.id }));
    setDialogOpen(false);
  };

  const updateTable = () => {
    if (tripState?.isLoading) return;
    dispatch(crud.listAll({ entity: 'trip' }));
  };

  useEffect(() => {
    updateTable();
  }, [updateTripState, deleteTripState, createTripState]);

  const columns = [
    {
      field: 'startDate',
      headerName: 'Inicio',
      renderCell: (params) => formatDate(params.row.startDate),
    },
    {
      field: 'endDate',
      headerName: 'Fin',
      renderCell: (params) => formatDate(params.row.endDate),
    },
    {
      field: 'seller',
      headerName: 'Vendedor',
      width: 150,
      renderCell: (params) => `${params.row.seller?.name || ''}`,
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 150,
      renderCell: (params) => translateStatus(params.row.status),
    },
    {
      field: 'destinations',
      headerName: 'Destinos',
      width: 300,
      renderCell: (params) => params.row.destinations?.map((d) => d.city.name).join(', '),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      sortable: false,
      renderCell: (params) => {
        const { id, description } = params.row;
        const userState = useSelector((store) => store.auth.current);
        const isDisabled = userState.role !== 'admin' || tripState.isLoading;
        return (
          <div className="actions">
            <IconButton disabled={isDisabled} onClick={() => handleDelete(id, description)} size="small">
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
        title="Eliminar viaje"
        text="Esta acción no se puede deshacer, ¿Desea continuar?"
        isOpen={dialogOpen}
        onAccept={handleDialogAccept}
        onCancel={handleDialogCancel}
      />
      <Loading
        isLoading={
          tripState?.isLoading || readTripState?.isLoading
        }
      />
    </Box>
  );
};

export default TripsDataTable;
