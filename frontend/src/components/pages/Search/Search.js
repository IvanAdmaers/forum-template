import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Paper,
  Typography,
  Tabs,
  Tab,
  Pagination,
  Grid,
  Box,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import EmptyQuery from './EmptyQuery';
import Loading from './Loading';
import TabPanel from './TabPanel';
import Item from './Item';

import { fetchSearchData } from 'actions/searchActions';

const a11yProps = (index) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

const tabs = {
  posts: 0,
  groups: 1,
  users: 2,
};

const findKeyByValue = (param) => {
  const entries = Object.entries(tabs);

  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];

    if (value === param) {
      return key;
    }
  }

  return null;
};

const TabContent = ({ type, error, loading, items }) => {
  const getLink = (param = '') =>
    `/${type.substring(0, type.length - 1)}/${param}`;

  if (error) {
    return <Typography color="error">{!error ? 'Error' : error}</Typography>;
  }

  if (loading) {
    return <Loading />;
  }

  if (!items.length) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        <Typography>Couldn't find anything</Typography>
      </Box>
    );
  }

  const itemsElement = items.map((item) => {
    const { id, title, username, slug, image } = item;

    const key = `search-item-${id}`;

    const itemTitle = title || username;

    const itemLink = slug || username;

    const link = getLink(itemLink);

    return <Item key={key} image={image} title={itemTitle} link={link} />;
  });

  return <Box sx={{ minHeight: '100vh' }}>{itemsElement}</Box>;
};

const Search = () => {
  const [didMount, setDidMount] = useState(false);
  const [value, setValue] = useState(-1);
  const { error, loading, data, currentPage, numberOfPages } = useSelector(
    (state) => state.search
  );

  const dispatch = useDispatch();

  const router = useRouter();

  const handleChange = (e, newValue) => {
    const url = findKeyByValue(newValue);

    setValue(newValue);

    router.query.tab = encodeURI(url);
    router.push(router);
  };

  useEffect(() => {
    if (didMount) return;

    if (router.isReady) {
      setDidMount(true);
    }
  }, [didMount, router]);

  // Set default tab and replace unknown tab type
  useEffect(() => {
    if (!didMount) return;

    if (!Object.keys(router.query).length) return;

    const { tab } = router.query;

    const tabsKeys = Object.keys(tabs);

    // Check if tab is supported
    if (tab) {
      const isSupported = tabsKeys.includes(tab);

      if (isSupported) return;
    }

    const firstTab = tabsKeys[0];

    router.query.tab = encodeURI(firstTab);

    router.push(router);
  }, [router, didMount]);

  // Set tab value once (important once)
  useEffect(() => {
    if (!didMount || value !== -1) return;

    const { tab } = router.query;

    if (!tab) return;

    const tabNumber = tabs[tab];

    setValue(tabNumber);
  }, [didMount, router.query, value]);

  // Fetch data
  useEffect(() => {
    const q = router.query?.q;
    const tab = router.query?.tab;
    const page = router.query?.page || 1;

    if (!q || !tab || !didMount || value === -1) return;

    const searchQuery = decodeURI(q);
    const tabKey = findKeyByValue(value);

    console.log('fetch data by query', searchQuery, 'and tab', tabKey);

    // if (tabKey === 'groups') {
    //   console.log('tab === \'groups\'');
    //   dispatch(fetchSearchData('groups', searchQuery, tabKey, page));

    //   return null;
    // }

    dispatch(fetchSearchData(tabKey, searchQuery, page));
  }, [
    router.query?.q,
    router.query?.tab,
    router.query?.page,
    dispatch,
    value,
    didMount,
  ]);

  const handleChangePage = (event, page) => {
    router.query.page = page;

    router.push(router);
  };

  const { q } = router.query;

  // Did mount loading indicator
  if (!didMount || (q && value === -1)) {
    return <Loading />;
  }

  // Empty query indicator
  if (!q) {
    return <EmptyQuery />;
  }

  return (
    <Paper>
      <Typography component="h1" variant="h6" align="center" gutterBottom>
        &#128270; Search by query: {decodeURI(q)} &#128269;
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="tabs">
          <Tab label="Posts" data-url="posts" {...a11yProps(0)} />
          <Tab label="Groups" data-url="groups" {...a11yProps(1)} />
          <Tab label="Users" ata-url="users" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TabContent
          type={findKeyByValue(0)}
          error={error}
          loading={loading}
          items={data}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TabContent
          type={findKeyByValue(1)}
          error={error}
          loading={loading}
          items={data}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <TabContent
          type={findKeyByValue(2)}
          error={error}
          loading={loading}
          items={data}
        />
      </TabPanel>
      {Boolean(numberOfPages) && (
        <Grid container justifyContent="center">
          <Pagination
            disabled={loading}
            count={numberOfPages}
            page={currentPage}
            onChange={handleChangePage}
          />
        </Grid>
      )}
    </Paper>
  );
};

TabContent.propTypes = {
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
};

TabContent.defaultProps = {
  error: null,
  items: [],
};

export default Search;
