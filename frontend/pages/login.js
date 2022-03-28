import MyHead from 'components/MyHead';
import Authentication from 'components/pages/Authentication';

import { getTitle } from 'utills';

const LoginPage = () => {
  const title = getTitle('Login');
  const description = 'Your description is here';

  return (
    <>
    <MyHead title={title} description={description} />
    <Authentication isLogIn={true} />
    </>
  );
};

export default LoginPage;
