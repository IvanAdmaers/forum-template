import { useSelector } from 'react-redux';

import Loading from './Loading';
import NeedAuth from './NeedAuth';

const withAuth = (WrappedComponent, requiredRoles = []) => {
  const WithAuthComponent = (props) => {
    const user = useSelector(({ user }) => user);

    const { loading, isLoggedIn, user: userData } = user;
    const { roles } = userData || {};

    if (loading) {
      return <Loading />;
    }

    if (isLoggedIn === false) {
      return <NeedAuth />;
    }

    if (requiredRoles) {
      const every = requiredRoles.every((role) => roles.includes(role));

      if (!every) {
        return <div>You have no access to this page</div>;
      }
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
