import config from '../../../config.json';

const getSignedUrl = ({ s3, Key }) =>
  new Promise((resolve, reject) => {
    console.log('key:', Key);
    return s3.getSignedUrl(
      'putObject',
      {
        Bucket: 'worona',
        Key,
      },
      (error, url) => {
        if (error) reject(error);
        else resolve(url);
      }
    );
  });

export default async (req, res) => {
  const AWS = require('aws-sdk');

  AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  });

  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint('https://s3.sirv.com'),
    s3ForcePathStyle: true,
  });

  try {
    console.log('query:', req.query);
    const url = await getSignedUrl({
      s3,
      Key: `sites/${req.query.siteId}/${req.query.imgType}/${req.query.objectName}`,
    });
    console.log('succeed:', url);
    res.send(url);
  } catch (error) {
    console.log('error:', error);
    res.send(error);
  }
};
