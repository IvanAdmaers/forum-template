import MyHead from 'components/MyHead';
import PremiumUsernames from 'components/pages/PremiumUsernames';

import withAuth from 'hoc/withAuth';

import { USER_BOSS_ROLE } from 'constants/user';

import { getTitle } from 'utills';

const PremiumUsernamesPage = () => {
  const title = getTitle('Premium usernames');

  return (
    <>
      <MyHead title={title} />
      <PremiumUsernames />
    </>
  );
};

export default withAuth(PremiumUsernamesPage, [USER_BOSS_ROLE]);
