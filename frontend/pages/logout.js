import MyHead from 'components/MyHead';
import Logout from 'components/pages/Logout';

const LogoutPage = () => {
  const title = 'Logout';

  return (
    <>
      <MyHead title={title} noIndex />
      <Logout />
    </>
  );
};

export default LogoutPage;
