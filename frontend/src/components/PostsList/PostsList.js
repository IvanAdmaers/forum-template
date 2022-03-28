import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';

import PostItem from 'components/PostItem';
import LastPostsElement from 'components/LastPostsElement';

import { useFetch, useNotifications, useObserver } from 'hooks';

const PostsList = ({ url, limit: reqLimit, showCreatePostButton }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(null);

  const notification = useNotifications();

  const limit = reqLimit;

  // Fetch
  const [{ error, isLoading, response }, doFetch] = useFetch(
    `${url}?page=${page}&limit=${limit}`
  );

  useEffect(() => {
    if (!url) return;

    const method = 'GET';

    doFetch({ method });
  }, [url, doFetch]);

  useEffect(() => {
    if (!error) return;

    notification(error, 'error');
  }, [error, notification]);

  useEffect(() => {
    if (!response) return;

    const { posts, currentPage, numberOfPages } = response;

    setPosts((prevState) => [...prevState, ...posts]);
    setPage(currentPage);
    setPages(numberOfPages);
  }, [response]);

  // Pagination
  const paginationTriggerRef = useRef();

  const makePagination = () => {
    const method = 'GET';

    setPage((prevState) => prevState + 1);
    doFetch({ method });
  };

  const observerOptions = { rootMargin: '500px' };

  // const shouldWorks = !(page >= pages) && !isLoading && didMount;
  const shouldWorks = !(page >= pages) && !isLoading;

  useObserver(
    paginationTriggerRef,
    makePagination,
    observerOptions,
    shouldWorks
  );

  // Elements
  const postsListElement = posts.map((post, index) => (
    <PostItem key={`group-post-${index}`} {...post} />
  ));

  const isLoadingIndicator = pages === null || isLoading;

  const lastElement = (
    <LastPostsElement
      ref={paginationTriggerRef}
      page={page}
      pages={pages}
      isLoading={isLoadingIndicator}
      postsLength={posts.length}
      limit={reqLimit}
      showCreatePostButton={showCreatePostButton}
    />
  );

  return (
    <div>
      {postsListElement}
      {lastElement}
    </div>
  );
};

PostsList.propTypes = {
  url: PropTypes.string.isRequired,
  limit: PropTypes.number,
  showCreatePostButton: PropTypes.bool,
};

PostsList.defaultProps = {
  limit: 10,
  showCreatePostButton: false,
};

export default PostsList;
