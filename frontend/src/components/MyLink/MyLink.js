import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import NextLink from 'next/link';
import { Link as MuiLink } from '@mui/material';

const Link = forwardRef(({ href, as, prefetch, underline, color, ...props }, ref) => {
  return (
    <NextLink href={href} as={as} prefetch={prefetch} passHref>
      <MuiLink underline={underline} color={color} ref={ref} {...props} />
    </NextLink>
  );
});

Link.displayName = 'MyLink';

Link.defaultProps = {
  href: '#',
  prefetch: false,
  underline: 'none',
  color: 'inherit',
};

Link.propTypes = {
  href: PropTypes.string,
  as: PropTypes.string,
  prefetch: PropTypes.bool,
  className: PropTypes.string,
  underline: PropTypes.string,
  color: PropTypes.string,
};

export default Link;
