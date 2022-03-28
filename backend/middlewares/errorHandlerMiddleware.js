const ApiError = require('../exceptions/ApiError');

const errorBody = (error = '') => ({
  errors: [
    {
      msg: error,
    },
  ],
});

const errorHandlerMiddleware = () => (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.code).json(errorBody(err.message));
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json(errorBody('Incorrect request'));
  }

  console.error(err);

  return res.status(500).json(errorBody('Something went really wrong'));
};

module.exports = errorHandlerMiddleware;
