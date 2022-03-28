import { useEffect, useState } from 'react';
import { Grid, Paper, Hidden } from '@mui/material';
import { useSelector } from 'react-redux';

import Sidebar from 'components/Sidebar';
import PostsList from 'components/PostsList';

import { useFetch, useNotifications } from 'hooks';

const MainPage = () => {
  const [topGroupsList, setTopGroupsList] = useState([]);

  const isUserLoggedIn = useSelector(({ user }) => user.isLoggedIn);
  const footerItems = useSelector(({ footer }) => footer.items);

  const [
    { error: topGroupsError, response: topGroupsResponse },
    doTopGroupsFetch,
  ] = useFetch('/group/top?limit=3');

  const notification = useNotifications();

  // Top groups
  useEffect(() => {
    const method = 'GET';

    doTopGroupsFetch({ method });
  }, [doTopGroupsFetch]);

  useEffect(() => {
    if (!topGroupsError) return;

    notification(topGroupsError, 'error');
  }, [topGroupsError, notification]);

  useEffect(() => {
    if (!topGroupsResponse) return;

    const groups = topGroupsResponse.groups.map(({ slug, title }) => ({
      link: `/group/${slug}`,
      title,
    }));

    const groupsList = groups.length ? groups : null;

    setTopGroupsList(groupsList);
  }, [topGroupsResponse]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper>
            <main>
              <PostsList
                url="/post/list"
                showCreatePostButton={isUserLoggedIn}
              />
            </main>
          </Paper>
        </Grid>
        <Hidden mdDown>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ height: 'max-content', position: 'sticky', top: 0 }}
          >
            <aside>
              <Sidebar footerList={footerItems} topGroupsList={topGroupsList} />
            </aside>
          </Grid>
        </Hidden>
      </Grid>
    </>
  );
};

export default MainPage;
