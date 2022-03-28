import PropTypes from 'prop-types';

import MyHead from 'components/MyHead';

import { getTitle } from 'utills';

import Policy from 'components/pages/Policy';

const CookieNoticePage = ({ markdown }) => {
  const title = getTitle('Cookie Notice');
  const description = 'Your description is here';

  return (
    <>
      <MyHead title={title} description={description} />
      <Policy markdown={markdown} />
    </>
  );
};

CookieNoticePage.propTypes = {
  markdown: PropTypes.string.isRequired,
};

export const getStaticProps = async () => {
  const { getPolicyMarkdown } = require('utills/node');

  const markdown = await getPolicyMarkdown('cookieNotice.md');

  return { props: { markdown } };
};

export default CookieNoticePage;
