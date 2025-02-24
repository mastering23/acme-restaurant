const client = require("./client.cjs");

const addReservation = async (
  resv_date,
  party_count,
  customer_id,
  restaurant_id
) => {
  try {
    await client.query(
      "INSERT INTO reservation (date, party_count, customer_id, restaurant_id) VALUES($1, $2, $3, $4)",
      [resv_date, party_count, customer_id, restaurant_id]
    );
    console.log(
      `Reservation table : INSERT INTO reservation :\n
     Id : [ ${customer_id} ]\n
     Party of : [ ${party_count} ]\n 
     Date reserved : [ ${resv_date} ]\n
     successfully........ ✅`
    );
  } catch (err) {
    console.log("Error adding Reservation : ⚠️", err);
  }
};

// console.log("TESTING RESERVATION");
// console.log("ESTABLISH connection with the database....✅");
// client.connect();
// console.log("connecting to the database up and running....✅");
// client.end();
// console.log("database disconnected........❌");|

module.exports = { addReservation };
