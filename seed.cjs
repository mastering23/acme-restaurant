const client = require('./cliente.cjs');
console.log('ESTABLISH connection with the database....✅');
client.connect();
console.log('connecting to the database up and runnig....✅');
client.end();
console.log('database disconnected........❌');