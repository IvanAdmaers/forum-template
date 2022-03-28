import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

const ReactSnowfall = dynamic(() => import('react-snowfall'), { ssr: false });

const Snowfall = () => {
  const winterDesign = useSelector(({ settings }) => settings.design.winter);

  const { color, snowflakeCount, speed, wind, radius } = winterDesign;

  return (
    <Box
      sx={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
      }}
    >
      <ReactSnowfall
        color={color}
        snowflakeCount={snowflakeCount}
        speed={speed}
        wind={wind}
        radius={radius}
      />
    </Box>
  );
};

export default Snowfall;
