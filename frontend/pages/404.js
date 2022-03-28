import ErrorPage from 'components/pages/ErrorPage';

const NotFoundErrorPage = () => (
  <ErrorPage statusCode="404" errorText="Page not found" goHomeAction />
);

export default NotFoundErrorPage;
