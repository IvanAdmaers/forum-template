import MyHead from 'components/MyHead';
import GlobalChat from 'components/pages/GlobalChat';

import withAuth from 'hoc/withAuth';

import { getTitle } from 'utills';

const GlobalChatPage = () => {
  const title = getTitle('General chat');
  const description = 'Your description is here';

  return (
    <>
      <MyHead title={title} description={description} />
      <GlobalChat />
    </>
  );
};

export default withAuth(GlobalChatPage);
