const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase, { defaultConfig }) => {
  defaultConfig = {
    ...defaultConfig,
    redirects: async () => [
      {
        source: '/signup',
        destination: '/sign-up',
        permanent: true,
      },
      {
        source: '/groups/top',
        destination: '/groups/top/1',
        permanent: true,
      },
    ],
    images: {
      domains: ['i.ibb.co', 'gravatar.com', 'www.gravatar.com'],
    },
  };

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    // DEVELOPMENT
    return {
      ...defaultConfig,
      reactStrictMode: true,
    };
  }

  // PRODUCTION
  return {
    ...defaultConfig,
  };
};
