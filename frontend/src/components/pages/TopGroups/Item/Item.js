import PropTypes from 'prop-types';
import { Grid, Typography, Box } from '@mui/material';

import { Avatar } from 'components/UserUI';
import MyLink from 'components/MyLink';

const Item = ({ link, title, image, members, description }) => {
  const imageAlt = `group ${title} avatar`;

  return (
    <MyLink href={link}>
      <Grid container spacing={1}>
        <Grid item xs={3} sm={2}>
          <Box sx={{ display: 'flex' }}>
            <Avatar image={image} width={80} height={80} alt={imageAlt} />
          </Box>
        </Grid>
        <Grid item xs={9} sm={10}>
          <Typography component="h2" variant="h6" noWrap>
            {title}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {members}
          </Typography>
          {description && <Typography>{description}</Typography>}
        </Grid>
      </Grid>
    </MyLink>
  );
};

Item.propTypes = {
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  members: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default Item;
