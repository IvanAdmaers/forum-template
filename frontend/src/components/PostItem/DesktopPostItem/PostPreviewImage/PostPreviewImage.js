import PropTypes from 'prop-types';
import { Box } from '@mui/material';

import MyLink from 'components/MyLink';

/**
 * @returns {number} - Image padding bottom
 */
const getImagePaddingBottom = (width = 0, height = 0) => 100 * (height / width);

const PostPreviewImage = ({ link, src, width, height, alt }) => {
  const paddingBottom = getImagePaddingBottom(width, height);

  const imageMaxHeight = 512;
  const maxHeight = height > imageMaxHeight ? imageMaxHeight : height;

  return (
    <Box
      sx={{
        position: 'relative',
        maxHeight,
      }}
    >
      <Box
        sx={{
          paddingBottom: `${paddingBottom}%`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <MyLink href={link}>
          <Box
            sx={{
              maxHeight: imageMaxHeight,
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {/* We can't use Next Image component because the image
              might be from any url */}
            <div>
              <Box
                component="img"
                src={src}
                alt={alt}
                sx={{
                  maxWidth: '100%',
                  maxHeight: imageMaxHeight,
                }}
              />
            </div>
          </Box>
        </MyLink>
      </Box>
      {/* </Box> */}
    </Box>
  );
};

PostPreviewImage.propTypes = {
  link: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  alt: PropTypes.string.isRequired,
};

export default PostPreviewImage;
