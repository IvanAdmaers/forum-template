import PropTypes from 'prop-types';

const GoogleAnalyticsScript = ({ id }) => {
  const scriptURL = `https://www.googletagmanager.com/gtag/js?id=${id}`;

  const scriptCode = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${id}', {
      page_path: window.location.pathname,
    });
  `;

  return (
    <>
      <script async src={scriptURL} />
      <script dangerouslySetInnerHTML={{ __html: scriptCode }} />
    </>
  );
};

GoogleAnalyticsScript.propTypes = {
  id: PropTypes.string.isRequired,
};

export default GoogleAnalyticsScript;
