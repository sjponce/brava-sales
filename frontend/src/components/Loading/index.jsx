import { CircularProgress, Backdrop, Box } from '@mui/material';
import PropTypes from 'prop-types';
import './loading.scss';

const Loading = ({ isLoading }) => (
  <Box>
    <Backdrop
      data-test-id="loading-backdrop"
      open={isLoading}
      sx={{
        zIndex: 1500,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(3px)',
        animation: isLoading ? 'fadeIn 0.3s ease-in-out' : 'none',
      }}
    >
      <Box className="loading-container" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Box className="spinner-wrapper">
          <CircularProgress
            size={60}
            thickness={3.5}
            sx={{
              color: 'info.light',
              animation: 'spin 1.2s linear infinite',
            }}
          />
          <Box
            className="pulse-ring"
            sx={{
              position: 'absolute',
              width: 70,
              height: 70,
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              animation: 'pulse 1.5s ease-out infinite',
            }}
          />
        </Box>
      </Box>
    </Backdrop>
  </Box>
);

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default Loading;
