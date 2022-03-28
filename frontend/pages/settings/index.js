import MyHead from 'components/MyHead';
import Settings from 'components/pages/Settings';

import withAuth from 'hoc/withAuth';

import { getTitle } from 'utills';

const SettingsPage = () => {
  const title = getTitle('Account settings');

  return (
    <>
      <MyHead title={title} noIndex />
      <Settings />
    </>
  );
};

export default withAuth(SettingsPage);
