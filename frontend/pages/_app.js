import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { CacheProvider } from '@emotion/react';

import Layout from 'components/Layout';
import UserInitialization from 'components/UserInitialization';
import { GoogleAnalytics } from 'components/GoogleAnalytics';

import createEmotionCache from 'helpers/cache/createEmotionCache';
import { darkTheme, lightTheme, globalStyles } from 'themes';
import { isProduction as isProductionMode, getSiteName } from 'utills';

// Redux
import { wrapper } from 'store';

const TopProgressBar = dynamic(() => import('components/TopProgressBar'), {
  ssr: false,
});

const clientSideEmotionCache = createEmotionCache();

const inputGlobalStyles = <GlobalStyles styles={globalStyles} />;

const MyApp = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}) => {
  const [colorTheme, setColorTheme] = useState(null);
  const reduxColorTheme = useSelector(({ settings }) => settings.theme);

  const isProduction = isProductionMode();

  const theme = colorTheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    setColorTheme(reduxColorTheme);
  }, [reduxColorTheme]);

  const siteName = getSiteName();

  const googleAnalyticsElement = isProduction && <GoogleAnalytics />;

  return (
    <CacheProvider value={emotionCache}>
      {inputGlobalStyles}
      <Head>
        <title>{siteName}</title>
        <meta name="theme-color" content={theme.palette.primary.main} />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {googleAnalyticsElement}
          <TopProgressBar />
          <SnackbarProvider maxSnack={3}>
            <UserInitialization />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  );
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.objectOf(PropTypes.any).isRequired,
  emotionCache: PropTypes.object,
};

export default wrapper.withRedux(MyApp);
