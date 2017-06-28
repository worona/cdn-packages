import config from '../../../config.json';

// process.env.AWS_ACCESS_KEY_ID = config.AWS_ACCESS_KEY_ID;
// process.env.AWS_SECRET_ACCESS_KEY = config.AWS_ACCESS_KEY_ID;
//
// export const old = require('react-s3-uploader/s3router')({
//   bucket: 'worona',
//   region: 'eu-west-1', // optional
//   // signatureVersion: 'v4', // optional (use for some amazon regions: frankfurt and others)
//   headers: { 'Access-Control-Allow-Origin': '*' }, // optional
//   ACL: 'private', // this is default,
//   getFileKeyDir: req => `sites/${req.query.siteId}/${req.query.imgType}/`,
// });

const getSignedUrl = ({ s3, Key }) =>
  new Promise((resolve, reject) =>
    s3.getSignedUrl(
      'putObject',
      {
        Bucket: 'worona',
        Key,
      },
      (error, url) => {
        if (error) reject(error);
        else resolve(url);
      }
    )
  );

export default async (req, res) => {
  const AWS = require('aws-sdk');

  AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_ACCESS_KEY_ID,
  });

  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint('https://s3.sirv.com'),
    s3ForcePathStyle: true,
  });

  try {
    const url = await getSignedUrl({ s3, Key: `sites/${req.query.siteId}/${req.query.imgType}/` });
    res.send(url);
  } catch (error) {
    res.send(error);
  }
};
