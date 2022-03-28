import PropTypes from 'prop-types';

import MyHead from 'components/MyHead';

import { getTitle, getSiteName } from 'utills';

import Policy from 'components/pages/Policy';

const siteName = getSiteName();

const UserAgreementPage = ({ markdown }) => {
  const title = getTitle(`Terms of use ${siteName}`);
  const description = 'Your description is here';

  return (
    <>
      <MyHead title={title} description={description} />
      <Policy markdown={markdown} />
    </>
  );
};

UserAgreementPage.propTypes = {
  markdown: PropTypes.string.isRequired,
};

export const getStaticProps = async () => {
  const { getPolicyMarkdown } = require('utills/node');

  const markdown = await getPolicyMarkdown('userAgreement.md');

  return { props: { markdown } };
};

export default UserAgreementPage;
