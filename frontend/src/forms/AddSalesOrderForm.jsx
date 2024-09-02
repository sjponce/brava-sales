import {
  Autocomplete, Box, TextField, Typography,
} from '@mui/material';
import { PropTypes } from 'prop-types';
import { useSelector } from 'react-redux';

const AddSalesOrderForm = ({ setValue, watch }) => {
  const customers = useSelector((store) => store.crud.listAll);
  const selectedCustomer = watch('customer') || null;

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        border={1}
        borderColor="background.paper"
        borderRadius={2.5}
        p={1}>
        <Box display="flex" gap={2}>
          <Autocomplete
            fullWidth
            id={selectedCustomer?._id || ''}
            sx={{ maxWidth: '300px', width: '100%' }}
            value={selectedCustomer}
            onChange={(event, value) => { setValue('customer', value); }}
            options={customers.result?.items?.result}
            getOptionLabel={(option) => option?.name || ''}
            filterSelectedOptions
            isOptionEqualToValue={(option, value) => option._id === value._id || value === ''}
            renderInput={(params) => (
              <TextField {...params} required variant="outlined" label="Cliente" margin="normal" />
            )}
          />
          {selectedCustomer && (
            <Box alignSelf="end">
              <Typography>
                Documento:
                {' '}
                {selectedCustomer?.documentType || ''}
                {' '}
                {selectedCustomer?.documentNumber || ''}
              </Typography>
              <Typography>
                email:
                {' '}
                {selectedCustomer?.email || ''}
              </Typography>
              <Typography>
                Address:
                {' '}
                {selectedCustomer?.address?.zipCode || ''}
                {' '}
                {selectedCustomer?.address?.street || ''}
                {' '}
                {selectedCustomer?.address?.streetNumber || ''}
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
