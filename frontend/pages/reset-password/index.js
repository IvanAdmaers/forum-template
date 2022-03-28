import MyHead from 'components/MyHead';
import ResetPassword from 'components/pages/ResetPassword';

import { getTitle } from 'utills';

const ResetPasswordRequestPage = () => {
  const title = getTitle('Password recovery');
  const description = 'Your description is here';

  return (
    <>
      <MyHead title={title} description={description} />
      <ResetPassword type="request" />
    </>
  );
};

export default ResetPasswordRequestPage;
