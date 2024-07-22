import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import React from 'react';
import { PropTypes } from 'prop-types';
import { useSelector } from 'react-redux';

const AddSalesOrderForm = ({ setValue }) => {
  const customers = useSelector((store) => store.crud.listAll);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        border={1}
        borderColor="background.paper"
        borderRadius={2.5}
        p={1}
        mt={2}>
        <Box display="flex" gap={2}>
          <Autocomplete
            fullWidth
            id="customers"
            sx={{ maxWidth: '300px', width: '100%' }}
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedCustomer(newValue);
                setValue('customer', newValue._id);
                setValue('shippingAddress.street', newValue.address?.street || '');
                setValue('shippingAddress.streetNumber', newValue.address?.streetNumber || '');
                setValue('shippingAddress.floor', newValue.address?.floor || '');
                setValue('shippingAddress.apartment', newValue.address?.apartment || '');
                setValue('shippingAddress.city', newValue.address?.city || '');
                setValue('shippingAddress.state', newValue.address?.state || '');
                setValue('shippingAddress.zipCode', newValue.address?.zipCode || '');
              } else {
                setSelectedCustomer(null);
                setValue('customer', '');
                setValue('shippingAddress.street', '');
                setValue('shippingAddress.streetNumber', '');
                setValue('shippingAddress.floor', '');
                setValue('shippingAddress.apartment', '');
                setValue('shippingAddress.city', '');
                setValue('shippingAddress.state', '');
                setValue('shippingAddress.zipCode', '');
              }
            }}
            options={customers.result.items.result}
            getOptionLabel={(option) => option?.name || ''}
            filterSelectedOptions
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} required variant="outlined" label="Cliente" margin="normal" />
            )}
          />
          {selectedCustomer && (
            <Box alignSelf="end">
              <Typography>
                Documento:
                {' '}
                {selectedCustomer.documentType}
                {' '}
                {selectedCustomer.documentNumber}
              </Typography>
              <Typography>
                email:
                {' '}
                {selectedCustomer.email}
              </Typography>
              <Typography>
                Address:
                {' '}
                {selectedCustomer.address?.zipCode}
                {' '}
                {selectedCustomer.address?.street}
                {' '}
                {selectedCustomer.address?.streetNumber}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Box />
    </>
  );
};

AddSalesOrderForm.propTypes = {
  setValue: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
};

export default AddSalesOrderForm;
