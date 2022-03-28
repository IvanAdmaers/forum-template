import MyHead from 'components/MyHead';
import ResetPassword from 'components/pages/ResetPassword';

import { getTitle } from 'utills';

const ResetPasswordPage = () => {
  const title = getTitle('Password recovery');

  return (
    <>
      <MyHead title={title} noIndex />
      <ResetPassword type="reset" />
    </>
  );
};

export default ResetPasswordPage;
