const fs = require('fs');
const readline = require('readline');

class LogService {
   constructor(filePath) {
      this.filePath = filePath;
      this.lastByte = 0; // start at beginning
   }

   async init() {
      try {
         const stat = await fs.promises.stat(this.filePath);
         this.lastByte = stat.size;
      } catch (error) {
         this.lastByte = 0;
         console.log('ERR>>>', error)  
      }
   }

   async lastNLines(limit = 10) {
      const data = [];
      return new Promise((res, rej) => {
         // console.log(this.filePath);
         
         const stream = fs.createReadStream(this.filePath, {encoding:'utf8'});
         const rl = readline.createInterface({input: stream});
         // console.log('Debug');
         // res(['a', 'b'])
         rl.on('line', (line) => {
            // console.log(line); 
            data.push(line);
            if (data.length > limit) data.shift();
         });
         rl.on('close', () => res(data));
         rl.on('error', (err) => {
            console.log(err)
         }) 
      })
   }

   async liveSync() {
      let fileStat; 
      try {
         fileStat = fs.statSync(this.filePath);
      } catch (error) {
         console.log('ERR>>>', error)
      }

      if (fileStat.size === this.lastByte) return [];

      const data = [];
      const stream = fs.createReadStream(this.filePath, {start: this.lastByte, end: fileStat.size, encoding: 'utf8'})
      return new Promise((res, rej) => {
         stream.on('data', (l) => data.push(l));
         stream.on('end', () => {
            this.lastByte = fileStat.size;
            const text = data.join('');
            const lines = text.split(/\r?\n/).filter(l => l.length > 0);
            res(lines)
         }); // not sure of data format
         stream.on('error', (err) => {
            console.log(err)
         })
      })
      // fs.watch(this.filePath, (event)=> {
      //    // if ()
      // })
   }
}

module.exports = {
   LogService
}
