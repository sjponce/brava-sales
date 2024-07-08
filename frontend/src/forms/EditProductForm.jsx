import {
  Autocomplete,
  Box,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { AddPhotoAlternateOutlined, HideImageOutlined } from '@mui/icons-material';
import uploadImageToImgbb from '@/utils/uploadImageToImgbb';
import tags from '@/utils/tags';

const tagsList = Object
  .entries(tags)
  .flatMap(([category, tagItem]) => tagItem.map((tag) => ({ category, tag })));

const EditProductForm = ({ register, setValue, watch }) => {
  const handleImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      const imageUrl = await uploadImageToImgbb(image);
      setValue('imageUrl', imageUrl);
    }
  };

  const handlePriceChange = (event) => {
    const filteredValue = event.target.value.replace(/[^0-9.]/g, '');
    setValue('price', filteredValue);
  };

  const handleRemoveImage = (event) => {
    event.preventDefault();
    setValue('imageUrl', '');
    const fileInput = document.getElementById('raised-button-file');
    if (fileInput) fileInput.value = '';
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
            flexDirection="column"
            borderRadius={2.5}
            maxWidth="232px">
            <Box>
              <img
                src={watch('imageUrl') !== '' ? watch('imageUrl') : '/noImage.png'}
                alt=""
                style={{
                  borderRadius: '10px',
                  objectFit: 'cover',
                  width: '200px',
                  cursor: 'zoom-in',
                }}
              />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" gap={3}>
              <label htmlFor="raised-button-file">
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  type="file"
                  data-testid="raised-button-file"
                  onChange={handleImageChange}
                />
                <Tooltip
                  title={
                    watch('imageUrl') !== ''
                      ? 'Quitar imagen de producto'
                      : 'Agregar imagen de producto'
                  }>
                  <IconButton
                    component="span"
                    onClick={watch('imageUrl') !== '' ? handleRemoveImage : undefined}>
                    {watch('imageUrl') !== '' ? (
                      <HideImageOutlined />
                    ) : (
                      <AddPhotoAlternateOutlined />
                    )}
                  </IconButton>
                </Tooltip>
              </label>
            </Box>
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
            margin="normal"
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
        options={tagsList}
        groupBy={(option) => option.category}
        getOptionLabel={(option) => option.tag}
        defaultValue={[tagsList[0], tagsList[7]]}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Tags" margin="normal" />
        )}
        renderTags={(value, getTagProps) => value.map((option, index) => {
          const { key, ...otherProps } = getTagProps({ index });
          return <Chip key={key} label={`${option.tag}`} {...otherProps} />;
        })}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <Box component="li" key={key} {...otherProps}>
              <Typography variant="subtitle1">{option.tag}</Typography>
            </Box>
          );
        }}
      />
    </Box>
  );
};

export default EditProductForm;
