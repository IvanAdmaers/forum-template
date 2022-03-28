import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  Paper,
  Grid,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  Divider,
} from '@mui/material';

import MyLink from 'components/MyLink';
import Item from './Item';

import { useFetch, useNotifications } from 'hooks';

const Moderation = ({ type }) => {
  const [initialized, setInitialized] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);

  const limit = 10;

  const [
    {
      error: complaintsError,
      isLoading: isComplaintsLoading,
      response: complaintsResponse,
    },
    doComplaintsFetch,
  ] = useFetch(`/complaint?page=${page}&limit=${limit}`);

  const [
    {
      error: decisionError,
      isLoading: isDecisionLoading,
      response: decisionResponse,
    },
    doDecisionFetch,
  ] = useFetch('/complaint');

  const notification = useNotifications();

  // useEffect(() => {
  //   if (!didMount || pages !== 0) return;

  //   const interval = setInterval(() => {
  //     if (page !== 1) {
  //       return setPage(1);
  //     }

  //     const method = 'GET';

  //     doComplaintsFetch({ method });
  //   }, 2000);

  //   return () => clearInterval(interval);
  // }, [pages, page, didMount, doComplaintsFetch]);

  // Fetch complaints
  useEffect(() => {
    const method = 'GET';

    doComplaintsFetch({ method });
  }, [doComplaintsFetch]);

  // Fetch errors
  useEffect(() => {
    if (!complaintsError && !decisionError) return;

    notification(complaintsError || decisionError, 'error');
  }, [complaintsError, decisionError, notification]);

  // Fetch items response
  useEffect(() => {
    if (!complaintsResponse) return;

    const { complaints, numberOfPages } = complaintsResponse;

    setComplaints((prevState) => [...prevState, ...complaints]);
    setPages(numberOfPages);
    setInitialized(true);
  }, [complaintsResponse, notification]);

  useEffect(() => {
    if (!decisionResponse) {
      return;
    }

    const { id } = decisionResponse;

    setComplaints((prevState) =>
      prevState.filter((complaint) => complaint.id !== id)
    );

    notification('Success', 'success');
  }, [decisionResponse, notification]);

  const makePagination = () => {
    const method = 'GET';

    doComplaintsFetch({ method });

    setPage((prevState) => prevState + 1);
  };

  // Moderation fetch error
  useEffect(() => {
    if (!decisionError) return;

    notification(decisionError, 'error');
  }, [decisionError, notification]);

  // Automatically checks new complaints if there is no its
  useEffect(() => {
    if (!initialized || !complaintsResponse || complaints.length) {
      return;
    }

    setPage(1);

    let timer;

    const timeoutCallback = () => {
      if (!isComplaintsLoading) {
        const method = 'GET';

        doComplaintsFetch({ method });
      }

      timer = setTimeout(timeoutCallback, 5000);
    };

    timer = setTimeout(() => {
      timeoutCallback();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [
    initialized,
    complaintsResponse,
    complaints,
    isComplaintsLoading,
    doComplaintsFetch,
  ]);

  const handleAction = (isConfirm, id) => {
    const method = 'DELETE';
    const body = {
      decision: {
        block: isConfirm,
        id,
      },
    };

    doDecisionFetch({ method, body });
  };

  const chillElement = (
    <Grid container direction="column" alignItems="center">
      <Grid item>
        <Typography gutterBottom>
          There is no complaints for moderation now
        </Typography>
      </Grid>
      <Grid item sx={{ pb: 1 }}>
        <picture>
          <Box
            component="source"
            srcSet="/images/unsorted/cup-of-tea.webp"
            type="image/webp"
            sx={{ display: 'block', borderRadius: 1 }}
          />
          <Box
            component="source"
            srcSet="/images/unsorted/cup-of-tea.jpg"
            type="image/jpeg"
            sx={{ display: 'block', borderRadius: 1 }}
          />
          <Box
            component="img"
            src="/images/unsorted/cup-of-tea.jpg"
            width={300}
            height={200}
            alt="cup of tea"
            sx={{ display: 'block', borderRadius: 1 }}
          />
        </picture>
      </Grid>
      <Grid item sx={{ pb: 1 }}>
        <MyLink href={`/moderation/${type}`}>
          <Button variant="contained" color="primary">
            Check for new complaints
          </Button>
        </MyLink>
      </Grid>
    </Grid>
  );

  return (
    <>
      <Paper sx={{ pb: 1 }}>
        <Typography
          align="center"
          component="h1"
          variant="h5"
          gutterBottom
          sx={{
            '&:first-letter': {
              textTransform: 'uppercase',
            },
          }}
        >
          Complaints
        </Typography>
        <List>
          {complaintsResponse && !complaints.length && chillElement}
          {complaints.map(({ id, post, comment }) => {
            const title = post?.title;
            const body = post ? post.body.HTML : comment.comment.body;
            const link = post ? `/post/${post.slug}` : null;

            return (
              <ListItem key={id}>
                <Item
                  id={id}
                  title={title}
                  body={body}
                  link={link}
                  onAction={handleAction}
                  disabled={isDecisionLoading}
                />
                <Divider absolute />
              </ListItem>
            );
          })}
        </List>
        {page < pages && (
          <Box
            sx={{
              textAlign: 'center',
              marginTop: 1,
            }}
          >
            <Button
              disabled={isComplaintsLoading}
              onClick={makePagination}
              variant="contained"
              color="primary"
            >
              More
            </Button>
          </Box>
        )}
      </Paper>
    </>
  );
};

Moderation.propTypes = {
  type: PropTypes.oneOf(['posts', 'comments']).isRequired,
};

export default Moderation;
