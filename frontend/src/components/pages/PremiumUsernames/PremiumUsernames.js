import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Container,
  Box,
  Button,
  Skeleton,
  Pagination,
  PaginationItem,
} from '@mui/material';

import MyLink from 'components/MyLink';

import PremiumUsernameItem from './PremiumUsernameItem';

import { useFetch, useNotifications } from 'hooks';

import { createFakeArray } from 'utills';

const PremiumUsernames = () => {
  const [didMount, setDidMount] = useState(false);
  const [list, setList] = useState([]);
  const [numberOfPages, setNumberOfPages] = useState(-1);
  const [showAdd, setShowAdd] = useState(false);

  const router = useRouter();

  const notification = useNotifications();

  const page = +router.query.page || 1;
  const limit = 10;

  const [
    { error: listError, isLoading: isListLoading, response: listResponse },
    doListFetch,
  ] = useFetch(`/premium-username/list?page=${page}&limit=${limit}`);

  const [
    { error: editError, isLoading: isEditLoading, response: editResponse },
    doEditFetch,
  ] = useFetch('/premium-username');

  const [
    { error: addError, isLoading: isAddLoading, response: addResponse },
    doAddFetch,
  ] = useFetch('/premium-username');

  // Errors
  useEffect(() => {
    if (!listError && !editError && !addError) return;

    const text = listError || editError || addError;

    notification(text, 'error');
  }, [notification, listError, editError, addError]);

  useEffect(() => {
    const method = 'GET';

    doListFetch({ method });
    setDidMount(true);
  }, [page, doListFetch]);

  useEffect(() => {
    if (!listResponse) return;

    const { premiumUsernames, numberOfPages } = listResponse;

    setList(premiumUsernames);
    setNumberOfPages(numberOfPages);
  }, [listResponse]);

  // Edit premium username fetch response
  useEffect(() => {
    if (!editResponse) return;

    notification('Successful edited', 'success');

    const { premiumUsername } = editResponse;

    setList((prevState) =>
      prevState.map((item) =>
        item.id === premiumUsername.id ? { ...premiumUsername } : item
      )
    );
  }, [editResponse, notification]);

  // Add a premium username fetch
  useEffect(() => {
    if (!addResponse) return;

    const { premiumUsername } = addResponse;

    setList((prevState) => [premiumUsername, ...prevState]);

    setShowAdd(false);

    notification('Successfully added', 'success');
  }, [addResponse, notification]);

  const handleEdit = (id = '') => {
    setList((prevState) =>
      prevState.map((item) => {
        if (item.id === id) {
          item.__mode = 'edit';
        }

        return item;
      })
    );
  };

  const handleCancel = () => {
    setList((prevState) =>
      prevState.map((item) => {
        item.__mode = 'static';

        return item;
      })
    );
  };

  const handleCloseAdd = () => {
    setShowAdd(false);
  };

  const handleShowAdd = () => {
    setShowAdd(true);
  };

  const handleSave = (id, username, price, discountPrice, available) => {
    handleEdit(id, false);

    const method = 'PUT';

    const body = { premiumUsername: { id, price, available } };

    if (discountPrice) body.premiumUsername.discountPrice = discountPrice;

    return doEditFetch({ method, body });
  };

  const handleAdd = (id, username, price, discountPrice, available) => {
    if (!username.length) {
      return notification('Enter username', 'error');
    }

    if (!price) {
      return notification('Enter price', 'error');
    }

    const method = 'POST';

    const body = { premiumUsername: { username, price, available } };

    if (discountPrice) {
      body.premiumUsername.discountPrice = discountPrice;
    }

    return doAddFetch({ method, body });
  };

  const isLoading = isEditLoading || isAddLoading;

  const addButtonElement = !showAdd && (
    <Box ml={1}>
      <Button onClick={handleShowAdd} variant="contained" size="small">
        Add
      </Button>
    </Box>
  );

  const loadingElement = createFakeArray(limit).map((id) => (
    <Grid key={`skeleton-${id}`} item>
      <Skeleton height={100} />
    </Grid>
  ));

  const listElement =
    !didMount || isListLoading ? (
      <Grid container direction="column">
        {loadingElement}
      </Grid>
    ) : (
      list.map(
        ({
          id,
          username,
          price,
          discountPrice,
          available,
          __mode = 'static',
        }) => (
          <PremiumUsernameItem
            key={`premium-username-${id}`}
            id={id}
            username={username}
            price={price}
            discountPrice={discountPrice}
            available={available}
            mode={__mode}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={isLoading}
          />
        )
      )
    );

  return (
    <Paper>
      <Grid container justifyContent="center" alignItems="center">
        <Typography variant="h4" component="h1" align="center">
          Premium usernames
        </Typography>
        {addButtonElement}
      </Grid>
      <Container maxWidth="md">
        {showAdd && (
          <PremiumUsernameItem
            mode="add"
            onCancel={handleCloseAdd}
            onSave={handleAdd}
            loading={isLoading}
          />
        )}
        {listElement}
      </Container>
      {numberOfPages !== -1 && (
        <Box mt={3} pb={1} display="flex" justifyContent="center">
          <Pagination
            disabled={isListLoading}
            count={numberOfPages}
            page={page}
            renderItem={(props) => {
              // eslint-disable-next-line react/prop-types
              const href = `?page=${props.page}`;

              return (
                <PaginationItem {...props} component={MyLink} href={href} />
              );
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default PremiumUsernames;
