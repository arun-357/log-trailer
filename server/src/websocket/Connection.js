class Connection {
   constructor() {
      this.clients = new Set();
   }

   add(ws) {
      this.clients.add(ws);
   }

   remove(ws) {
      this.clients.delete(ws);
   }

   size() {
      return this.clients.size;
   }

   broadcast(data) {
      if (!this.clients.size) return;

      for (const ws of this.clients) {
         ws.send(JSON.stringify(data))
      }
   }
}

module.exports = {
   Connection
}