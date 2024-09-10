import { Box } from '@mui/material';

const TwoColorCircle = ({ color1, color2 = color1 }) => (
  <Box
    sx={{
      width: 20,
      height: 20,
      borderRadius: '50%',
      border: 1,
      background: `linear-gradient(45deg, ${color1} 50%, ${color2} 50%)`,
    }}
  />
);

export default TwoColorCircle;
