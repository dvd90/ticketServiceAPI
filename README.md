# Ticket Service API


# Introduction
This is an Api that provide a http interface in order to book tickets for the Lady Gaga live show in Tel Aviv.

# Overview
## There are 6 calls available:

### *If you want to book a new order*
#### POST:
**/addNewOrder**
- Query Params: name, password REQUIRED
- Body(JSON): exemple {"nbtickets": 1} REQUIRED

### *If you want to edit an order*
#### PUT:
**/editOrder**
- Query Params: id, tickets(nb of tickets) REQUIRED


### *If you want to edit an order*
#### DELETE:
**/cancelOrder**
- Query Params: id REQUIRED


# ***ADMIN ONLY***


### *If you want a list of all the orders*
#### GET:
**/getAllOrders**
- Query Params: name, password REQUIRED

### *If you want the session logs*
#### GET:
**/logs**
- Query Params: name, password REQUIRED

### *If you want to reset and destroy all the orders*
#### DELETE:
**/resetAllOrders**
- Query Params: name, password REQUIRED

# Authentication
The Authentication of the user is made by "Query Params" name, password

*example:*
- /addNewOrder?name=[nameoftheuser]&password=[password]

# Error Codes
- **400** -> For bad request Query missing etc ...
- **401** -> Authorization
- **404** -> Path doesn't exist