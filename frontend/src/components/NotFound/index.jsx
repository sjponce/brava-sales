import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFound({ entity = '' }) {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      gap={4}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="subtitle1">Sorry the Page you requested does not exist</Typography>
      <Button
        variant="contained"
        color="primary"
        size='large'
        onClick={() => {
          navigate('/');
        }}
      >
        <Typography variant='button'>Volver</Typography>
      </Button>
    </Box>
  );
}