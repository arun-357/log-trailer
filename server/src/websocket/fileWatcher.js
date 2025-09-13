const fs = require('fs');

function fileWatcher({connections, logService, LOG_FILE}){
   
   let timer = null;
   const watch = () => {
      if (timer) return; 
      timer = setTimeout(async () => {
         timer = null;
         try {
            const data = await logService.liveSync();
            if (data.length) {
               connections.broadcast({type: 'live', data})
            }
         } catch (error) {
            connections.broadcast({type: 'error', message: 'Error'})
         }
      }, 100)
   }
   
   fs.watch(LOG_FILE, (event) => {
      if (event === 'change') {
         watch()
      }
   });
}

module.exports = {
   fileWatcher
}