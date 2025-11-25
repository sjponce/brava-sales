import { VisibilityRounded, DeleteRounded } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/dataTable/DataTable';
import Loading from '@/components/Loading';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import { travelsActions } from '@/redux/travels';
import { selectTravelsList, selectTravelsLoading } from '@/redux/travels/selectors';
import formatDate from '@/utils/formatDate';
import translateStatus from '@/utils/translateSalesStatus';

const TravelsDataTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({ id: '', description: '' });

  const rows = useSelector(selectTravelsList).map((item) => ({ ...item, id: item._id }));
  const isLoading = useSelector(selectTravelsLoading);
  const userState = useSelector((store) => store.auth.current);
  const createTravelState = useSelector((store) => store.travels.create);
  const deleteTravelState = useSelector((store) => store.travels.delete);
  const updateTravelState = useSelector((store) => store.travels.update);
  const handleDelete = (id, description) => {
    setSelectedRow({ ...selectedRow, id, description });
    setDialogOpen(true);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
  };

  const handleDialogAccept = () => {
    dispatch(travelsActions.delete({ id: selectedRow.id }));
    setDialogOpen(false);
  };

  const updateTable = () => {
    if (isLoading) return;
    dispatch(travelsActions.listAll());
  };

  useEffect(() => {
    updateTable();
  }, [createTravelState?.result, deleteTravelState?.result, updateTravelState?.result]);

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
      field: 'vehicle',
      headerName: 'Vehículo',
      width: 150,
      renderCell: (params) => params.row.vehicle?.plate || '',
    },
    {
      field: 'driverName',
      headerName: 'Conductor',
      width: 150,
      renderCell: (params) => params.row.driverName || params.row.vehicle?.driver?.name || '',
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 150,
      renderCell: (params) => translateStatus(params.row.status),
    },
    {
      field: 'stops',
      headerName: 'Paradas',
      width: 300,
      renderCell: (params) => (params.row.stops || []).map((s) => s.name).join(', '),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      sortable: false,
      renderCell: (params) => {
        const { id, description } = params.row;
        const isDisabled = userState.role !== 'admin' || isLoading;
        return (
          <div className="actions">
            <Tooltip title="Ver detalles">
              <IconButton onClick={() => navigate(`/trips/${id}`)} size="small">
                <VisibilityRounded />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <span>
                <IconButton disabled={isDisabled} onClick={() => handleDelete(id, description)} size="small">
                  <DeleteRounded />
                </IconButton>
              </span>
            </Tooltip>
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
      <Loading isLoading={isLoading} />
    </Box>
  );
};

export default TravelsDataTable;
