import MyHead from 'components/MyHead';
import Chats from 'components/pages/Chats';

import withAuth from 'hoc/withAuth';

const ChatsPage = () => {
  return (
    <>
      <MyHead title="Chats" noIndex />
      <Chats />
    </>
  );
};

export default withAuth(ChatsPage);
