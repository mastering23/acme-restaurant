const client = require("./client.cjs");

const addRestaurantTable = async (tableNumber, restaurantId) => {
  try {
    await client.query(
      "INSERT INTO restaurant_table (table_number, restaurant_id) VALUES($1, $2)",
      [tableNumber, restaurantId]
    );
    console.log(
      `Restaurant [ table ]  table: INTO Restaurant table \n
    Table number :[ ${tableNumber} ]\n
    Restaurant ID : [ ${restaurantId} ]\n    
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
