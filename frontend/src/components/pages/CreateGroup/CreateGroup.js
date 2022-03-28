import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Grid,
  Paper,
  Typography,
  FormControl,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import { Check as CheckIcon, Error as ErrorIcon } from '@mui/icons-material';
import isBase64 from 'is-base64';
import { useDebouncedCallback } from 'use-debounce';

import ChipInput from 'components/ChipInput';
import { Avatar } from 'components/UserUI';

import { useNotifications, useFetch } from 'hooks';

import { fileToBase64 } from 'utills';

const CreateGroup = () => {
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [isUrlAvailable, setIsUrlAvailable] = useState(null);
  const [name, setName] = useState('');
  const [cheaps, setCheaps] = useState([]);
  const [description, setDescription] = useState('');
  const [isNSFW, setIsNSFW] = useState(false);

  const router = useRouter();

  const staticGroupImagePreviewUrl = '/images/group/group-example.jpeg';

  const [
    { error: createError, response: createResponse, isLoading: createLoading },
    doCreateFetch,
  ] = useFetch('/group');

  const [
    { error: imageError, response: imageResponse, isLoading: imageLoading },
    doImageFetch,
  ] = useFetch('/image');

  const [
    {
      error: urlAvailableError,
      response: urlAvailableResponse,
      isLoading: urlAvailableIsLoading,
    },
    doUrlAvailableFetch,
  ] = useFetch('/group/url/available');

  const inputRef = useRef();

  const notification = useNotifications();

  const handlePhotoChange = async ({ target }) => {
    const file = target.files[0];

    try {
      const base64 = await fileToBase64(file);

      setImage(base64);
      notification('Image uploaded', 'success');
    } catch (e) {
      console.log(e);
      notification('Image upload error', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) return notification('Name the group', 'error');

    if (!url || !isUrlAvailable)
      return notification('Create a group url', 'error');

    if (!cheaps || cheaps.length < 1)
      return notification('Please enter at least 1 tag', 'error');

    if (image) {
      const body = new FormData();

      body.append('image', inputRef.current.files[0]);

      const headers = { 'Content-Type': null };

      return doImageFetch({ headers, body });
    }

    return createGroup();
  };

  const createGroup = useCallback(async () => {
    try {
      const group = {
        title: name,
        url,
        tags: cheaps,
        description,
        isNSFW,
      };

      console.log(image);
      if (image) {
        group.image = image;
      }

      doCreateFetch({ body: { group } });
    } catch (e) {
      console.log(e);
    }
  }, [cheaps, url, description, doCreateFetch, image, isNSFW, name]);

  useEffect(() => {
    if (!imageResponse || imageLoading) {
      return;
    }

    setImage(imageResponse.file.url);

    if (isBase64(image, { allowEmpty: false, allowMime: true })) {
      return;
    }

    createGroup();
  }, [imageResponse, imageLoading, createGroup, image]);

  useEffect(() => {
    if (!createResponse) return;

    notification('The group was created', 'success');

    router.push(`/group/${createResponse.url}`);
  }, [createResponse, notification, router]);

  // Check url available
  const checkUrlAvaibableDebounced = useDebouncedCallback(() => {
    const method = 'POST';

    const body = { group: { url } };

    return doUrlAvailableFetch({ method, body });
  }, 1000);

  // Url available error
  useEffect(() => {
    if (!urlAvailableError) return;

    notification(urlAvailableError, 'error');
    setIsUrlAvailable(false);
  }, [urlAvailableError, notification]);

  // Url available response
  useEffect(() => {
    if (!urlAvailableResponse) return;

    setIsUrlAvailable(true);
  }, [urlAvailableResponse]);

  const handleFieldChange = (e) => {
    // If cheap input
    if (Array.isArray(e)) return setCheaps(e);

    const { value } = e.target;

    switch (e.target.dataset.field) {
      case 'name':
        return setName(value);

      case 'description':
        return setDescription(value);

      case 'NSFW':
        return setIsNSFW((prevState) => !prevState);

      case 'url':
        checkUrlAvaibableDebounced();
        return setUrl(value.trim().toLowerCase());

      default:
        return null;
    }
  };

  const groupImage = !image ? staticGroupImagePreviewUrl : image;

  const urlAvailableElement = urlAvailableIsLoading ? (
    <CircularProgress size="1rem" />
  ) : isUrlAvailable === true ? (
    <CheckIcon style={{ color: '#2ecc71' }} />
  ) : isUrlAvailable === false ? (
    <ErrorIcon color="error" />
  ) : null;

  return (
    <Paper>
      <Typography align="center" variant="h6" component="h1">
        Create a Community
      </Typography>
      {name && (
        <Typography noWrap align="center" variant="h6" component="h2">
          {name}
        </Typography>
      )}
      <Container
        component="form"
        onSubmit={handleSubmit}
        maxWidth="xs"
        sx={{
          p: 1,
          mx: 'auto',
          my: '0',
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{
            mx: 'auto',
            my: 0.5,
          }}
        >
            <Avatar
              width={130}
              height={130}
              image={groupImage}
              alt="group preview"
            />
          <Grid item>
            <div>
              <input
                ref={inputRef}
                accept="image/*"
                id="contained-button-file-group"
                type="file"
                hidden
                onChange={handlePhotoChange}
              />
              <label htmlFor="contained-button-file-group">
                <Button
                  disabled={imageLoading}
                  component="span"
                  variant="contained"
                >
                  Edit photo
                </Button>
              </label>
            </div>
          </Grid>
        </Grid>
        <FormControl fullWidth>
          <TextField
            inputProps={{ 'data-field': 'name' }}
            onChange={handleFieldChange}
            label="Name"
            helperText="The name cannot be changed after creation"
            value={name}
            variant="standard"
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            inputProps={{ 'data-field': 'url' }}
            onChange={handleFieldChange}
            label="Url"
            helperText="Url will be impossible to change after creation"
            value={url}
            InputProps={{
              endAdornment: urlAvailableElement,
            }}
            variant="standard"
          />
        </FormControl>
        <FormControl fullWidth>
          <ChipInput
            value={cheaps}
            onChange={handleFieldChange}
            label="Group tags"
            placeholder="Tags separated by commas"
            newChipKeys={[',']}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            inputProps={{ 'data-field': 'description' }}
            onChange={handleFieldChange}
            label="Description"
            helperText="Group description"
            value={description}
            variant="standard"
          />
        </FormControl>
        <FormControl fullWidth>
          <FormControlLabel
            control={
              <Checkbox
                inputProps={{ 'data-field': 'NSFW' }}
                checked={isNSFW}
                onChange={handleFieldChange}
              />
            }
            label="NSFW content"
          />
        </FormControl>
        <Button
          disabled={imageLoading || createLoading}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Create
        </Button>
        {imageError ||
          (createError && (
            <Typography variant="body2" color="error">
              {imageError || createError}
            </Typography>
          ))}
      </Container>
    </Paper>
  );
};

export default CreateGroup;
