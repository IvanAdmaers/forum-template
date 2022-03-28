import MyHead from 'components/MyHead';
import Moderation from 'components/pages/Moderation';

import withAuth from 'hoc/withAuth';

import { USER_MODERATOR_ROLE } from 'constants/user';

import { getTitle } from 'utills';

const ModerationPage = () => {
  const title = getTitle('Comments moderation');

  return (
    <>
      <MyHead title={title} noIndex />
      <Moderation type="comments" />
    </>
  );
};

export default withAuth(ModerationPage, [USER_MODERATOR_ROLE]);
