import PropTypes from 'prop-types';
import { Grid, Typography, Box } from '@mui/material';

import { VerifiedIcon } from 'components/Icons';
import { Avatar, BanMarker } from 'components/UserUI';

const GroupHeader = ({
  image,
  slug,
  title,
  description,
  membersCount,
  verification,
  hasBan,
}) => {

  const banElement = (
    <BanMarker />
  );

  return (
    <Grid container justifyContent="center" sx={{ py: 1 }}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar
            width={80}
            height={80}
            image={image}
            alt={`group ${title} avatar`}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography component="h1" variant="h6" align="center">
            {title}
          </Typography>
          {verification && (
            <Box ml={1}>
              <VerifiedIcon />
            </Box>
          )}
          {hasBan && banElement}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography component="h2" variant="body1" align="center" gutterBottom>
          group/{slug}
        </Typography>
      </Grid>
      {description && (
        <Grid item xs={7}>
          <Typography variant="body2" align="center" gutterBottom>
            {description}
          </Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        <Typography variant="body2" align="center" gutterBottom>
          {membersCount} members
        </Typography>
      </Grid>
    </Grid>
  );
};

GroupHeader.defaultProps = {
  verification: false,
  hasBan: false,
};

GroupHeader.propTypes = {
  image: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  membersCount: PropTypes.number.isRequired,
  verification: PropTypes.bool,
  hasBan: PropTypes.bool,
};

export default GroupHeader;
