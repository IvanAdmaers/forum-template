import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import Image from 'next/image';

const Avatar = ({ image, username, width, height, alt }) => {
  const imageAltText = username ? `user ${username} avatar` : 'user avatar';

  const imageAlt = !alt ? imageAltText : alt;

  return (
    <Box sx={{ display: 'flex', borderRadius: '50%', overflow: 'hidden' }}>
      <Image
        src={image}
        alt={imageAlt}
        width={width}
        height={height}
        layout="fixed"
        objectFit="cover"
      />
    </Box>
  );
};

Avatar.propTypes = {
  image: PropTypes.string.isRequired,
  username: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  alt: PropTypes.string,
};

Avatar.defaultProps = {
  username: '',
  width: 24,
  height: 24,
  alt: '',
};

export default Avatar;
