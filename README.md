# The Acme Restaurant
   build a Restaurant RESTful API that calls exported methods from another file.
   
![alt text](img/image.png)
```
            |--------|
            |DATABASE|
            |--------|
  Customer
  id (UUID)
  name (STRING)
----------------
  Restaurant
  id (UUID)
  name (STRING)
------------------
  Reservation
  id (UUID)
  date (DATE NOT NULL)
  party_count (INTEGER NOT NULL)
  restaurant_id (UUID REFERENCES restaurants table NOT NULL)
  customer_id (UUID REFERENCES customer table NOT NULL)
  -----------------------
  restaurant_table
  id(uuID)
  table INTEGER NOT NULL , // 1 TO 30 TABLES
  is_avaible  Boolean  
  reservertation_id (UUID REFERENCES reservation table NOT NULL)
  ```
  
