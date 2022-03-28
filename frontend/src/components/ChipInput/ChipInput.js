import PropTypes from 'prop-types';
import { useState } from 'react';
import { Chip, TextField, Autocomplete } from '@mui/material';

const isDublicate = (state = [], value = '') => state.includes(value);
const getLastSymbol = (str = '') => str.slice(-1);
const isTrigger = (triggers = [], action = '') => triggers.includes(action);

const ChipInput = ({
  defaultValue,
  value,
  options,
  freeSolo,
  multiple,
  onChange,
  label,
  placeholder,
  allowDuplicates,
  newChipKeys,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    const newInputValue = e.target.value.trim();

    const lastSymbol = getLastSymbol(newInputValue);

    const trigger = isTrigger(newChipKeys, lastSymbol);

    if (trigger) {
      const dublicate = !allowDuplicates && isDublicate(value, inputValue);

      if (dublicate) {
        return setInputValue('');
      }

      onChange([...value, inputValue]);

      return setInputValue('');
    }

    return setInputValue(newInputValue);
  };

  const handleNewChip = (e, chip) => {
    onChange(chip);

    return setInputValue('');
  };

  return (
    <Autocomplete
      multiple={multiple}
      freeSolo={freeSolo}
      options={options}
      defaultValue={defaultValue}
      value={value}
      inputValue={inputValue}
      onInput={handleInputChange}
      onChange={handleNewChip}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const key = `chip-${option}-${index}`;

          return (
            <Chip
              key={key}
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
};

ChipInput.defaultProps = {
  defaultValue: [],
  value: [],
  options: [],
  freeSolo: true,
  multiple: true,
  onChange: () => null,
  label: '',
  placeholder: '',
  allowDuplicates: false,
  newChipKeys: [],
};

ChipInput.propTypes = {
  defaultValue: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.arrayOf(PropTypes.string),
  options: PropTypes.arrayOf(PropTypes.string),
  freeSolo: PropTypes.bool,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  allowDuplicates: PropTypes.bool,
  newChipKeys: PropTypes.arrayOf(PropTypes.string),
};

export default ChipInput;
