import styled from '@emotion/styled';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Typography,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { Close, PrintOutlined } from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { selectCurrentItem } from '@/redux/stock/selectors';
import ProductDetailsForm from '@/forms/ProductDetailsForm';
import EditProductForm from '@/forms/EditProductForm';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import crud from '@/redux/crud/actions';
import stock from '@/redux/stock/actions';

const SytledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ModalProductDetails = ({
  open, handlerOpen, isUpdate, stockId,
}) => {
  const productData = useSelector(selectCurrentItem);

  const {
    register, handleSubmit, setValue, watch,
  } = useForm();

  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

  const updateProduct = async (data) => {
    const dataProduct = {
      description: data.description,
      tags: data.tags,
      price: parseFloat(data.price),
    };

    try {
      await dispatch(
        stock.update({
          id: productData.result._id,
          jsonData: {
            ...dataProduct,
          },
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (productData?.result) {
      dispatch(crud.listAll({ entity: 'tag' }));
      const product = {
        ...productData?.result,
        stockInfo: productData?.result?.stockInfo?.find(((item) => item.id === stockId))
      };

      setValue('promotionalName', product?.promotionalName);
      setValue('color', product?.stockInfo?.color);
      setValue('description', product?.description);
      setValue('price', product?.price);
      setValue('imageUrl', product?.stockInfo?.imageUrl);
      setValue('stock', product?.stockInfo?.stock);
      setValue('productVariation', product?.stockInfo?.productVariation);
      setValue('tags', product?.tags?.filter((tag) => tag.category !== 'color'));
    }
  }, [productData]);

  const handleModalClose = () => {
    handlerOpen(false);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
  };

  const preSubmit = (e) => {
    e.preventDefault();
    setDialogOpen(true);
  };

  const onSubmit = async (data) => {
    await updateProduct(data);
    setDialogOpen(false);
    handlerOpen(false);
  };

  const renderContent = () => {
    if (!isUpdate) {
      return <ProductDetailsForm watch={watch} />;
    }
    return <EditProductForm watch={watch} register={register} setValue={setValue} />;
  };

  return (
    <SytledModal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box
        width={{ xs: '100%', sm: 800 }}
        height="auto"
        bgcolor="background.default"
        color="text.primary"
        p={3}
        borderRadius={2.5}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        sx={{ '@media print': { color: 'black' } }}>
        <Box alignItems="center" display="flex" marginBottom={2} justifyContent="space-between">
          <Typography variant="h4" color="primary">
            {!isUpdate ? 'Resumen de producto' : 'Editar producto'}
          </Typography>
          <Box display="flex" alignItems="center">
            {!isUpdate && (
              <IconButton onClick={() => window.print()}>
                <PrintOutlined />
              </IconButton>
            )}
            <IconButton onClick={() => handleModalClose()}>
              <Close />
            </IconButton>
          </Box>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <Box component="form" onSubmit={preSubmit}>
          {renderContent()}
          {isUpdate && (
          <Button type="submit" fullWidth variant="contained">
            Guardar cambios
          </Button>
          )}
        </Box>
        <CustomDialog
          title="Editar producto"
          text="Esta acción no se puede deshacer, ¿Desea continuar?"
          isOpen={dialogOpen}
          onAccept={handleSubmit(onSubmit)}
          onCancel={handleDialogCancel}
        />
      </Box>
    </SytledModal>
  );
};

export default ModalProductDetails;
