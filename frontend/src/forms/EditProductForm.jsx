import {
  Autocomplete,
  Box,
  Chip,
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import tagsArray from '@/utils/tags';

const EditProductForm = ({ register, setValue, watch }) => {
  const handlePriceChange = (event) => {
    const filteredValue = event.target.value.replace(/[^0-9.]/g, '');
    setValue('price', filteredValue);
  };

  return (
    <Box sx={{ overflowY: 'auto', height: '60vh', padding: 1 }}>
      <Box
        display="flex"
        gap={3}
        sx={{ flexDirection: { sm: 'row', xs: 'column' } }}
        alignItems={{ sm: 'inherit', xs: 'center' }}>
        <Box>
          <Box
            bgcolor="background.paper"
            p={2}
            display="flex"
            mt={2}
            flexDirection="column"
            borderRadius={2.5}>
            <img
              src={watch('imageUrl') !== '' ? watch('imageUrl') : '/noImage.png'}
              alt=""
              style={{
                borderRadius: '10px',
                objectFit: 'cover',
                width: '200px',
              }}
            />
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" width="100%" gap={2} justifyContent="center">
          <Typography variant="h5">
            {watch('name')}
            {' '}
            {watch('color')}
          </Typography>
          <TextField
            name="price"
            required
            label="Precio"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            onChange={handlePriceChange}
            value={watch('price')}
            fullWidth
          />
          <TextField
            name="description"
            margin="normal"
            label="Descripción"
            {...register('description')}
            minRows={3}
            fullWidth
            multiline
          />
        </Box>
      </Box>
      <Divider sx={{ mt: 2 }} />
      <Autocomplete
        multiple
        fullWidth
        id="tags-standard"
        options={tagsArray}
        getOptionLabel={(option) => option?.name || ''}
        groupBy={(option) => option?.category}
        defaultValue={watch('tags') || []}
        filterSelectedOptions
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Tags" margin="normal" />
        )}
        renderTags={(value, getTagProps) => value.map((option, index) => {
          const { key, ...otherProps } = getTagProps({ index });
          return <Chip key={key} label={`${option.name}`} {...otherProps} />;
        })}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <Box component="li" key={key} {...otherProps}>
              <Typography variant="subtitle1">{option.name}</Typography>
            </Box>
          );
        }}
      />
    </Box>
  );
};

export default EditProductForm;
