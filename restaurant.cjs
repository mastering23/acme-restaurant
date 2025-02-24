const client = require('./client.cjs');

const addRestaurant = async (name) => {
  try {
    const result = await client.query('INSERT INTO restaurant(name) VALUES($1) RETURNING id', [name]);
    console.log(`Restaurant table: INSERT INTO Restaurant [ ${name} ] successfully........ ✅`);
    return result.rows[0].id;
  } catch (err) {
    console.log("Error adding Restaurant : ⚠️", err);
  }
};

module.exports = { addRestaurant };
