const order = require('./order');
const EventEmitter = require('events');
const config = require('./../config').tickets;

class TicketService extends EventEmitter {
    constructor(availableTickets) {
        super();
        this.orders = [];
        this.availableTickets = availableTickets;
        this.soldTickets = 0;
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
            this.emit("Add order", ord);

            return ord;
        }
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
            this.emit("Delete order", true);

            return true;
        } else {
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
                this.emit("Change order", order);

                return true;
            }
        }
        this.emit("Change order", false);

        return false;
    }

    getAllOrders() {
        this.emit("Get all orders");

        return this.orders;
    }

    destroyAllOrders() {
        this.emit("Destroy all orders");

        this.orders = [];
        this.availableTickets += this.soldTickets;
        this.soldTickets = 0;
        return true;
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


module.exports = ticketService;