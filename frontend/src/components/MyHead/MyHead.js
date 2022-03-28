import PropTypes from 'prop-types';
import NextHead from 'next/head';

import { getSiteName } from 'utills';

const Head = ({ title, description, children, noIndex }) => {
  return (
    <NextHead>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {noIndex && <meta name="robots" content="noindex" />}
      {children}
    </NextHead>
  );
};

Head.defaultProps = {
  title: getSiteName(),
  description: '',
  noIndex: false,
};

Head.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
  noIndex: PropTypes.bool,
};

export default Head;
