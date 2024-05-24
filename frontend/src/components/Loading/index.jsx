import { CircularProgress, Backdrop, Box} from '@mui/material';

export default function Loading({ isLoading, children }) {
  return (
    <Box>
      {children}
      <Backdrop open={isLoading} style={{ color: '#fff', zIndex: 1500 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
