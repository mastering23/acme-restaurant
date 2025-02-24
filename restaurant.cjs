const client = require('./client.cjs');

const addRestaurant = async (name,reservation_id) =>{
  try{
  await client.query('INSERT INTO Restaurant (name,reservation_id) VALUES($1, $2)',
  [name, reservation_id]
  );
  console.log(
    `Restaurant table: \n INSERT INTO Restaurant [ ${name} ] successfully........ ✅`
  );
  }catch(err){
    console.log("Error adding Restaurant : ⚠️", err);  
  }
    
  }

console.log("TESTING RESTAURANT");
console.log("ESTABLISH connection with the database....✅");
client.connect();
console.log("connecting to the database up and running....✅");
client.end();
console.log("database disconnected........❌");