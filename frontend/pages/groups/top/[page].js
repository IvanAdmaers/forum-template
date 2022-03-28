import PropTypes from 'prop-types';

import MyHead from 'components/MyHead';
import TopGroups from 'components/pages/TopGroups';

import { getTitle, getSiteName } from 'utills';
import { getTopGroups } from 'api';

const siteName = getSiteName();

const TopGroupsPage = ({ groups, currentPage, numberOfPages }) => {
  const title = getTitle(`The best groups on ${siteName} | Page ${currentPage}`);
  const description = 'Your description is here';

  return (
    <>
      <MyHead title={title} description={description} />
      <TopGroups
        groups={groups}
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    </>
  );
};

TopGroupsPage.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.object,
        PropTypes.array,
      ])
    )
  ).isRequired,
  currentPage: PropTypes.number.isRequired,
  numberOfPages: PropTypes.number.isRequired,
};

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps = async (context) => {
  const page = +context.params.page;
  const limit = 5;

  if (isNaN(page) || page === 0) {
    return { notFound: true };
  }

  const { groups, currentPage, numberOfPages } = await getTopGroups(
    page,
    limit
  );

  if (!groups.length) {
    return { notFound: true };
  }

  return { props: { groups, currentPage, numberOfPages }, revalidate: 10 };
};

export default TopGroupsPage;
