import dotenv from 'dotenv';
dotenv.config();
const isDev = process.env.NODE_ENV === 'development';
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || '3000';
console.log(`🚀 Server starting in ${isDev ? 'development' : 'production'} mode`);
console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
// const server = createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
// });
// server.listen(Number(port), hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
