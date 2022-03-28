import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Popover, Grid, TextField, IconButton, Button } from '@mui/material';
import {
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  Done as DoneIcon,
} from '@mui/icons-material';

// Upload image popover
const UploadImagePopover = ({ anchor, onSubmit }) => {
  const [state, setState] = useState({
    anchor: null,
    isCancelled: false,
  });

  const [data, setData] = useState({});

  useEffect(() => {
    setState({
      anchor: anchor,
      isCancelled: false,
    });

    setData({
      file: undefined,
    });
  }, [anchor]);

  return (
    <Popover
      anchorEl={state.anchor}
      open={state.anchor !== null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      TransitionProps={{
        onExited: () => {
          onSubmit(data, !state.isCancelled);
        },
      }}
    >
      <Grid
        container
        spacing={1}
        sx={{
          padding: '10px',
          maxWidth: '350px',
        }}
      >
        <Grid item xs={10}>
          <TextField
            disabled
            value={data.file?.name || ''}
            placeholder="Attach a picture 👉"
            sx={{
              width: '100%',
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <input
            accept="image/*"
            hidden
            id="contained-button-file"
            type="file"
            onChange={(event) => {
              setData({
                ...data,
                file: event.target.files[0],
              });
            }}
          />
          <label htmlFor="contained-button-file">
            <IconButton
              color="primary"
              aria-label="upload image"
              component="span"
              size="large"
            >
              <AttachFileIcon />
            </IconButton>
          </label>
        </Grid>
        <Grid item container xs={12} justifyContent="flex-end">
          <Button
            onClick={() => {
              setState({
                anchor: null,
                isCancelled: true,
              });
            }}
          >
            <CloseIcon />
          </Button>
          <Button
            onClick={() => {
              setState({
                anchor: null,
                isCancelled: false,
              });
            }}
          >
            <DoneIcon />
          </Button>
        </Grid>
      </Grid>
    </Popover>
  );
};

UploadImagePopover.defaultProps = {
  anchor: null,
  onSubmit: () => {},
};

UploadImagePopover.propTypes = {
  // anchor: PropTypes.oneOfType([
  //   PropTypes.node,
  //   PropTypes.oneOf([null]), // doesnt work
  // ]),
  anchor: PropTypes.any, // node or null
  onSubmit: PropTypes.func,
};

export default UploadImagePopover;
