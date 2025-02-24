const client = require("./client.cjs");
const { addCustomer } = require("./customer.cjs");
const { addReservation } = require("./reservation.cjs");
const { addRestaurantTable } = require("./restaurant_table.cjs");
const { addRestaurant } = require("./restaurant.cjs");

const createTables = async () => {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS customer (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(60) NOT NULL
      );
    `);
    console.log("Table created [CUSTOMER] successfully....✅");

    await client.query(`
      CREATE TABLE IF NOT EXISTS restaurant (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(60) NOT NULL
      );
    `);
    console.log("Table created [RESTAURANT] successfully....✅");

    await client.query(`
      CREATE TABLE IF NOT EXISTS reservation (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        table_number INTEGER NOT NULL,
        restaurant_id UUID REFERENCES restaurant(id) ON DELETE CASCADE,
        customer_id UUID REFERENCES customer(id) ON DELETE CASCADE
      );
    `);
    console.log("Table created [RESERVATION] successfully....✅");

    await client.query(`
      CREATE TABLE IF NOT EXISTS restaurant_table (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        table_number INTEGER NOT NULL,
        restaurant_id UUID REFERENCES restaurant(id) ON DELETE CASCADE
      );
    `);
    console.log("Table created [RESTAURANT_TABLE] successfully....✅");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

const showAllReservations = async () => {
  return await client.query(`
    SELECT 
      customer.name AS customer_name, 
      restaurant.name AS restaurant_name, 
      reservation.date, 
      reservation.party_count
    FROM reservation
    JOIN customer ON reservation.customer_id = customer.id
    JOIN restaurant ON reservation.restaurant_id = restaurant.id;
  `);
};

const clearTables = async () => {
  await client.query(`DELETE FROM restaurant`);
  await client.query(`DELETE FROM customer`);
  await client.query(`DELETE FROM reservation`);
  await client.query(`DELETE FROM restaurant_table`);
};

const dropTables = async () => {
  await client.query(`DROP TABLE reservation`);
  await client.query(`DROP TABLE customer`);
  await client.query(`DROP TABLE restaurant_table`);
  await client.query(`DROP TABLE restaurant`);
};

const findRestaurant = async (restaurantName) => {
  return (
    await client.query(`SELECT id FROM restaurant WHERE name = $1`, [
      restaurantName,
    ])
  ).rows;
};

const findReservation = async (restaurantId, date, tableNumber) => {
  return (
    await client.query(
      `SELECT * FROM reservation WHERE restaurant_id = $1 AND date = $2 AND table_number = $3`,
      [restaurantId, date, tableNumber]
    )
  ).rows;
};

const getTables = async (restaurantId) => {
  return (
    await client.query(
      `SELECT * FROM restaurant_table WHERE restaurant_id = $1`,
      [restaurantId]
    )
  ).rows.map((tableObj) => tableObj.table_number);
};

const createReservation = async (
  customerName,
  restaurantName,
  date,
  partyCount
) => {
  // STEP 1: check if the restaurant exist; else log error

  const restaurants = await findRestaurant(restaurantName);
  if (restaurants.length === 0) {
    console.error(
      `Error: Unable to create reservation for '${customerName}'. Reason: restaurant: '${restaurantName}' does not exist`
    );
    return null;
  }

  let restaurantId = restaurants[0].id;

  // GET THE LIST OF tables of the restaurant
  const tableNumberList = await getTables(restaurantId);

  for (let i = 0; i < tableNumberList.length; i++) {
    // STEP 2: check if the restaurant is reserved for the given date; else create reservation
    const reservations = await findReservation(
      restaurantId,
      date,
      tableNumberList[i]
    );
    if (reservations.length !== 0) {
      continue;
    }

    const customerId = await addCustomer(customerName);
    return await addReservation(date, partyCount, customerId, restaurantId, tableNumberList[i]);
  }

  console.log(
    `Sorry ${customerName}, no tables available for date: ${date} on restaurant: ${restaurantName}`
  );
};

const seedAsync = async () => {
  try {
    console.log("ESTABLISH connection with the database....✅");
    await client.connect();
    console.log("Connecting to the database up and running....✅");
    await createTables();

    const restaurantId = await addRestaurant("Grand Mexican Tacos");
    await addRestaurantTable(1, restaurantId);
    await addRestaurantTable(2, restaurantId);
    await addRestaurantTable(3, restaurantId);


    // TEST 1: Perter Parker, Laura Bobberson, and John Wilson should be able to reserve tables:
    //         Bob Wilmenr, however, won't be able to reserve on the same date as there is no more tables available
    //         Clare Rodriguez is able to reserve tables on a different date.

    await createReservation(
      "Peter Parker",
      "Grand Mexican Tacos",
      "2025-02-28",
      3
    );

    await createReservation(
      "Laura Bobberson",
      "Grand Mexican Tacos",
      "2025-02-28",
      5
    );

    await createReservation(
      "John Wilson",
      "Grand Mexican Tacos",
      "2025-02-28",
      2
    );

    await createReservation(
      "Bob Wilmer",
      "Grand Mexican Tacos",
      "2025-02-28",
      2
    );

    await createReservation(
      "Clare Rodriguez",
      "Grand Mexican Tacos",
      "2025-03-01",
      2
    );

    await dropTables();
  } catch (error) {
    console.error("Error in seeding process:", error);
  } finally {
    await client.end();
    console.log("Database disconnected........❌");
  }
};

seedAsync();

module.exports = { createReservation };
