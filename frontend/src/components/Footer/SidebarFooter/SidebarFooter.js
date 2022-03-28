import PropTypes from 'prop-types';
import { Container, Divider } from '@mui/material';

import FooterColumns from 'components/Footer/FooterColumns';

const SidebarFooter = ({ footerList }) => {
  return (
    <>
      <Divider />
      <Container>
        <FooterColumns footerList={footerList} />
      </Container>
    </>
  );
};

SidebarFooter.defaultProps = {
  footerList: [],
};

SidebarFooter.propTypes = {
  footerList: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      title: PropTypes.string,
    })
  ),
};

export default SidebarFooter;
