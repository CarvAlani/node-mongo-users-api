const expressValidation = require('express-validation');
const httpStatus = require('http-status');

const config = require('../config');
const APIError = require('../helpers/APIError');

module.exports = {
  convertToApiError: (err, req, res, next) => {
    if (err instanceof expressValidation.ValidationError) {
      const unifiedErrorMessage = err.errors
        .map((error) => error.messages.join('. '))
        .join(' and ');
      const error = new APIError(unifiedErrorMessage, err.status, true);
      return next(error);
    }
    if (!(err instanceof APIError)) {
      const apiError = new APIError(err.message, err.status, err.isPublic);
      return next(apiError);
    }
    return next(err);
  },
  notFound: (req, res, next) => {
    const err = new APIError('API not found', httpStatus.NOT_FOUND);
    return next(err);
  },
  /* eslint-disable indent */
  /* eslint-disable no-unused-vars */
  addTrace: (err, req, res, next) => res.status(err.status).json({
      message: err.isPublic ? err.message : httpStatus[err.status],
      stack: config.env !== 'test' ? err.stack : {}
    })
  /* eslint-enable no-unused-vars */
  /* eslint-enable indent */
};
