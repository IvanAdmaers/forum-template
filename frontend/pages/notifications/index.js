import MyHead from 'components/MyHead';
import Notifications from 'components/pages/Notifications';

import withAuth from 'hoc/withAuth';

const NotificationsPage = () => (
  <>
    <MyHead title="Notifications" noIndex />
    <Notifications />
  </>
);

export default withAuth(NotificationsPage);
