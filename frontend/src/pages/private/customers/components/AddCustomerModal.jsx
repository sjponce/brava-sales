import {
  Box, Button, Divider, IconButton, Modal, Typography, styled,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Close } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import AddCustomerForm from '@/forms/AddCustomerForm';
import { selectCreatedItem, selectCurrentItem } from '@/redux/crud/selectors';
import crud from '@/redux/crud/actions';
import CustomDialog from '@/components/customDialog/CustomDialog.component';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const AddSellerModal = ({
  idSeller, open, handlerOpen,
}) => {
  const documentTypeOptions = [
    { label: 'DNI', value: 'DNI' },
    { label: 'CUIT', value: 'CUIT' },
  ];
  const ivaConditionOptions = [
    { label: 'Responsable Inscripto', value: 'Responsable Inscripto' },
    { label: 'Consumidor final', value: 'Consumidor final' },
    { label: 'Exento', value: 'Exento' },
    { label: 'Monotributista', value: 'Monotributista' },
  ];
  const dispatch = useDispatch();
  const customerData = useSelector(selectCurrentItem);
  const {
    register, handleSubmit, setValue, watch,
  } = useForm();
  const [dialogOpen, setDialogOpen] = useState(false);

  const isUpdate = !!idSeller.length;

  const createSeller = async (data) => {
    try {
      dispatch(
        crud.create({
          entity: 'customer',
          jsonData: {
            ...data,
            documentType: documentTypeOptions.find((documentType) => documentType.label === data.documentType)?.value ?? watch('documentType'),
            ivaCondition: ivaConditionOptions.find((ivaCondition) => ivaCondition.label === data.ivaCondition)?.value ?? watch('ivaCondition'),
          },
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isUpdate) {
      setValue('id', customerData.result._id);
      setValue('name', customerData.result.name);
      setValue('email', customerData.result.email);
      setValue('number', customerData.result.number);
      setValue('documentType', customerData.result.documentType);
      setValue('documentNumber', customerData.result.documentNumber);
      setValue('ivaCondition', customerData.result.ivaCondition);
      setValue('address', customerData.result.address);
    }
  }, [customerData]);

  const updateSeller = async (data) => {
    try {
      dispatch(
        crud.update({
          entity: 'customer',
          id: idSeller,
          jsonData: {
            ...data,
            documentType: documentTypeOptions.find((documentType) => documentType.label === data.documentType)?.value ?? watch('documentType'),
            ivaCondition: ivaConditionOptions.find((ivaCondition) => ivaCondition.label === data.ivaCondition)?.value ?? watch('ivaCondition'),
          },
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const preSubmit = (e) => {
    e.preventDefault();
    setDialogOpen(true);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
  };

  const onSubmit = async (data) => {
    if (isUpdate) {
      updateSeller(data);
    } else {
      createSeller(data);
    }
    setDialogOpen(false);
    handlerOpen(false);
  };

  const { isLoading } = useSelector(selectCreatedItem);

  return (
    <StyledModal open={open}>
      <Box
        width={{ xs: '100%', sm: 800 }}
        height="auto"
        bgcolor="background.default"
        p={3}
        borderRadius={2.5}
        display="flex"
        flexDirection="column">
        <Box alignItems="center" display="flex" mb={2} justifyContent="space-between">
          <Typography variant="h4" color="primary">
            {isUpdate ? 'Editar cliente ' : 'Crear cliente'}
          </Typography>
          <IconButton onClick={() => handlerOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <Box component="form" name="add_seller" onSubmit={preSubmit}>
          <AddCustomerForm
            register={register}
            setValue={setValue}
            watch={watch}
            documentTypeOptions={documentTypeOptions}
            ivaConditionOptions={ivaConditionOptions} />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            size="large"
            fullWidth>
            <Typography variant="button">
              {isUpdate ? 'Guardar cambios ' : 'Crear nuevo'}
            </Typography>
          </Button>
          <CustomDialog
            title={`${isUpdate ? 'Editar' : 'Crear nuevo'} cliente`}
            text="Esta accion no se puede deshacer, ¿Desea continuar?"
            isOpen={dialogOpen}
            onAccept={handleSubmit(onSubmit)}
            onCancel={handleDialogCancel}
          />
        </Box>
      </Box>
    </StyledModal>
  );
};

AddSellerModal.propTypes = {
  idSeller: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handlerOpen: PropTypes.func.isRequired,
};

export default AddSellerModal;
