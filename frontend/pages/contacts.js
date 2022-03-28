import Contacts from 'components/pages/Contacts';

import MyHead from 'components/MyHead';

import { getTitle } from 'utills';

const ContactsPage = () => {
  const title = getTitle('Contacts');
  const description =
    'Your descruption is here';

  return (
    <>
      <MyHead title={title} description={description} />
      <Contacts />
    </>
  );
};

export default ContactsPage;
