import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  TextField,
  Select,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

const PremiumUsernameItem = ({
  id,
  username,
  price,
  discountPrice,
  available,
  mode,
  onEdit,
  onSave,
  onCancel,
  loading,
}) => {
  const [usernameValue, setUsernameValue] = useState(username);
  const [priceValue, setPriceValue] = useState(`${price}`);
  const [discountPriceValue, setDiscountPriceValue] = useState(
    `${discountPrice}`
  );
  const [availableValue, setAvailableValue] = useState(available);

  const theme = useTheme();

  const matches = useMediaQuery(theme.breakpoints.down('md'));

  const handleEdit = () => onEdit(id);

  const handleSave = () => {
    onSave(id, usernameValue, +priceValue, +discountPriceValue, availableValue);
  };

  const handleCancel = () => onCancel();

  const handleInput = (e) => {
    const { value, name } = e.target;

    switch (name) {
      case 'username':
        return setUsernameValue(value);

      case 'price':
        return setPriceValue(value);

      case 'discountPrice':
        return setDiscountPriceValue(value);

      case 'available':
        return setAvailableValue(value);

      default:
        return console.log(`unknown input name - ${name}`);
    }
  };

  const rootGridJustify = matches ? 'center' : 'space-between';
  const gridWrap = matches ? 'wrap' : 'nowrap';

  return (
    <Card>
      <Grid container justifyContent={rootGridJustify}>
        <CardContent>
          <Grid container wrap={gridWrap} spacing={2}>
            <Grid
              item
              sx={{
                maxWidth: '150px',
              }}
            >
              <Typography color="textSecondary">username</Typography>
              {mode === 'static' && <Typography noWrap>{username}</Typography>}
              {mode === 'edit' && (
                <TextField
                  value={username}
                  disabled
                  sx={{
                    textOverflow: 'ellipsis',
                  }}
                />
              )}
              {mode === 'add' && (
                <TextField
                  name="username"
                  value={usernameValue}
                  onChange={handleInput}
                  sx={{
                    textOverflow: 'ellipsis',
                  }}
                />
              )}
            </Grid>
            <Grid item>
              <Typography color="textSecondary">price</Typography>
              {mode === 'static' && <Typography>{price}</Typography>}
              {(mode === 'edit' || mode === 'add') && (
                <TextField
                  name="price"
                  type="number"
                  value={priceValue}
                  onChange={handleInput}
                  InputProps={{
                    sx: {
                      '& input[type=number]': {
                        MozAppearance: 'textfield',
                      },
                      '& input[type=number]::-webkit-outer-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                      },
                      '& input[type=number]::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                      },
                    },
                  }}
                />
              )}
            </Grid>
            {Boolean(discountPrice) && mode === 'static' && (
              <Grid item>
                <Typography color="textSecondary">discount price</Typography>
                <Typography>{discountPrice}</Typography>
              </Grid>
            )}
            {(mode === 'edit' || mode === 'add') && (
              <Grid item>
                <Typography color="textSecondary">discount price</Typography>
                <TextField
                  name="discountPrice"
                  type="number"
                  value={discountPriceValue}
                  onChange={handleInput}
                />
              </Grid>
            )}
            <Grid item>
              <Typography color="textSecondary">available</Typography>
              {mode === 'static' && (
                <Typography>{`${available ? 'yes' : 'no'}`}</Typography>
              )}
              {(mode === 'edit' || mode === 'add') && (
                <Select
                  name="available"
                  value={availableValue}
                  onChange={handleInput}
                >
                  <MenuItem value={true}>yes</MenuItem>
                  <MenuItem value={false}>no</MenuItem>
                </Select>
              )}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Grid container>
            {mode === 'static' && (
              <>
                <Grid item>
                  <IconButton onClick={handleEdit} size="large">
                    <EditIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton size="large">
                    <DeleteIcon color="error" />
                  </IconButton>
                </Grid>
              </>
            )}
            {(mode === 'edit' || mode === 'add') && (
              <>
                <Grid item>
                  <IconButton
                    onClick={handleSave}
                    disabled={loading}
                    size="large"
                  >
                    <CheckIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={handleCancel}
                    disabled={loading}
                    size="large"
                  >
                    <CloseIcon color="error" />
                  </IconButton>
                </Grid>
              </>
            )}
          </Grid>
        </CardActions>
      </Grid>
    </Card>
  );
};

PremiumUsernameItem.defaultProps = {
  id: '',
  username: '',
  price: 0,
  discountPrice: 0,
  available: true,
  onEdit: () => null,
};

PremiumUsernameItem.propTypes = {
  id: PropTypes.string,
  username: PropTypes.string,
  price: PropTypes.number,
  discountPrice: PropTypes.number,
  available: PropTypes.bool,
  mode: PropTypes.oneOf(['static', 'edit', 'add']).isRequired,
  onEdit: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default PremiumUsernameItem;
