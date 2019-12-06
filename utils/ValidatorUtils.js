const validator = require('validator');
const jsonschemaValidator = require('jsonschema').validate;

const { loadCorrespondingSchema } = require('./CommonUtils');

const validateRequired = (data, error) => {
  let targetError = null;
  if (data === undefined || data === null || validator.isEmpty(data)) {
    targetError = error;
  }
  return targetError;
};

const validateObject = (data, error) => {
  let targetError = null;
  if (data === undefined || data === null || Object.keys(data).length === 0) {
    targetError = error;
  }
  return targetError;
};

const validateContains = (data, expectedValue, error) => {
  let targetError = null;
  if (
    data === undefined
    || data === null
    || data.indexof(expectedValue) === -1
  ) {
    targetError = error;
  }
  return targetError;
};

const validateJsonSchema = async (apiPath, data) => {
  const schemaDetail = loadCorrespondingSchema(apiPath);
  const validationResult = await jsonschemaValidator(data, schemaDetail);
  return validationResult;
};

module.exports = {
  validateRequired,
  validateObject,
  validateContains,
  validateJsonSchema,
};
