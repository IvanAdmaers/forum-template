import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Box,
} from '@mui/material';
import { Help as HelpIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { useSave, useSetData } from 'components/Editor/hooks';

import SelectGroups from './SelectGroups';

import { searchUserGroups } from 'api';

import { useNotifications, useFetch } from 'hooks';

const Editor = dynamic(() => import('components/Editor'), { ssr: false });

const getUserProfile = (image = '', username = '', id = '') => ({
  image: image || 'https://www.redditstatic.com/mweb2x/img/snoo-64.png',
  title: `user/${username}`,
  id: id || '1',
});

const BoxWithMarginBottom = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const PostAction = ({ action }) => {
  const [didMount, setDidMount] = useState(false);
  const [editor, setEditor] = useState(null);
  const [postInfo, setPostInfo] = useState({
    group: { id: '', title: '' },
    title: '',
    body: '',
    isNSFW: false,
    sendReplies: true,
    isOriginalContent: false,
  });
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchGroupValue, setSearchGroupValue] = useState('');

  const [defaultGroup, setDefaultGroup] = useState(null);

  const user = useSelector(({ user }) => user);

  const { username, image: userImage } = user.user;

  const userProfile = getUserProfile(userImage, username);

  const [groups, setGroups] = useState([userProfile]);

  const notification = useNotifications();

  const router = useRouter();

  const onSave = useSave(editor);
  useSetData(editor, postInfo.body);

  const isEditMode = action === 'edit';

  // Router redirecting detection
  useEffect(() => {
    const handleStartRedirecting = () => setLoading(true);
    const handleEndRedirecting = () => setLoading(false);

    router.events.on('routeChangeStart', handleStartRedirecting);
    router.events.on('routeChangeComplete', handleEndRedirecting);
    router.events.on('routeChangeError', handleEndRedirecting);

    return () => {
      router.events.off('routeChangeStart', handleStartRedirecting);
      router.events.off('routeChangeComplete', handleEndRedirecting);
      router.events.off('routeChangeError', handleEndRedirecting);
    };
  }, [router]);

  // Get post data
  const [{ error: getPostError, response: getPostResponse }, doGetPostFetch] =
    useFetch(`/post/${router.query.slug}`);

  // Create post
  const [
    {
      error: createPostError,
      loading: createPostLoading,
      response: createPostResponse,
    },
    doCreatePostFetch,
  ] = useFetch('/post');

  // Edit post
  const [
    {
      error: editPostError,
      loading: editPostLoading,
      response: editPostResponse,
    },
    doEditPostFetch,
  ] = useFetch(`/post/${router.query.slug}`);

  // Fetch error
  useEffect(() => {
    if (!createPostError && !editPostError) return;

    notification(createPostError || editPostError, 'error');
  }, [createPostError, editPostError, notification]);

  // Fetch success
  useEffect(() => {
    if (!createPostResponse && !editPostResponse) return;

    const { url } = createPostResponse || editPostResponse;

    const text = createPostResponse
      ? 'Post successfully created'
      : 'Post successfully edited';

    notification(text, 'success');

    const postURL = `/post/${url}`;

    const pushURL = !editPostResponse ? postURL : `${postURL}?edited=true`;

    router.push(pushURL);
  }, [createPostResponse, editPostResponse, notification, router]);

  // Get post error
  useEffect(() => {
    if (!getPostError) return;

    notification(getPostError, 'error');
  }, [getPostError, notification]);

  // Get post fetch response
  useEffect(() => {
    if (!getPostResponse) return;

    const { author, group, post } = getPostResponse;
    const { username: authorUsername } = author;
    const { title, body, isNSFW, sendReplies, isOriginalContent } = post;

    // Check if user the owner of the post
    // if (authorUsername !== username) {
    //   return router.push(`/post/${slug}`);
    // }

    // 1. Set post group or user profile
    if (author && !group) {
      const userProfile = getUserProfile(userImage, authorUsername);
      setDefaultGroup(userProfile);
    }

    if (group) {
      const defaultGroup = {
        id: group.id,
        title: `group/${group.title}`,
      };

      setDefaultGroup(defaultGroup);
    }

    // 2. Set post data
    setPostInfo((prevState) => ({
      ...prevState,
      title,
      body,
      isNSFW,
      sendReplies: sendReplies || false,
      isOriginalContent,
    }));
  }, [getPostResponse, router, username, userImage]);

  // Debounce callback. Search after time
  const debouncedSearchGroups = useDebouncedCallback(async () => {
    try {
      if (!searchGroupValue) return;

      setLoading(true);

      const { groups } = await searchUserGroups(searchGroupValue);

      if (!groups.length) {
        return setGroups([userProfile]);
      }

      const groupsList = groups.map(({ id, image, title }) => ({
        id,
        image,
        title: `group/${title}`,
      }));

      setGroups(groupsList);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, 500);

  // onChange SelectGroups component
  const handleChangeGroupsSearch = ({ target }) => {
    const { value } = target;

    setSearchGroupValue(value);
    debouncedSearchGroups();
  };

  const handleGroupChange = (id = '', title = '') => {
    setPostInfo((prevState) => ({ ...prevState, group: { id, title } }));
  };

  const handleInputChange = ({ target }) => {
    const field = target.dataset.name;

    const isCheckbox = target.type === 'checkbox';
    const value = isCheckbox ? target.checked : target.value;

    setPostInfo((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = await onSave();

    setPostInfo((prevState) => ({ ...prevState, body }));

    setSubmit(true);
  };

  // Post action fetch
  useEffect(() => {
    if (!submit) return;

    setLoading(false);
    setSubmit(false);

    const { group, title, body } = postInfo;

    // Check group choosen
    if (group.id === '' || !group.title) {
      return notification('Choose a group', 'error');
    }

    if (!title) {
      return notification('Enter post title', 'error');
    }

    if (!body.blocks.length) {
      return notification('Fill in the content of the post', 'error');
    }

    const method = action === 'create' ? 'POST' : 'PUT';
    const postBody = { post: { ...postInfo, groupId: postInfo.group.id } };

    // Create post
    if (action === 'create') {
      console.log('create post');
      return doCreatePostFetch({ method, body: postBody });
    }

    // Edit post
    console.log('edit post');
    return doEditPostFetch({ method, body: postBody });
  }, [
    submit,
    postInfo,
    notification,
    action,
    doCreatePostFetch,
    doEditPostFetch,
  ]);

  useEffect(() => {
    if (didMount || !router.isReady) return;

    setDidMount(true);

    if (action !== 'edit') return;

    doGetPostFetch({ method: 'GET' });
  }, [didMount, router, doGetPostFetch, action]);

  const titleText = action === 'create' ? 'Create' : 'Edit';

  return (
    <Container maxWidth="sm" component={Paper}>
      <Typography align="center" component="h1" variant="h6">
        {`${titleText} post`}
      </Typography>
      <Divider light />
      <Box component="form" onSubmit={handleSubmit} sx={{ py: 1, px: 0.5 }}>
        <SelectGroups
          value={searchGroupValue}
          onChange={handleChangeGroupsSearch}
          groups={groups}
          onGroupChange={handleGroupChange}
          defaultGroup={defaultGroup}
          showHelperText={!isEditMode}
        />
        <TextField
          fullWidth
          autoComplete="off"
          id="post-title"
          label="Post title"
          inputProps={{ 'data-name': 'title' }}
          value={postInfo.title}
          onChange={handleInputChange}
          variant="standard"
        />
        <BoxWithMarginBottom />
        <div>
          <Editor mode="post" setEditorRef={setEditor} />
        </div>
        <BoxWithMarginBottom />
        <Grid container alignItems="center">
          <FormControlLabel
            control={
              <Checkbox
                checked={postInfo.isNSFW}
                inputProps={{ 'data-name': 'isNSFW' }}
                onChange={handleInputChange}
              />
            }
            label="NSFW content"
          />
          <Tooltip
            enterTouchDelay={0}
            title="NSFW content is content that should not be opened in front of others"
          >
            <HelpIcon fontSize="small" />
          </Tooltip>
        </Grid>
        <Grid container alignItems="center">
          <FormControlLabel
            control={
              <Checkbox
                checked={postInfo.isOriginalContent}
                inputProps={{ 'data-name': 'isOriginalContent' }}
                onChange={handleInputChange}
              />
            }
            label="Original content"
          />
          <Tooltip
            enterTouchDelay={0}
            title="Mark a post as containing original content"
          >
            <HelpIcon fontSize="small" />
          </Tooltip>
        </Grid>
        <Button
          disabled={loading || createPostLoading || editPostLoading}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Send
        </Button>
      </Box>
    </Container>
  );
};

PostAction.propTypes = {
  action: PropTypes.oneOf(['create', 'edit']).isRequired,
};

export default PostAction;
