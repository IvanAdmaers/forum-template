import { Box } from '@mui/material';

const BanMarker = () => (
  <Box
    sx={{
      marginLeft: 1,
      py: 0.2,
      px: 0.4,
      textTransform: 'uppercase',
      background: (theme) => theme.palette.error.main,
      borderRadius: '4px',
      color: (theme) => theme.palette.common.white,
      cursor: 'default',
    }}
  >
    ban
  </Box>
);

export default BanMarker;
