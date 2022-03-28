import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import { createFakeArray } from 'utills';

const StyledLightropeItem = styled('li')({
  position: 'relative',
  animationFillMode: 'both',
  animationIterationCount: 'infinite',
  listStyle: 'none',
  padding: '0',
  width: '12px',
  height: '28px',
  borderRadius: '50%',
  margin: '20px',
  display: 'inline-block',
  background: 'rgba(0, 247, 165, 1)',
  boxShadow: '0px 4.6666666667px 24px 3px rgba(0, 247, 165, 1)',
  animationName: 'flash-1',
  animationDuration: '2s',
  '&:nth-child(2n+1)': {
    background: 'rgba(0, 255, 255, 1)',
    boxShadow: '0px 4.6666666667px 24px 3px rgba(0, 255, 255, 0.5)',
    animationName: 'flash-2',
    animationDuration: '0.4s',
  },
  '&:nth-child(4n+2)': {
    background: 'rgba(247, 0, 148, 1)',
    boxShadow: '0px 4.6666666667px 24px 3px rgba(247, 0, 148, 1)',
    animationName: 'flash-3',
    animationDuration: '1.1s',
  },
  '&:nth-child(odd)': {
    animationDuration: '1.8s',
  },
  '&:nth-child(3n+1)': {
    animationDuration: '1.4s',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    background: '#222',
    width: '10px',
    height: '9.3333333333px',
    borderRadius: '3px',
    top: '-4.6666666667px',
    left: '1px',
  },
  '&::after': {
    content: '""',
    top: '-14px',
    left: '9px',
    position: 'absolute',
    width: '52px',
    height: '18.6666666667px',
    borderBottom: 'solid #222 2px',
    borderRadius: '50%',
  },
  '&:last-child::after': {
    content: 'none',
  },
  '&:first-child': {
    marginLeft: '-40px',
  },
  '@keyframes flash-1': {
    '0%, 100%': {
      background: 'rgba(0, 247, 165, 1)',
      boxShadow: '0px 4.6666666667px 24px 3px rgba(0, 247, 165, 1)',
    },
    '50%': {
      background: 'rgba(0, 247, 165, 0.4)',
      boxShadow: '0px 4.6666666667px 24px 3px rgba(0, 247, 165, 0.2)',
    },
  },
  '@keyframes flash-2': {
    '0%, 100%': {
      background: 'rgba(0, 255, 255, 1)',
      boxShadow: '0px 4.6666666667px 24px 3px rgba(0, 255, 255, 1)',
    },
    '50%': {
      background: 'rgba(0, 255, 255, 0.4)',
      boxShadow: '0px 4.6666666667px 24px 3px rgba(0, 255, 255, 0.2)',
    },
  },
  '@keyframes flash-3': {
    '0%, 100%': {
      background: 'rgba(247, 0, 148, 1)',
      boxShadow: '0px 4.6666666667px 24px 3px rgba(247, 0, 148, 1)',
    },
    '50%': {
      background: 'rgba(247, 0, 148, 0.4)',
      boxShadow: '0px 4.6666666667px 24px 3px rgba(247, 0, 148, 0.2)',
    },
  },
});

// Source: https://codepen.io/tobyj/pen/QjvEex?editors=1111

const ChristmasLights = ({ length }) => {
  const fakeArray = createFakeArray(length);

  const items = fakeArray.map((id) => (
    <StyledLightropeItem
      data-testid="lightrope-item"
      key={`lightrope-${id}`}
    />
  ));

  return (
    <Box
      component="ul"
      sx={{
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        position: 'absolute',
        zIndex: 1,
        margin: '-15px 0 0 0',
        padding: 0,
        pointerEvents: 'none',
        width: '100%',
      }}
    >
      {items}
    </Box>
  );
};

ChristmasLights.propTypes = {
  length: PropTypes.number.isRequired,
};

export default ChristmasLights;
