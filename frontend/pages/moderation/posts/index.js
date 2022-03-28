import MyHead from 'components/MyHead';
import Moderation from 'components/pages/Moderation';

import withAuth from 'hoc/withAuth';

import { USER_MODERATOR_ROLE } from 'constants/user';

import { getTitle } from 'utills';

const ModerationPage = () => {
  const title = getTitle('Posts moderation');

  return (
    <>
      <MyHead title={title} />
      <Moderation type="posts" />
    </>
  );
};

export default withAuth(ModerationPage, [USER_MODERATOR_ROLE]);
