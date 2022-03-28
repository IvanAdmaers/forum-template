import MyHead from 'components/MyHead';
import PostAction from 'components/pages/PostAction';

import withAuth from 'hoc/withAuth';

const SubmitPage = () => {
  const title = 'Post editing';

  return (
    <>
      <MyHead title={title} noIndex />
      <PostAction action="edit" />
    </>
  );
};

export default withAuth(SubmitPage);
