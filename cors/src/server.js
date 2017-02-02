import corsProxy from 'cors-anywhere';

const host = '127.0.0.1';
const port = 7779;

corsProxy.createServer({
  originWhitelist: [], // Allow all origins
  // requireHeader: ['origin', 'x-requested-with'],
  // removeHeaders: ['cookie', 'cookie2'],
  setHeaders: { 'x-powered-by': 'CORS Anywhere' },
}).listen(port, host, () => console.log(`Running CORS Anywhere on ${host}: ${port}`));
