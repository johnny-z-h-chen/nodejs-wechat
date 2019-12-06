const request = require('request');
const axios = require('axios');
const applicationConfiguration = require('../config/application-configuration');
const { getAccessToken } = require('./wechatService');
const { getLocalImaage, getRemoteImage } = require('../utils/CommonUtils');
const { consoleLogger } = require('../utils/LoggerUtils');

const axiosInstance = axios.create({
  baseURL: applicationConfiguration.wechatInfo.wechatBaseUrl,
  timeout: applicationConfiguration.httpRequestTimeout * 1000,
});

const BASE_URL = applicationConfiguration.wechatInfo.wechatBaseUrl;

/**
 * upload the image from remote to wechat
 * @param {*} imageUrl the url of image
 * @param {*} imageFileName the image name
 */
const uploadArticleImageMaterial = async (imageUrl, imageFileName) => {
  const accessToken = await getAccessToken();
  const url = `/cgi-bin/media/uploadimg?access_token=${accessToken}`;

  // download the image and store in the temp folder
  await getRemoteImage(imageUrl, imageFileName);

  // read the data from temp folder
  const imageData = await getLocalImaage(imageFileName);

  const formData = {
    buffer: {
      value: imageData,
      options: {
        filename: 'testing.jpeg',
        contentType: 'image/jpeg',
      },
    },
  };

  return new Promise((resolve, reject) => {
    request.post(
      {
        url: BASE_URL + url,
        formData,
      },
      (err, httpResponse, body) => {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(body));
      }
    );
  });
};

/**
 * upload the thumb image
 * @param {*} imageUrl
 */
const uploadThumbImageMaterial = async imageInfo => {
  const accessToken = await getAccessToken();
  const url = `/cgi-bin/material/add_material?access_token=${accessToken}`;

  // download the image and store in the temp folder
  await getRemoteImage(imageInfo.url, imageInfo.imageName);

  // read the data from temp folder
  const imageData = await getLocalImaage(imageInfo.imageName);

  const formData = {
    media: {
      value: imageData,
      options: {
        filename: 'testing.jpeg',
        contentType: 'image/jpeg',
      },
    },
    type: 'image',
  };

  // upload the thumb
  return new Promise((resolve, reject) => {
    request.post(
      {
        url: BASE_URL + url,
        formData,
      },
      (err, httpResponse, body) => {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(body));
      }
    );
  });
};

/**
 * upload the article
 * @param {*} article
 */
const uploadArticle = async articles => {
  const accessToken = await getAccessToken();
  const url = `/cgi-bin/material/add_news?access_token=${accessToken}`;

  // prepare the articles
  const targetArticles = [];

  // prepare the articles
  await Promise.all(
    articles.map(article => uploadThumbImageMaterial({
      url: article.heroImage,
      title: article.title,
      introduction: article.subtitle,
      imageName: article.heroImageName,
    })
    )
  ).then(thumbs => {
    // checking the result for uploading the thumb
    thumbs.map((thumb, index) => {
      if (thumb.media_id) {
        consoleLogger.info(
          `success to upload the thumb for the artical ${articles[index].title}`
        );

        // prepare the article
        const currentArticle = articles[index];
        const targetArticle = {
          title: currentArticle.title,
          thumb_media_id: thumb.media_id,
          author:
            currentArticle.AUTHOR.firstName + currentArticle.AUTHOR.lastName,
          digest: currentArticle.subtitle,
          show_cover_pic: 1,
          content: currentArticle.content,
          content_source_url: currentArticle.from,
          need_open_comment: 1,
          only_fans_can_comment: 1,
        };
        targetArticles.push(targetArticle);
      } else {
        consoleLogger.error(
          `fail to upload the thumb for the artical ${articles[index].title}, the detail is ${thumb}`
        );
      }
      return targetArticles;
    });
  });

  // upload the articles
  const response = await axiosInstance.post(url, { articles: targetArticles });
  return response;
};

module.exports = {
  uploadArticleImageMaterial,
  uploadThumbImageMaterial,
  uploadArticle,
};
