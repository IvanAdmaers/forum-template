import PropTypes from 'prop-types';
import { Grid, Avatar, Typography } from '@mui/material';
import MyLink from 'components/MyLink';

const Item = ({ image, link, title }) => {
  return (
    <MyLink href={link}>
      <Grid container alignItems="center" spacing={1}>
        {image && (
          <Grid item>
            <Avatar src={image} width="30" height="30" alt={`${title} image`} />
          </Grid>
        )}
        <Grid item>
          <Typography>{title}</Typography>
        </Grid>
      </Grid>
    </MyLink>
  );
};

Item.defaultProps = {
  image: '',
};

Item.propTypes = {
  image: PropTypes.string,
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Item;
