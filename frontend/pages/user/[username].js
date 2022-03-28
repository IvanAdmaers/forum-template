import MyHead from 'components/MyHead';
import PropTypes from 'prop-types';

import UserProfile from 'components/pages/UserProfile';

import { getUserData } from 'api';

import { getTitle } from 'utills';

const UserPage = ({ user }) => {
  const { username } = user;

  const title = getTitle(username);
  const description = 'Your description is here';

  return (
    <>
      <MyHead title={title} description={description} />
      <UserProfile user={user} />
    </>
  );
};

UserPage.propTypes = {
  user: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.object])
  ).isRequired,
};

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps = async (ctx) => {
  try {
    const { username } = ctx.params;
    
    const userData = await getUserData(username);
    
    if (userData.error) {
      return {
        notFound: true,
      };
    }

    const { user } = userData;

    return {
      props: { user },
      revalidate: 1,
    };
  } catch (e) {
    console.log(e);
  }
};

export default UserPage;
