const tickets = require('./models/ticket_service');
const userRepo = require('./models/user_repo');
const config = require('./config').tickets;
const moment = require('moment');

const badRequest = (req, res) => {
    console.log(`url ${req.urlObject.path} not exist!`);
    res.writeHeader(404);
    res.write('Bad request');
    res.end();
}

const GetOrders = (req, res, user_repo) => {
    // Authentication
    const admin = user_repo.checkUserAdmin(req.urlObject.query.name, req.urlObject.query.password);
    if (admin) {
        const all = JSON.stringify(tickets.getAllOrders());
        res.writeHeader(200);
        res.end(all);
    } else {
        res.writeHeader(401);
        res.end("Sorry but you don't have the authorisation ✋");
    }
}

const AddOrder = (req, res, user_repo) => {
    const user = user_repo.checkUser(req.urlObject.query.name, req.urlObject.query.password);
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const payload = JSON.parse(body);
        if (user) {
            const done = tickets.addOrder(moment().format('DD-MM-YYYY'), payload.nbtickets, user);
            if (done) {
                res.writeHeader(200);
                res.end(`Your order is confirmed 🎉\nYour Id is: ${done.getId()}`);
            }
        } else if (req.urlObject.query.name && req.urlObject.query.password) {
            console.log("herrererere")
            const new_user = user_repo.addUser(req.urlObject.query.name, req.urlObject.query.password)
            const done = tickets.addOrder(moment().format('DD-MM-YYYY'), payload.nbtickets, new_user);
            if (done) {
                res.writeHeader(200);
                res.end(`Your order is confirmed 🎉\nWe've created a new user with the name: ${new_user.getName()}\nYour Id is: ${done.getId()}`);
            }
        }
        res.end(`Unfortunately we can't confirm you order 😒`);
    });
}

const EditOrder = (req, res) => {
    if (tickets.changeOrder(parseInt(req.urlObject.query.id), moment().format('DD-MM-YYYY'), parseInt(req.urlObject.query.id))) {
        res.end(`The order id: ${req.urlObject.query.id} was successfully edited 💣`);
    } else {
        res.writeHeader(400);
        res.end(`Sorry ${req.urlObject.query.id} is not an existing order id, try again 😔`);
    }
}

const ResetOrders = (req, res, user_repo) => {
    const admin = user_repo.checkUserAdmin(req.urlObject.query.name, req.urlObject.query.password);
    if (admin) {
        tickets.destroyAllOrders();
        res.writeHeader(200);
        res.end("All the Orders are destroyed ☠️");
    } else {
        res.writeHeader(401);
        res.end("Sorry but you don't have the authorisation ✋");
    }
}

const CancelOrder = (req, res) => {
    console.log('/cancelOrder  called!');
    if (tickets.deleteOrder(parseInt(req.urlObject.query.id))) {
        res.writeHeader(200);
        res.end(`The order id: ${req.urlObject.query.id} was successfully deleted 💣`);
        console.log(tickets.getAllOrders());
    } else {
        res.writeHeader(400);
        res.end(`Sorry ${req.urlObject.query.id} is not an existing order id, try again 😔`);
    }
}

module.exports = {
    GetOrders,
    AddOrder,
    badRequest,
    EditOrder,
    ResetOrders,
    CancelOrder
};
