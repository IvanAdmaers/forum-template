import { useRouter } from 'next/router';

import MyHead from 'components/MyHead';
import Search from 'components/pages/Search';

import { getTitle, getSiteName } from 'utills';

const siteName = getSiteName();

const SearchPage = () => {
  const router = useRouter();

  const { q } = router.query;

  const titleText = q ? `Search by request ${q}` : `Search`;

  const title = getTitle(titleText);
  const description = `Search on ${siteName}. ${titleText}`;

  return (
    <>
      <MyHead title={title} description={description} />
      <Search />
    </>
  );
};

export default SearchPage;
