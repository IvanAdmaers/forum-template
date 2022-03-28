import PropTypes from 'prop-types';
import { InputBase, ButtonBase } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled(ButtonBase)(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Search = ({ value, onChange, onSubmit }) => {
  const handleChange = (event) => {
    onChange(event);
  };

  const handleSubmit = (event) => {
    onSubmit(event);
  };

  return (
    <SearchWrapper>
      <SearchIconWrapper onClick={handleSubmit}>
        <SearchIcon />
      </SearchIconWrapper>
      <form action="/search" onSubmit={handleSubmit}>
        <StyledInputBase
          name="q"
          value={value}
          onChange={handleChange}
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          required
        />
      </form>
    </SearchWrapper>
  );
};

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Search;
