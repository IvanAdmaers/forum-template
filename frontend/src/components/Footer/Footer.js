import PropTypes from 'prop-types';
import { Typography, Divider, Box } from '@mui/material';

import MyLink from 'components/MyLink';
import FooterColumns from 'components/Footer/FooterColumns';

import { getSiteName } from 'utills';

const siteName = getSiteName();

const Copyright = () => {
  const year = new Date().getFullYear();

  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <MyLink color="inherit" href="/">
        {siteName}
      </MyLink>{' '}
      {year}
    </Typography>
  );
};

const Footer = ({ footerList }) => {
  return (
    <>
      <Divider />
      <footer>
        <Box sx={{ px: 2 }}>
          <Typography variant="h6" align="center" gutterBottom>
            {siteName}
          </Typography>
          <Box sx={{ width: 'max-content', my: 1, mx: 'auto' }}>
            <FooterColumns footerList={footerList} rowItems={2} />
          </Box>
          <Typography
            variant="subtitle1"
            align="center"
            color="textSecondary"
            component="p"
            gutterBottom
          >
            Some cool text is here 😎
          </Typography>
          <Copyright />
        </Box>
      </footer>
    </>
  );
};

Footer.defaultProps = {
  footerList: [],
};

Footer.propTypes = {
  footerList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      link: PropTypes.string,
    })
  ),
};

export default Footer;
