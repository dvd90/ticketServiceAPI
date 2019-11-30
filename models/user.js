const config = require('./../config').tickets;

module.exports = class User {
    constructor(name, password, admin = false) {
        this.name = name;
        this.admin = admin;
        this.password = admin ? config.adminPw : password
    }

    getName() {
        return this.name;
    }

    isAdmin() {
        return this.admin;
    }

    userExist(name, password) {
        return (this.name === name && this.password === password)
    }
}