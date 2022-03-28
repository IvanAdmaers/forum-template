import PropTypes from 'prop-types';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

const getInputProps = (type, showPassword) => {
  switch (type) {
    case 'request':
      return {
        type: 'email',
        id: 'email',
        name: 'email',
        helperText: 'Account email',
        label: 'Email',
      };

    case 'reset':
      return {
        type: showPassword ? 'text' : 'password',
        id: 'password',
        name: 'password',
        helperText: 'New password',
        label: 'Password',
      };

    default:
      throw new Error('Input type is not known');
  }
};

const Input = ({
  type,
  value,
  onChange,
  error,
  showPasswordToggler,
  showPassword,
  onShowPassword,
}) => {
  const {
    type: inputType,
    helperText,
    id,
    label,
    name,
  } = getInputProps(type, showPassword);

  const inputTogglerProps = !showPasswordToggler
    ? null
    : {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={onShowPassword}
              size="large">
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
      };

  return (
    <TextField
      onChange={onChange}
      value={value}
      type={inputType}
      variant="outlined"
      margin="normal"
      error={!!error}
      helperText={!error ? helperText : error}
      required
      fullWidth
      id={id}
      label={label}
      name={name}
      autoComplete="off"
      InputProps={inputTogglerProps}
    />
  );
};

Input.defaultProps = {
  error: '',
  showPasswordToggler: false,
  showPassword: false,
  onShowPassword: () => {},
};

Input.propTypes = {
  type: PropTypes.oneOf(['request', 'reset']),
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  showPasswordToggler: PropTypes.bool,
  showPassword: PropTypes.bool,
  onShowPassword: PropTypes.func,
};

export default Input;
