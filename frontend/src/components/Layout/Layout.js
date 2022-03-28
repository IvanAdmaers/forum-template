import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { useSelector } from 'react-redux';

import Header from 'components/Header';
import Footer from 'components/Footer';

import { getPageWidth } from 'utills';

// Winter designs
import getChristmasLighsLength from 'components/designs/Winter/ChristmasLights/getChristmasLighsLength';

const Snowfall = dynamic(() => import('components/designs/Winter/Snowfall'), {
  ssr: false,
});

const ChristmasLights = dynamic(
  () => import('components/designs/Winter/ChristmasLights'),
  {
    ssr: false,
  }
);

const Layout = ({ children }) => {
  const [lengthOfChristmasLighs, setLengthOfChristmasLighs] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const setWidth = () => {
      const width = getPageWidth();

      const length = getChristmasLighsLength(width);

      return setLengthOfChristmasLighs(length);
    };

    setWidth();

    const listener = window.addEventListener('resize', setWidth);

    return () => window.removeEventListener('resize', listener);
  }, []);

  const design = useSelector(({ settings }) => settings.design);
  const footerItems = useSelector(({ footer }) => footer.items);

  const { type: designType, winter } = design;

  // Winter
  const { shouldShowChristmasLights } = winter;
  const isWinterDisign = designType === 'winter';
  const winterDesignElement = <Snowfall />;
  const winterDesignChristmasLightsElement = (
    <ChristmasLights length={lengthOfChristmasLighs} />
  );

  return (
    <>
      {isWinterDisign && winterDesignElement}
      <Header />
      {isWinterDisign &&
        shouldShowChristmasLights &&
        Boolean(lengthOfChristmasLighs) &&
        winterDesignChristmasLightsElement}
      <Container maxWidth="lg" sx={{ minHeight: '100vh', my: 3, mx: 'auto' }}>
        {children}
      </Container>
      <Footer footerList={footerItems} />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
