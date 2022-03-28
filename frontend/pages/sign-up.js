import MyHead from 'components/MyHead';
import Authentication from 'components/pages/Authentication';

import { getTitle } from 'utills';

const SignUpPage = () => {
  const title = getTitle('Sign up');
  const description = 'Your description is here';

  return (
    <>
      <MyHead title={title} description={description} />
      <Authentication isLogIn={false} />
    </>
  );
};

export default SignUpPage;
