import { CircularProgress, Backdrop, Box } from '@mui/material';
import PropTypes from 'prop-types';

const Loading = ({ isLoading }) => (
  <Box>
    <Backdrop open={isLoading} style={{ color: '#fff', zIndex: 1500 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  </Box>
);

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default Loading;
