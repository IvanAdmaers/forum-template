import CreateGroup from 'components/pages/CreateGroup';

import withAuth from 'hoc/withAuth';

const CreateGroupPage = () => {
  return <CreateGroup />;
};

export default withAuth(CreateGroupPage);
