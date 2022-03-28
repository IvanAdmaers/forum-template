import PropTypes from 'prop-types';
import { ButtonBase } from '@mui/material';

import { ShareIcon } from 'components/Icons';

const Share = ({ onShare }) => {
  return (
    <ButtonBase
      onClick={onShare}
      variant="outlined"
      size="small"
      sx={{
        padding: (theme) => theme.spacing(1),
        border: (theme) => `1px solid ${theme.palette.grey[600]}`,
        borderRadius: '50%',
      }}
    >
      <ShareIcon />
    </ButtonBase>
  );
};

Share.defaultProps = {
  onShare: () => {},
};

Share.propTypes = {
  onShare: PropTypes.func,
};

export default Share;
