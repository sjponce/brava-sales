import {
  Autocomplete,
  Box,
  Chip,
  Divider,
  FormControlLabel,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';

const EditProductForm = ({ register, setValue, watch }) => {
  const handlePriceChange = (event) => {
    const filteredValue = event.target.value.replace(/[^0-9.]/g, '');
    setValue('price', filteredValue);
  };
  const tags = useSelector((store) => store.crud?.listAll?.result?.items?.result);
  const sortedTags = Array.isArray(tags)
    ? [...tags].sort((a, b) => {
      if (a.category < b.category) return -1;
      if (a.category > b.category) return 1;
      return 0;
    })
    : [];

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
            <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
              <Typography variant="caption">
                Id del producto
              </Typography>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                {watch('stockId')}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" width="100%" gap={2} justifyContent="center">
          <TextField
            name="promotionalName"
            required
            label="Nombre promocional"
            {...register('promotionalName')}
            value={watch('promotionalName')}
            fullWidth
          />
          <TextField
            name="price"
            required
            label="Precio"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            helperText={watch('price') <= 0 ? 'Indica el valor del precio' : ''}
            onChange={handlePriceChange}
            value={watch('price')}
            fullWidth
          />
          <TextField
            name="description"
            margin="normal"
            label="Descripción"
            {...register('description')}
            minRows={2}
            fullWidth
            multiline
          />
          <FormControlLabel
            control={(
              <Switch
                checked={watch('enabled') || false}
                onChange={(e) => setValue('enabled', e.target.checked)}
                disabled={watch('price') <= 0}
                color="primary"
              />
            )}
            label="Publicar en catálogo"
            sx={{
              mt: 1,
              opacity: watch('price') <= 0 ? 0.5 : 1,
            }}
            title={watch('price') <= 0 ? 'Indica un precio válido para publicar' : ''}
          />
        </Box>
      </Box>
      <Divider sx={{ mt: 2 }} />
      <Autocomplete
        multiple
        fullWidth
        id="tags-standard"
        options={sortedTags?.filter((tag) => tag.category !== 'color') || []}
        getOptionLabel={(option) => option?.name || ''}
        groupBy={(option) => option?.category}
        defaultValue={watch('tags') || []}
        onChange={(_, newValue) => {
          setValue('tags', newValue);
        }}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Tags" margin="normal" />
        )}
        renderTags={(value, getTagProps) => value.map((option, index) => {
          const { key, ...otherProps } = getTagProps({ index });
          return <Chip key={key} label={`${option.name}`} {...otherProps} />;
        })}
        renderGroup={(params) => (
          <li key={params.key}>
            <Typography color="secondary" ml={2} variant="overline">
              {params.group}
            </Typography>
            {params.children}
          </li>
        )}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <Box component="li" key={key} {...otherProps}>
              <Typography ml={2} variant="caption">{option.name}</Typography>
            </Box>
          );
        }}
      />
    </Box>
  );
};

export default EditProductForm;
