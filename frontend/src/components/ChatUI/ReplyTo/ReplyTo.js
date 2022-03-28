import PropTypes from 'prop-types';
import { Grid, Divider, Typography, Box, ButtonBase } from '@mui/material';
import { darken } from '@mui/material/styles';
import { Close as CloseIcon } from '@mui/icons-material';

const ReplyTo = ({ mode, username, text, onCancel }) => {
  const isReplyingMode = mode === 'replying';

  const contentDisplayProperty = isReplyingMode ? 'block' : 'flex';
  const textMarginLeft = isReplyingMode ? 0 : 1;

  return (
    <Grid
      container
      wrap="nowrap"
      sx={{
        backgroundColor: (theme) => darken(theme.palette.background.paper, 0.2),
      }}
    >
      <Grid item>
        <Divider orientation="vertical" />
      </Grid>
      <Box ml={1} width="200px" flexGrow="1">
        <Grid item>
          <Box display={contentDisplayProperty}>
            <Typography color="textSecondary" noWrap>
              {username}
            </Typography>
            <Box flex={1} overflow="auto" ml={textMarginLeft}>
              <Typography noWrap>{text}</Typography>
            </Box>
          </Box>
        </Grid>
      </Box>
      {isReplyingMode && (
        <Box ml="auto" alignSelf="center">
          <Grid item>
            <ButtonBase onClick={onCancel} centerRipple>
              <CloseIcon fontSize="small" />
            </ButtonBase>
          </Grid>
        </Box>
      )}
    </Grid>
  );
};

ReplyTo.propTypes = {
  mode: PropTypes.oneOf(['replying', 'replied']).isRequired,
  username: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onCancel: PropTypes.func,
};

ReplyTo.defaultProps = {
  onCancel: () => null,
};

export default ReplyTo;
