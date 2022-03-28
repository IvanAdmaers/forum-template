import ErrorPage from 'components/pages/ErrorPage';

const InternalErrorPage = () => (
  <ErrorPage statusCode="500" errorText="Something went wrong" />
);

export default InternalErrorPage;
