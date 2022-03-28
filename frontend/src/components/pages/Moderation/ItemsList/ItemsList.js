import PropTypes from 'prop-types';
import { Grid, CircularProgress } from '@mui/material';

import Item from 'components/pages/Moderation/Item';

const ItemsList = ({
  items,
  isLoading,
  didMount,
  chillElement,
  onOpenPopup,
}) => {
  if (isLoading && !didMount) {
    return (
      <Grid container justifyContent="center">
        <CircularProgress />
      </Grid>
    );
  }

  if (items.length) {
    return items.map(({ id, post, comment }) => {
      const title = post ? post.title : '';
      const body = post ? post.title : comment.body.HTML;
      console.log(comment);

      return (
        <Item
          key={id}
          id={id}
          title={title}
          body={body}
          onClick={onOpenPopup}
        />
      );
    });
  }

  return chillElement;
};

ItemsList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool.isRequired,
  didMount: PropTypes.bool.isRequired,
  chillElement: PropTypes.element.isRequired,
};

export default ItemsList;
