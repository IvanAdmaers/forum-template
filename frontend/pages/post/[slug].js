import { useSelector } from 'react-redux';

import MyHead from 'components/MyHead';
import PostPageComponent from 'components/pages/PostPage';
import { wrapper } from 'store';

import { getPost } from 'actions/postActions';

import { getTitle, getPostDescription } from 'utills';

const PostPage = () => {
  const post = useSelector(({ post }) => post);

  const { title, commentsCount } = post.data || {};
  const groupTitle = post.group?.title || null;
  const rating = post.rating;

  const postTitle = getTitle(title);
  const postDescription = getPostDescription(
    title,
    commentsCount,
    rating,
    groupTitle
  );

  return (
    <>
      <MyHead title={postTitle} description={postDescription} />
      <PostPageComponent />
    </>
  );
};

export const getStaticPaths = async () => {
  try {
    const paths = [];

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (e) {
    console.log(e);
  }
};

export const getStaticProps = wrapper.getStaticProps(
  async ({ params, store }) => {
    try {
      const { slug } = params;
      const { dispatch, getState } = store;

      await dispatch(getPost(slug));

      const hasError = getState().post.error;

      if (hasError) {
        return {
          notFound: true,
        };
      }

      return {
        props: {},
        revalidate: 1,
      };
    } catch (e) {
      console.log(e);
    }
  }
);

export default PostPage;
