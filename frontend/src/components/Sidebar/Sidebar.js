import PropTypes from 'prop-types';
import { Paper, Box } from '@mui/material';

import Support from './Support';
import TopCategories from './TopCategories';
import SidebarFooter from 'components/Footer/SidebarFooter';

const supportURL = process.env.NEXT_PUBLIC_SUPPORT_URL;

const Sidebar = ({ footerList, topGroupsList }) => {
  const supportElement = supportURL && (
    <Box sx={{ mt: 1 }}>
      <Support url={supportURL} />
    </Box>
  );

  return (
    <Paper sx={{ p: 1 }}>
      <TopCategories
        title="&#x1F91D; Best groups &#x1F91D;"
        itemsList={topGroupsList}
      />
      {supportElement}
      <Box display={{ xs: 'none', sm: 'none', md: 'block' }} sx={{ mt: 1 }}>
        <SidebarFooter footerList={footerList} />
      </Box>
    </Paper>
  );
};

Sidebar.defaultProps = {
  footerList: [],
  topGroupsList: [],
};

Sidebar.propTypes = {
  footerList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      link: PropTypes.string,
    })
  ),
  topGroupsList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      link: PropTypes.string,
    })
  ),
};

export default Sidebar;
