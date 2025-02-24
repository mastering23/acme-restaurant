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
        restaurant_id UUID REFERENCES restaurant(id) ON DELETE CASCADE,
        customer_id UUID REFERENCES customer(id) ON DELETE CASCADE
      );
    `);
    console.log("Table created [RESERVATION] successfully....✅");

    await client.query(`
      CREATE TABLE IF NOT EXISTS restaurant_table (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        table_number INTEGER NOT NULL CHECK (table_number BETWEEN 1 AND 30),
        is_available BOOLEAN DEFAULT true,
        reservation_id UUID REFERENCES reservation(id) ON DELETE SET NULL
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
};

const createReservation = async(customerName, restaurantName, date, partyCount) => {
  const restaurantId = await addRestaurant(restaurantName);
  const customerId = await addCustomer(customerName);
  await addReservation(date, partyCount, customerId, restaurantId);
}

const seedAsync = async () => {
  try {
    console.log("ESTABLISH connection with the database....✅");
    await client.connect();
    console.log("Connecting to the database up and running....✅");
    await createTables();


    await createReservation('John Johnson', 'Acme Italian NYC', '2025-02-28', 5);
    await createReservation('Laura Blake', 'Pizzeria Italiana', '2025-02-28', 8);
    await createReservation('Peter Parker', 'Grand Mexican Tacos', '2025-02-28', 3);

    const result = await showAllReservations();
    
    console.log(
      result.rows.map((reserv) => {
        return {
          customerName: reserv.customer_name,
          restaurantName: reserv.restaurant_name,
          date: reserv.date.toISOString().split("T")[0],
          partySize: reserv.party_count
        };
      })
    );

    await clearTables();
  } catch (error) {
    console.error("Error in seeding process:", error);
  } finally {
    await client.end();
    console.log("Database disconnected........❌");
  }
};

seedAsync();
