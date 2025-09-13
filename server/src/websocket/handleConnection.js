function handleConnection({ connections, logService, LIMIT }) {
   // callback
   return async function connect(ws) {
      connections.add(ws);
      console.log('Active Connections: ', connections.size());
      
      try {
         const data = await logService.lastNLines(LIMIT);
         // console.log(data)
         ws.send(
            JSON.stringify({
               type: 'init',
               data
            })
         )
      } catch (error) {
         console.log('init error: ', error)
         ws.send(
            JSON.stringify({
               type: 'error',
               message: error.message
            })
         )
      }

      ws.on('close', () => {
         connections.remove(ws);
         console.log('Active Connections: ', connections.size());
         ws.send(
            JSON.stringify({
               type: 'closed',
               message: 'Connection closed'
            })
         )
      })

      ws.on('error', (error) => {
         connections.remove(ws);
      })
   }
}

module.exports = {
   handleConnection
}