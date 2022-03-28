import PropTypes from 'prop-types';
import { Card, Box, Typography } from '@mui/material';

import { Avatar } from 'components/UserUI';
import MyLink from 'components/MyLink';

const Group = ({ slug, image }) => {
  return (
    <Card elevation={0}>
      <MyLink href={`/group/${slug}`}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar width={50} height={50} image={image} alt={`group ${slug}`} />
        </Box>
        <Typography align="center" component="p" variant="h6">
          group/{slug}
        </Typography>
      </MyLink>
    </Card>
  );
};

Group.propTypes = {
  slug: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default Group;
