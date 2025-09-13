const http = require('http');
const WebSocket = require('ws');
const { PORT, LOG_FILE, LIMIT } = require('./config');

const { Connection } = require('./websocket/Connection');
const { LogService } = require('./service/LogService');
const { handleConnection } = require('./websocket/handleConnection');
const { fileWatcher } = require('./websocket/fileWatcher')

async function startServer() {
   // connections    
   const connections = new Connection();
   // Log Service 
   const logService = new LogService(LOG_FILE);
   logService.init();
   // File watch 
   const server = http.createServer();
   const wss = new WebSocket.Server({server});
   wss.on('connection', handleConnection({connections, logService, LIMIT}));
   fileWatcher({connections, logService, LOG_FILE});

   // server listen 
   server.listen(PORT, () => {
      console.log('Server listenning to PORT: ', PORT);
   })
}

startServer().catch( (err) => {
   console.log('Server Start Error: ', err)
});