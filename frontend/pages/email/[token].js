import MyHead from 'components/MyHead';
import EmailConfirmation from 'components/pages/EmailConfirmation';

const EmailConfirmationPage = () => {
  const title = 'Email confirmation';

  return (
    <>
      <MyHead title={title} noIndex />
      <EmailConfirmation />
    </>
  );
};

export default EmailConfirmationPage;
