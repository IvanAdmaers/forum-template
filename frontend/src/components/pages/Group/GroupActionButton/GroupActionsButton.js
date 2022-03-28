import PropTypes from 'prop-types';
import { Button } from '@mui/material';

const GroupActionsButton = ({ member, onAction }) => {
  const dataAction = !member ? 'join' : 'unjoin';
  const variant = !member ? 'contained' : 'outlined';
  const text = !member ? 'Join' : 'Unjoin';

  return (
    <Button
      data-action={dataAction}
      onClick={onAction}
      variant={variant}
      color="primary"
    >
      {text}
    </Button>
  );
};

GroupActionsButton.defaultProps = {
  onAction: () => {},
};

GroupActionsButton.propTypes = {
  member: PropTypes.bool.isRequired,
  onAction: PropTypes.func,
};

export default GroupActionsButton;
