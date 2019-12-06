const axios = require('axios');
const request = require('request');
const xml2js = require('xml2js');
const path = require('path');
const fs = require('fs');
const swaggerSchema = require('../config/swagger/swagger.json');
const applicationConfiguration = require('../config/application-configuration');

const schemas = applicationConfiguration.apiValidationSchema;

/**
 * add the properties to the object
 * @param {*} obj
 * @param {*} key
 * @param {*} val
 */
const defineProperty = (obj, key, val) => Object.defineProperty(obj, key, {
  value: val,
  writable: true,
  configurable: true,
  enumerable: true,
});

/**
 * load the corresponding schema from the swagger file
 * @param {*} apiPath
 */
const loadCorrespondingSchema = apiPath => {
  let schemaDetail = null;
  schemas.forEach(schema => {
    if (schema.id === apiPath) {
      schemaDetail = swaggerSchema.definitions[schema.schema];
    }
  });
  return schemaDetail;
};

/**
 * get the image from url
 * @param {*} imageUrl
 */
const getRemoteImage = async (imageUrl, imageFileName) => {
  await axios({
    url: imageUrl,
    responseType: 'stream',
  }).then(
    response => new Promise((resolve, reject) => {
      response.data
        .pipe(
          fs.createWriteStream(
            path.join(__dirname, `../resource/tempImages/${imageFileName}`)
          )
        )
        .on('finish', () => resolve())
        .on('error', e => reject(e));
    })
  );
};

/**
 * get the local image
 * @param {*} imageName it will navigate to the resource/tempImage folder to get the image
 */
const getLocalImaage = async imageName => {
  const image = fs.readFileSync(
    path.join(__dirname, `../resource/tempImages/${imageName}`)
  );
  return image;
};

/**
 * xml to json
 * @param {*} xml
 */
const parseXML = async xml => new Promise((resolve, reject) => {
  xml2js.parseString(xml, { trim: true }, (err, obj) => {
    if (err) {
      return reject(err);
    }
    return resolve(obj);
  });
});

module.exports = {
  defineProperty,
  loadCorrespondingSchema,
  getRemoteImage,
  getLocalImaage,
  parseXML,
};
