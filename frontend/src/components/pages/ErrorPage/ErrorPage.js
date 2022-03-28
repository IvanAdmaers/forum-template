import PropTypes from 'prop-types';
import { Grid, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

import MyHead from 'components/MyHead';
import MyLink from 'components/MyLink';

const colorDivStyles = {
  visibility: 'hidden',
  position: 'absolute',
  borderRadius: '50px',
  backgroundColor: 'white',
};

const ColorDiv1 = styled('div')({
  ...colorDivStyles,
  bottom: '51%',
  left: '40%',
  height: '2px',
  width: '30px',
});

const ColorDiv2 = styled('div')({
  ...colorDivStyles,
  bottom: '52%',
  left: '45%',
  height: '2px',
  width: '24px',
});

const ColorDiv3 = styled('div')({
  ...colorDivStyles,
  bottom: '47%',
  left: '42%',
  height: '2px',
  width: '30px',
});

const ColorDiv4 = styled('div')({
  ...colorDivStyles,
  bottom: '53%',
  left: '56%',
  height: '2px',
  width: '27px',
});

const ColorDiv5 = styled('div')({
  ...colorDivStyles,
  bottom: '47%',
  left: '57%',
  height: '3px',
  width: '72px',
});

const ColorDiv6 = styled('div')({
  ...colorDivStyles,
  bottom: '49%',
  right: '46%',
  height: '2px',
  width: '70px',
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: theme.spacing(9),
  '&:hover': {
    animation: '0.5s glitch infinite',
    boxShadow: 'none',
  },
  '&:hover ~ div:nth-child(1)': {
    visibility: 'visible',
    animation: '0.2s div-glitch infinite',
  },
  '&:hover ~ div:nth-child(2)': {
    visibility: 'visible',
    animation: '0.2s div-glitch infinite',
  },
  '&:hover ~ div:nth-child(3)': {
    visibility: 'visible',
    animation: '0.2s div-glitch infinite',
  },
  '&:hover ~ div:nth-child(4)': {
    visibility: 'visible',
    animation: '0.2s div-glitch infinite',
  },
  '&:hover ~ div:nth-child(5)': {
    visibility: 'visible',
    animation: '0.2s two-glitch infinite',
  },
  '&:hover ~ div:nth-child(6)': {
    visibility: 'visible',
    animation: '0.2s two-glitch infinite',
  },
  '@keyframes glitch': {
    '0%': { textShadow: '7px 2px red , -7px -2px aqua' },
    '12%': { textShadow: 'none' },
    '25%': { textShadow: '9px 2px red , -7px -2px aqua' },
    '36%': { textShadow: '7px 2px red , -7px -2px aqua' },
    '50%': { textShadow: '10px 2px red , -7px -2px aqua' },
    '62%': { textShadow: '7px 2px red , -10px -2px aqua' },
    '75%': { textShadow: '6px 2px red , -7px -2px aqua' },
    '88%': { textShadow: '7px 2px red , -6px -2px aqua' },
    '100%': { textShadow: '7px 2px red , -10px -2px aqua' },
  },
  '@keyframes div-glitch': {
    '0%': { boxShadow: '7px 4px red , -13px -2px aqua' },
    '25%': { boxShadow: '20px 2px red , -10px -2px aqua' },
    '50%': { boxShadow: '3px 2px red , -7px -2px aqua' },
    '75%': { boxShadow: '13px 6px red , -10px -2px aqua' },
    '100%': { boxShadow: '7px 2px red , -10px -2px aqua' },
  },
  '@keyframes two-glitch': {
    '0%': { boxShadow: '7px 2px red , -7px -2px aqua' },
    '12%': { boxShadow: '20px 2px red , -9px -2px aqua' },
    '25%': { boxShadow: '7px 2px red , -10px -2px aqua' },
    '36%': { boxShadow: '12px 2px red , -7px -2px aqua' },
    '50%': { boxShadow: 'none', visibility: 'hidden' },
    '62%': { boxShadow: '7px 2px red , -5px -2px aqua' },
    '75%': { boxShadow: '16px 2px red , -12px -2px aqua' },
    '88%': { boxShadow: '7px 2px red , -13px -2px aqua' },
    '100%': { boxShadow: '20px 2px red , -7px -2px aqua' },
  },
}));

const ErrorPage = ({ statusCode, errorText, goHomeAction }) => {
  return (
    <>
      <MyHead title={`Error ${statusCode}`} noIndex />
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
        sx={{ minHeight: '100vh', position: 'relative' }}
      >
        <StyledTypography component="h1" variant="h1">
          {statusCode}
        </StyledTypography>
        <ColorDiv1 />
        <ColorDiv2 />
        <ColorDiv3 />
        <ColorDiv4 />
        <ColorDiv5 />
        <ColorDiv6 />
        <Typography gutterBottom>{errorText}</Typography>
        {goHomeAction && (
          <MyLink href="/">
            <Button variant="contained" color="primary">
              Go home
            </Button>
          </MyLink>
        )}
      </Grid>
    </>
  );
};

ErrorPage.propTypes = {
  statusCode: PropTypes.string,
  errorText: PropTypes.string,
  goHomeAction: PropTypes.bool,
};

ErrorPage.defaultProps = {
  statusCode: '404',
  errorText: 'Something went wrong',
  goHomeAction: false,
};

export default ErrorPage;
