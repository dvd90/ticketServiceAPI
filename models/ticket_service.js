const order = require('./order');
const EventEmitter = require('events');
const config = require('./../config').tickets;
const moment = require('moment');

class TicketService extends EventEmitter {
    constructor(availableTickets) {
        super();
        this.orders = [];
        this.availableTickets = availableTickets;
        this.soldTickets = 0;
        this.logs = `${moment().format('MMMM Do YYYY, h:mm:ss a')} - The Ticket service is open with ${availableTickets} tickets available\n\n`;
    }

    storeOpen() {
        if (this.availableTickets > 0) {
            return true;
        }
        return false;
    }

    addOrder(date, tickets, user) {
        if (tickets <= this.availableTickets) {
            let id = 1;
            if (this.orders.length != 0) {
                id = this.orders[this.orders.length - 1].getId() + 1;
            }
            let ord = new order(id, date, tickets, user);
            this.orders.push(ord);
            this.availableTickets -= tickets;
            this.soldTickets += tickets;
            this.logs += `${moment().format('MMMM Do YYYY, h:mm:ss a')} - A new order has been made by ${ord.getUserName()} of ${tickets} tickets\n`;
            this.logs += `Number of Tickets available: ${this.availableTickets}\n\n`;
            this.emit("Add order", ord);

            return ord;
        }
        this.logs += `${moment().format('MMMM Do YYYY, h:mm:ss a')} - Unsuccessful order request of ${tickets} tickets\n`;
        this.logs += `Number of Tickets available: ${this.availableTickets}\n\n`;

        this.emit("Add order", false);
        return false;
    }

    findOrder(id) {
        return this.orders.find((order) => order.getId() === id);
    }

    deleteOrder(id) {
        const order = this.findOrder(id);
        if (order) {
            this.orders = this.orders.filter((order) => order.getId() != id);
            this.logs += `${moment().format('MMMM Do YYYY, h:mm:ss a')} - An order has been deleted by ${order.getUserName()}\n`;
            this.logs += `Number of Tickets available: ${this.availableTickets}\n\n`;
            this.emit("Delete order", true);

            return true;
        } else {
            this.logs += `${moment().format('MMMM Do YYYY, h:mm:ss a')} - Request to delete an Order was unsuccessful\n`;
            this.logs += `Number of Tickets available: ${this.availableTickets}\n\n`;
            this.emit("Delete order", false);

            return false;
        }
    }

    changeOrder(id, date, tickets) {
        const order = this.findOrder(id);
        if (order) {
            if (tickets <= this.availableTickets + order.nbTickets) {
                if (order.nbTickets != tickets) {
                    this.availableTickets += order.nbTickets;
                    this.soldTickets -= order.nbTickets;
                    this.availableTickets -= tickets;
                    this.soldTickets += tickets;
                    order.setNbTickets(tickets);
                }
                order.setDate(date);
                this.logs += `${moment().format('MMMM Do YYYY, h:mm:ss a')} - A change in order id:${order.getId()}\n`;
                this.logs += `Number of Tickets available: ${this.availableTickets}\n\n`;
                this.emit("Change order", order);

                return true;
            }
        }
        this.logs += `${moment().format('MMMM Do YYYY, h:mm:ss a')} - Request to edit an Order was unsuccessful\n`;
        this.logs += `Number of Tickets available: ${this.availableTickets}\n\n`;
        this.emit("Change order", false);

        return false;
    }

    getAllOrders() {
        this.logs += `${moment().format('MMMM Do YYYY, h:mm:ss a')} - Request to get all the Orders was made by Admin\n`;
        this.logs += `Number of Tickets available: ${this.availableTickets}\n\n`;
        this.emit("Get all orders");

        return this.orders;
    }

    destroyAllOrders() {
        this.orders = [];
        this.availableTickets += this.soldTickets;
        this.soldTickets = 0;
        this.logs += `${moment().format('MMMM Do YYYY, h:mm:ss a')} - Request to destroy all the Orders was made by Admin\n`;
        this.logs += `Number of Tickets available: ${this.availableTickets}\n\n`;
        this.emit("Destroy all orders");

        return true;
    }

    getLogs() {
        this.emit("Get Logs");

        return this.logs;
    }

}
// Emmiter

// Init class with 10 availables tickets
const ticketService = (new TicketService(config.nbTickets))
    .on('Get all orders', () => console.log(`Getting all the orders`))
    .on("Destroy all orders", () => console.log(`Destroying all the orders`))
    .on("Change order", (order) => {
        if (order) {
            console.log(`The order id: ${order.getId()} has been changed...`);
        } else {
            console.log(`Sorry we couldn't change your order 😞`);
        }
    })
    .on("Delete order", (status) => {
        status ? console.log("Order was deleted") : console.log("Order wasn't deleted")
    })
    .on("Add order", (order) => {
        if (order) {
            console.log(`The order id: ${order.getId()} has been created...`);
        } else {
            console.log(`Sorry we couldn't add your order 😞`);
        }
    })
    .on('Get Logs', () => console.log(`Getting Logs`))


module.exports = ticketService;