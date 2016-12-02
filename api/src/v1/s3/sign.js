import config from '../../../config.json';

process.env.AWS_ACCESS_KEY_ID = config.AWS_ACCESS_KEY_ID;
process.env.AWS_SECRET_ACCESS_KEY = config.AWS_SECRET_ACCESS_KEY;

export default require('react-s3-uploader/s3router')({
  bucket: 'worona',
  region: 'eu-west-1', // optional
  // signatureVersion: 'v4', // optional (use for some amazon regions: frankfurt and others)
  headers: { 'Access-Control-Allow-Origin': '*' }, // optional
  ACL: 'private', // this is default,
  getFileKeyDir: req => `sites/${req.query.siteId}/${req.query.imgType}/`,
});
