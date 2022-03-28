import MyHead from 'components/MyHead';
import PostAction from 'components/pages/PostAction';

import withAuth from 'hoc/withAuth';

const SubmitPage = () => {
  const title = 'Create post';

  return (
    <>
      <MyHead title={title} noIndex />
      <PostAction action="create" />
    </>
  );
};

export default withAuth(SubmitPage);
