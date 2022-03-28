import PropTypes from 'prop-types';
import {
  Container,
  Typography,
  Grid,
  Box,
  ButtonBase,
  Tooltip,
} from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  Done as DoneIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const getBodyText = (body = '') => {
  if (typeof window === 'undefined') {
    return `${body?.slice(0, 100)}...`;
  }

  const div = document.createElement('div');
  div.insertAdjacentHTML('afterbegin', body);

  const plainText = div.textContent || div.innerText || '';

  return `${plainText.slice(0, 100)}...`;
};

const StyledActions = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
    margin: theme.spacing(1, 0),
  },
}));

const Item = ({ id, title, body, link, onAction, disabled }) => {
  const bodyText = link ? getBodyText(body) : body;

  const handleConfirm = () => {
    onAction(true, id);
  };

  const handleDeny = () => {
    onAction(false, id);
  };

  return (
    <Container maxWidth="sm">
      <Grid container justifyContent="space-between">
        <Grid item sm={10} xs={12}>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          <Typography component="div">
            <p dangerouslySetInnerHTML={{ __html: bodyText }} />
          </Typography>
        </Grid>
        <Grid item sm={2} xs={12}>
          <StyledActions container>
            {link && (
              <Tooltip title="Open in new tab">
                <a href={link} target="_blank" rel="noreferrer">
                  <ButtonBase centerRipple>
                    <OpenInNewIcon color="action" />
                  </ButtonBase>
                </a>
              </Tooltip>
            )}
            <Box mx={0.5}>
              <Tooltip title="Confirm the complaint">
                <ButtonBase
                  onClick={handleConfirm}
                  disabled={disabled}
                  centerRipple
                >
                  <DoneIcon color="success" />
                </ButtonBase>
              </Tooltip>
            </Box>
            <Tooltip title="Deny the complaint">
              <ButtonBase onClick={handleDeny} disabled={disabled} centerRipple>
                <CloseIcon color="error" />
              </ButtonBase>
            </Tooltip>
          </StyledActions>
        </Grid>
      </Grid>
    </Container>
  );
};

Item.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  body: PropTypes.string.isRequired,
  link: PropTypes.string,
  onAction: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

Item.defaultProps = {
  title: '',
  link: '',
  disabled: false,
};

export default Item;
