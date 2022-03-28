import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import {
  FormControl,
  TextField,
  MenuList,
  MenuItem,
  ListItemIcon,
  Typography,
} from '@mui/material';

import { Avatar } from 'components/UserUI';

const SelectGroups = ({
  value,
  onChange,
  groups,
  onGroupChange,
  defaultGroup,
  showHelperText,
}) => {
  const [defaultGroupSet, setDefaultGroupSet] = useState(false);
  const [searchValue, setSearchValue] = useState(value);
  const [isListOpen, setIsListOpen] = useState(false);

  const helperText = showHelperText
    ? 'You must be a member to add a post to a group.'
    : '';

  const groupChoosen = useCallback(
    (id = '', title = '') => {
      setSearchValue(title);
      setIsListOpen(false);
      onGroupChange(id, title);
    },
    [onGroupChange]
  );

  const handleChange = (e) => {
    const { value } = e.target;

    onChange(e);
    setSearchValue(value);
    setIsListOpen(true);
  };

  useEffect(() => {
    if (!defaultGroup || defaultGroupSet) return;

    const { id, title } = defaultGroup;

    groupChoosen(id, title);
    setDefaultGroupSet(true);
  }, [defaultGroup, groupChoosen, defaultGroupSet]);

  return (
    <>
      <FormControl fullWidth>
        <TextField
          fullWidth
          autoComplete="off"
          id="choose-group"
          label="Choose a group"
          helperText={helperText}
          onChange={handleChange}
          value={searchValue}
          disabled={Boolean(defaultGroup)}
          variant="standard"
        />
      </FormControl>
      <FormControl>
        {isListOpen && (
          <MenuList>
            {groups.map(({ id, image, title }) => {
              return (
                <MenuItem
                  key={`group-${id}`}
                  onClick={() => groupChoosen(id, title)}
                >
                  <ListItemIcon>
                    <Avatar image={image} alt={title} />
                  </ListItemIcon>
                  <Typography noWrap>{title}</Typography>
                </MenuItem>
              );
            })}
          </MenuList>
        )}
      </FormControl>
    </>
  );
};

SelectGroups.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      title: PropTypes.string,
      id: PropTypes.string,
    })
  ),
  onGroupChange: PropTypes.func,
  defaultGroup: PropTypes.object,
  showHelperText: PropTypes.bool,
};

SelectGroups.defaultProps = {
  value: '',
  onChange: () => {},
  groups: [],
  onGroupChange: () => {},
  showHelperText: true,
};

export default SelectGroups;
