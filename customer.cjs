const client = require('./client.cjs');

const addCustomer = async (name) => {
  try {
    const result = await client.query('INSERT INTO customer(name) VALUES($1) RETURNING id', [name]);
    console.log(`Customer table: INSERT INTO Customer [ ${name} ] successfully........ ✅`);
    return result.rows[0].id;
  } catch (err) {
    console.log("Error adding Customer : ⚠️", err);  
  }
};

module.exports = { addCustomer };
