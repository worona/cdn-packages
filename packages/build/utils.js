import request from 'superagent';

export const getPackageVersion = async name => {
  const res = await request(`https://registry.npmjs.org/${name}`);
  return res.body['dist-tags'].latest;
};
