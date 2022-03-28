import PropTypes from 'prop-types';
import {
  Typography,
  List,
  ListItem,
  CircularProgress,
  Box,
} from '@mui/material';

import MyLink from 'components/MyLink';

const TopCategories = ({ title, itemsList }) => {
  if (!itemsList) {
    return null;
  }

  if (!itemsList.length) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography align="center" component="h1" gutterBottom>
        {title}
      </Typography>
      <List
        component="nav"
        aria-label="categories"
        sx={{
          width: '100%',
          margin: (theme) => theme.spacing(0, 'auto'),
          maxWidth: 460,
          backgroundColor: (theme) => theme.palette.background.paper,
          position: 'relative',
          overflow: 'auto',
          maxHeight: 150,
        }}
      >
        {itemsList.map(({ link, title }, key) => {
          return (
            <ListItem
              component={MyLink}
              href={link}
              key={`category-${key}`}
              button
            >
              <Typography component="h2" noWrap>
                {title}
              </Typography>
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

TopCategories.defaultProps = {
  itemsList: [],
};

TopCategories.propTypes = {
  title: PropTypes.string.isRequired,
  itemsList: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      title: PropTypes.string,
    })
  ),
};

export default TopCategories;
