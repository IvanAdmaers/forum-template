import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Grid, Paper, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import GroupHeader from './GroupHeader';
import GroupActionsButton from './GroupActionButton';
import PostsList from 'components/PostsList';
import Verification from 'components/Verification';
import BanAction from 'components/BanAction';

import withNeedAuth from 'hoc/withNeedAuth';

import {
  groupAction,
  checkIsMember,
  setGroupVerification,
} from 'actions/groupActions';

import { USER_BOSS_ROLE } from 'constants/user';

const Group = ({ popupElement, openPopup }) => {
  const [postsUrl, setPostsUrl] = useState('');
  const [didMount, setDidMount] = useState(null);

  const isLoggedIn = useSelector(({ user }) => user.isLoggedIn);
  const group = useSelector(({ group }) => group);
  const currentUserRoles = useSelector(({ user }) => user?.user?.roles);

  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!router.isReady || postsUrl) return;

    const { slug } = router.query;

    const url = `/group/${slug}/posts`;

    setPostsUrl(url);
  }, [postsUrl, router]);

  const { id, slug, title, image, membersCount, description, verification, ban } =
    group.data || {};
  const { isMember = null } = group.user || {};
  const { status: banStatus } = ban || {};

  const { status } = verification || {};

  const [member, setMember] = useState(isMember);

  const allowVerificationAction =
    currentUserRoles && currentUserRoles.includes(USER_BOSS_ROLE);

  // Verification handler
  const handleVerificationChange = useCallback(
    (status) => {
      setTimeout(() => {
        return dispatch(setGroupVerification(status));
      }, 0);
    },
    [dispatch]
  );

  // Did mount
  useEffect(() => {
    if (didMount) return;

    setDidMount(true);
  }, [didMount]);

  // Check is user group member
  useEffect(() => {
    if (!didMount || group.member) return;

    const { slug } = router.query;

    dispatch(checkIsMember(slug));
  }, [didMount, group.member, router.query, dispatch]);

  // isMember useEffect
  useEffect(() => {
    setMember(isMember);
  }, [isMember]);

  const handleGroupAction = ({ currentTarget }) => {
    const { action } = currentTarget.dataset;

    // Check user auth
    if (!isLoggedIn) {
      return openPopup();
    }

    const { slug } = router.query;

    // Join to group
    if (action === 'join') {
      setMember(true);

      return dispatch(groupAction('join', slug));
    }

    // Unjoin
    setMember(false);

    return dispatch(groupAction('unjoin', slug));
  };

  if (!group.loading && !group.error && !group.data) {
    return <div>Loading</div>;
  }

  if (group.error) {
    return <div>Error: {group.error}</div>;
  }

  return (
    <Paper>
      {popupElement}
      <GroupHeader
        image={image}
        slug={slug}
        title={title}
        description={description}
        membersCount={membersCount}
        verification={status}
        hasBan={banStatus}
      />
      <Box sx={{ mb: 1, textAlign: 'center' }}>
        {member !== null && (
          <GroupActionsButton member={member} onAction={handleGroupAction} />
        )}
      </Box>
      {allowVerificationAction && (
        <Grid container justifyContent="center">
          <Box mb={1}>
            <Verification
              verification={status}
              type="group"
              id={id}
              onChange={handleVerificationChange}
            />
          </Box>
        </Grid>
      )}
      {allowVerificationAction && !banStatus && (
        <Grid container justifyContent="center">
          <Box mb={1}>
            <BanAction type="group" id={id} />
          </Box>
        </Grid>
      )}
      <div>
        <PostsList url={postsUrl} showCreatePostButton={isLoggedIn} />
      </div>
    </Paper>
  );
};

Group.propTypes = {
  popupElement: PropTypes.element,
  openPopup: PropTypes.func,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentPage: PropTypes.number.isRequired,
  numberOfPages: PropTypes.number.isRequired,
};

export default withNeedAuth(Group);
