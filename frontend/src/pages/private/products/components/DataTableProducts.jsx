import { DeleteRounded, EditRounded, Visibility } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import DataTable from '@/components/dataTable/DataTable';
import ModalProductDetails from './ModalProductDetails';
import stock from '@/redux/stock/actions';
import Loading from '@/components/Loading';

const DataTableProducts = () => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({
    id: '',
    name: '',
  });

  const handleDetails = async (id) => {
    setSelectedRow({ ...selectedRow, id });
    await dispatch(stock.read({ entity: 'stock', id }));
    setIsUpdate(false);
    setOpenModal(true);
  };

  const handleEdit = async (id) => {
    setSelectedRow({ ...selectedRow, id });
    await dispatch(stock.read({ entity: 'stock', id }));
    setIsUpdate(true);
    setOpenModal(true);
  };

  const handleDisable = (id, name) => {
    setSelectedRow({ ...selectedRow, id, name });
    setDialogOpen(true);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
  };

  const handleDialogAccept = async () => {
    await dispatch(stock.delete({ entity: 'stock', id: selectedRow.id }));
    setDialogOpen(false);
  };

  const productState = useSelector((store) => store.stock.listAll);
  const readProductState = useSelector((store) => store.stock.read);
  const deleteProductState = useSelector((store) => store.stock.delete);
  const updateProductState = useSelector((store) => store.stock.update);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (productState?.result) {
      setRows(productState.result.items.result);
    }
  }, [productState]);

  const updateTable = async () => {
    if (productState?.isLoading) return;
    dispatch(stock.listAll({ entity: 'stock' }));
  };

  useEffect(() => {
    updateTable();
  }, [deleteProductState, updateProductState]);

  const columns = [
    {
      field: 'imageUrl',
      headerName: 'Foto',
      width: 100,
      renderCell: (params) => {
        const { id } = params.row;
        return (
          <Box display="flex" width="100%" onClick={() => handleDetails(id)} alignItems="center">
            <img
              src={params.value ? params?.value : '/noImage.png'}
              alt=""
              style={{
                width: '100%',
                borderRadius: '5px',
                cursor: 'pointer',
                objectFit: 'cover',
              }}
            />
          </Box>
        );
      },
      align: 'center',
      sortable: false,
    },
    {
      field: 'name',
      headerName: 'Nombre',
      width: 150,
    },
    {
      field: 'color',
      headerName: 'Color',
      width: 100,
    },
    {
      field: 'description',
      headerName: 'Descripción',
      width: 250,
    },
    {
      field: 'price',
      headerName: 'Precio',
      valueGetter: (params) => `${params.row.price ? '$' : '-'} ${params.row.price || ''}`,
    },
    {
      field: 'actions',
      headerName: 'Acción',
      width: 120,
      printable: false,
      sortable: false,
      renderCell: (params) => {
        const { id, name } = params.row;
        const userState = useSelector((store) => store.auth.current);
        const isDisabled = userState.role !== 'admin';
        return (
          <div className="actions">
            <IconButton size="small" onClick={() => handleDetails(id)}>
              <Visibility />
            </IconButton>
            <IconButton disabled={isDisabled} size="small" onClick={() => handleEdit(id)}>
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
      <DataTable columns={columns} rows={rows} rowHeight={75} />
      <CustomDialog
        title={`Deshabilitar: ${selectedRow.name}`}
        text="Esta accion no se puede deshacer, ¿Desea continuar?"
        isOpen={dialogOpen}
        onAccept={handleDialogAccept}
        onCancel={handleDialogCancel}
      />
      <ModalProductDetails
        productId={selectedRow.id}
        handlerOpen={setOpenModal}
        open={openModal}
        isUpdate={isUpdate}
      />
      <Loading
        isLoading={
        productState?.isLoading
        || readProductState?.isLoading
        || deleteProductState?.isLoading
        || false
      }
      />
    </Box>
  );
};

export default DataTableProducts;
