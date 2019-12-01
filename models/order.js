module.exports = class Order {
    constructor(id, date, nbTickets, user) {
        this.id = id;
        this.date = date;
        this.nbTickets = nbTickets;
        this.user = user;
    }

    getId() {
        return this.id;
    }

    getNbTickets() {
        return this.nbTickets;
    }

    setDate(new_date) {
        this.date = new_date;
    }

    setUser(new_user) {
        this.user = new_user;
    }

    setNbTickets(nb) {
        this.nbTickets = nb;
    }

    getUserName() {
        return this.user.getName();
    }
}