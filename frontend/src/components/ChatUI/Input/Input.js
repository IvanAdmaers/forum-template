import PropTypes from 'prop-types';
import { Grid, Box, Typography, TextField, ButtonBase } from '@mui/material';
import { yellow } from '@mui/material/colors';
import { Send as SendIcon } from '@mui/icons-material';

import { Avatar } from 'components/UserUI';

const Input = ({
  value,
  onChange,
  onSubmit,
  isSubmitDisabled,
  avatarImage,
  username,
  length,
  limit,
  children,
}) => {
  const getCounterColor = (theme) => {
    if (length >= limit) {
      return theme.palette.error.main;
    }

    const warning = limit - 50;

    if (length >= warning) {
      return yellow[700];
    }

    return '';
  };

  const submitIconColor = isSubmitDisabled ? 'disabled' : 'inherit';

  return (
    <div>
      <Grid container wrap="nowrap">
        <Grid item>
          <Box mr={1}>
            <Avatar
              width={24}
              height={24}
              image={avatarImage}
              username={username}
            />
          </Box>
        </Grid>
        <Box width="100%">
          <Grid item>
            <Typography color="textSecondary">{username}</Typography>
            {children}
            <TextField
              value={value}
              onChange={onChange}
              placeholder="Say something"
              variant="standard"
              multiline
              fullWidth
            />
          </Grid>
        </Box>
      </Grid>
      <Box mt={1}>
        <Grid container wrap="nowrap" align="center" justifyContent="flex-end">
          <Box mr={1}>
            <Typography sx={{ color: getCounterColor }}>
              {length}/{limit}
            </Typography>
          </Box>
          <ButtonBase
            disabled={isSubmitDisabled}
            onClick={onSubmit}
            centerRipple
          >
            <SendIcon color={submitIconColor} />
          </ButtonBase>
        </Grid>
      </Box>
    </div>
  );
};

Input.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitDisabled: PropTypes.bool.isRequired,
  avatarImage: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  length: PropTypes.number,
  limit: PropTypes.number,
  children: PropTypes.node,
};

Input.defaultProps = {
  length: 0,
  limit: 200,
  children: null,
};

export default Input;
