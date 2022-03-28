import { Box } from '@mui/material';

const Separator = () => {
  return (
    <Box
      component="span"
      sx={{
        fontSize: 12,
        '&::before': {
          content: '"\\2022"',
          display: 'inline-block',
          margin: '0 4px',
          color: 'inherit',
        },
      }}
    />
  );
};

export default Separator;
