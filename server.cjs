const express = require('express');
const app = express();
const client = require('./client.cjs');
const { addCustomer } = require("./customer.cjs");
const { addReservation } = require("./reservation.cjs");
const { addRestaurantTable } = require("./restaurant_table.cjs");
const { addRestaurant } = require("./restaurant.cjs");
const { createReservation } = require("./seed.cjs");

client.connect();

app.use(express.json());

app.get('/api/v1/',async (req, res) => {
  res.send('WELCOME TO RESTAURANT EVENTS ACME');
});


app.post('/api/v1/reservation', async (req, res) => {
  const { customerName, restaurantName, date, partyCount } = req.body;
  const result = await createReservation(customerName, restaurantName, date, partyCount);
  
  if(!result) {
    res.status(400).send("Unable to create");
  } else {
    res.status(201).send(result);
  }
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});