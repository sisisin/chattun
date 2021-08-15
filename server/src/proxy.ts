import fs from 'fs';

const key = fs.readFileSync(process.env.PRIV_KEY!, 'utf-8');
const cert = fs.readFileSync(process.env.CERT!, 'utf-8');
const options = { key, cert };

import httpProxy from 'http-proxy';

httpProxy
  .createServer({
    target: { host: 'localhost', port: 3000 },
    ssl: options,
  })
  .listen(3010);
