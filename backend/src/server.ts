import { createServer } from 'node:http';
import dotenv from 'dotenv';

dotenv.config();

const isDev = process.env.NODE_ENV === 'development';
const hostname = isDev ? 'localhost' : process.env.HOSTNAME;
const port = isDev ? 3040 : Number(process.env.PORT);

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello World' }));
});

server.listen(port, hostname, () => {
  console.log(`🚀 Server is running at http://${hostname}:${port}/`);
  console.log(`📍 Environment: ${isDev ? 'development' : 'production'}`);
}).on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use.`);
    console.error(`💡 Try one of these commands:`);
    console.error(`   1. npm run port:kill`);
    console.error(`   2. fuser -k ${port}/tcp`);
    console.error(`   3. lsof -ti:${port} | xargs kill -9`);
    console.error(`   4. Use a different port: set ${isDev ? 'DEV_PORT' : 'PROD_PORT'} in .env`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});
