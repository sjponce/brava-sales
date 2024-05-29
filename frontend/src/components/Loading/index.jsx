import { CircularProgress, Backdrop, Box } from '@mui/material';
import PropTypes from 'prop-types';

const Loading = ({ isLoading, children }) => (
  <Box>
    {children}
    <Backdrop open={isLoading} style={{ color: '#fff', zIndex: 1500 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  </Box>
);

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default Loading;
