const client =require('./client.cjs');


const addCustomer = async (name,reservation_id) =>{
try{
await client.query('INSERT INTO customer (name,reservation_id) VALUES($1, $2)',
[name, reservation_id]
);
console.log(
  `Customer table: \n INSERT INTO Customer [ ${name} ] successfully........ ✅`
);
}catch(err){
  console.log("Error adding Customer : ⚠️", err);  
}
  
}

// const fetchAllCustomer = () =>{
  
// }

// const updateCustomer = () =>{
  
// }


// const deleteCustomer = () =>{
  
// }


console.log("TESTING CUSTOMER");
console.log("ESTABLISH connection with the database....✅");
client.connect();
console.log("connecting to the database up and running....✅");
client.end();
console.log("database disconnected........❌");