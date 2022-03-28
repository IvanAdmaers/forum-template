import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import MyHead from 'components/MyHead';
import Group from 'components/pages/Group';

import { getGroupData } from 'actions/groupActions';

import { wrapper } from 'store';

import { getGroupPosts } from 'api';

import { getTitle, getGroupDescription } from 'utills';

const GroupPage = ({ posts, currentPage, numberOfPages }) => {
  const group = useSelector(({ group }) => group);

  const { title, description, membersCount } = group.data || {};

  const groupTitle = getTitle(title);
  const groupDescription = getGroupDescription(
    title,
    description || null,
    membersCount
  );

  return (
    <>
      <MyHead title={groupTitle} description={groupDescription} />
      <Group
        posts={posts}
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    </>
  );
};

GroupPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  currentPage: PropTypes.number.isRequired,
  numberOfPages: PropTypes.number.isRequired,
};

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps = wrapper.getStaticProps(
  async ({ params, store }) => {
    try {
      const { slug } = params;

      await store.dispatch(getGroupData(slug));

      const hasError = store.getState().group.error;

      if (hasError) {
        return {
          notFound: true,
        };
      }

      // Get group posts
      const { posts, currentPage, numberOfPages } = await getGroupPosts(slug);

      return {
        props: { posts, currentPage, numberOfPages },
        revalidate: 1,
      };
    } catch (e) {
      console.log(e);
    }
  }
);

export default GroupPage;
