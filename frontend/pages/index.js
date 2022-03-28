import MyHead from 'components/MyHead';
import MainPage from 'components/pages/MainPage';

import { getSiteName } from 'utills';

const siteName = getSiteName();

const Home = () => {
  const siteNameWithUppercase = `${siteName
    .charAt(0)
    .toUpperCase()}${siteName.slice(1)}`;

  const title = `Welcome to ${siteNameWithUppercase}`;
  const description = 'Description text';

  return (
    <>
      <MyHead title={title} description={description} />
      <MainPage />
    </>
  );
};

export const getStaticProps = async () => {
  const getSitemap = require('libs/getSitemap');

  await getSitemap();

  return {
    props: {},
    revalidate: 60 * 60 * 24, // revalidate every 24 hours
  };
};

export default Home;
