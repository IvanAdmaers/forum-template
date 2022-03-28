import PropTypes from 'prop-types';
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import Item from './Item';

import MyLink from 'components/MyLink';

const PaginationButton = ({ text, disabled, href }) => {
  return (
    <Button disabled={disabled} variant="contained" color="primary">
      {!disabled ? <MyLink href={href}>{text}</MyLink> : text}
    </Button>
  );
};

PaginationButton.propTypes = {
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  href: PropTypes.string.isRequired,
};

const TopGroups = ({ groups, currentPage, numberOfPages }) => {
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const shouldDisablePrevButton = prevPage <= 0;
  const shouldDisableNextButton = nextPage > numberOfPages;

  return (
    <Paper>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Best groups
      </Typography>
      <Container maxWidth="sm">
        {groups.map((group) => {
          const { slug, id, title, image, membersCount, description } = group;

          const link = `/group/${slug}`;

          const members = `${membersCount} members`;

          return (
            <Box key={id} mb={1}>
              <Item
                link={link}
                title={title}
                image={image}
                members={members}
                description={description}
              />
            </Box>
          );
        })}
      </Container>
      <Box pb={1}>
        <Grid container justifyContent="center" spacing={1}>
          <Grid item>
            <PaginationButton
              text="Back"
              disabled={shouldDisablePrevButton}
              href={`/groups/top/${prevPage}`}
            />
          </Grid>
          <Grid item>
            <PaginationButton
              text="Next"
              disabled={shouldDisableNextButton}
              href={`/groups/top/${nextPage}`}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

TopGroups.propTypes = {
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

export default TopGroups;
