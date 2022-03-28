import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { googleAnalytics } from 'libs';

const GoogleAnalytics = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      googleAnalytics.pageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return null;
};

export default GoogleAnalytics;
