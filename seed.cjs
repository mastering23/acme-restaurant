const client = require("./client.cjs");

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

const seedAsync = async () => {
 
  console.log("ESTABLISH connection with the database....✅");

  await client.connect();
  console.log("connecting to the database up and running....✅");

  await createTables();

  await client.end();

  console.log("database disconnected........❌");
};

seedAsync();
