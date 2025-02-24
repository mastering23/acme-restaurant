const client = require("./client.cjs");

const addRestaurantTable = async () => {
  try {
    await client.query(
      "INSERT INTO restaurant_table(table_number,is_avaible,reservation_id) VALUES($1, $2, $5)",
      [table_number, is_avaible, reservation_id]
    );
    console.log(
      `Restaurant [ table ]  table: INTO Restaurant table \n
    Table number :[ ${table_number} ]\n
    AVaible : [ ${is_avaible} ]\n
    Reservation ID : [ ${reservation_id} ]\n    
    successfully........ ✅`
    );
  } catch (err) {
    console.log("Error adding Restaurant Table : ⚠️", err);
  }
};

// console.log("TESTING RESTAURANT TABLE");
// console.log("ESTABLISH connection with the database....✅");
// client.connect();
// console.log("connecting to the database up and running....✅");
// client.end();
// console.log("database disconnected........❌");

module.exports = { addRestaurantTable };
