import { Paper } from '@mui/material';

import MyHead from 'components/MyHead';

import { getTitle } from 'utills';

const FeedBackPage = () => {
  const title = getTitle('Feedback');
  const description =
    'We always welcome any feedback, because we believe that every opinion is valuable and helps to develop and improve. Leave your opinion about our forum, we will be extremely grateful';

  return (
    <>
      <MyHead title={title} description={description} />
      <Paper>
        <iframe
          width="100%"
          height="1800px"
          src="https://docs.google.com/forms/d/e/1FAIpQLSePenmO-V4iRzcV3R791ArMhf8N_spzg3rYMTRgiXb3s7xeOg/viewform?embedded=true"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
        >
          Loading…
        </iframe>
      </Paper>
    </>
  );
};

export default FeedBackPage;
