# Ticket Service API

#### _For more infos on the documentation website_

https://documenter.getpostman.com/view/7216674/SWDzeM4W

#### _Link to the deployed Heroku Website_

https://rocky-shelf-76247.herokuapp.com/

# Introduction

This is an Api that provide a http interface in order to book tickets for the Lady Gaga live show in Tel Aviv.

# Overview

## There are 6 calls available:

### _If you want to book a new order_

#### POST:

**/addNewOrder**

- Query Params: name, password REQUIRED
- Body(JSON): exemple {"nbtickets": 1} REQUIRED

### _If you want to edit an order_

#### PUT:

**/editOrder**

- Query Params: id, tickets(nb of tickets) REQUIRED

### _If you want to edit an order_

#### DELETE:

**/cancelOrder**

- Query Params: id REQUIRED

# **_ADMIN ONLY_**

### _If you want a list of all the orders_

#### GET:

**/getAllOrders**

- Query Params: name, password REQUIRED

### _If you want the session logs_

#### GET:

**/logs**

- Query Params: name, password REQUIRED

### _If you want to reset and destroy all the orders_

#### DELETE:

**/resetAllOrders**

- Query Params: name, password REQUIRED

# Authentication

The Authentication of the user is made by "Query Params" name, password

_example:_

- /addNewOrder?name=[nameoftheuser]&password=[password]

# Error Codes

- **400** -> For bad request Query missing etc ...
- **401** -> Authorization
- **404** -> Path doesn't exist

Thanks
