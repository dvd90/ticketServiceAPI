const user = require('./user');
const config = require('./../config').tickets;
const fs = require('fs');

module.exports = class UserRepository {
    constructor() {
        this.path = './data/users.json';
        this.users = [];
        this.load();
    }

    load() {
        try {
            const dataBuffer = fs.readFileSync(this.path);
            const dataJSON = JSON.parse(dataBuffer);
            dataJSON.forEach(u => {
                this.users.push(new user(u.name, u.password, u.admin))
            });
        } catch (e) {
            console.log(e);
            return false
        }
    }

    save() {
        const dataJSON = JSON.stringify(this.users);
        fs.writeFileSync(this.path, dataJSON)
    }

    addUser(name, password) {
        this.users.push(new user(name, password));
        this.save();
        return this.users[this.users.length - 1];
    }

    checkUser(name, password) {
        const found = this.users.find((user) => user.userExist(name, password));
        return found ? found : false;
    }

    checkUserAdmin(name, password) {
        const found = this.users.find((user) => user.userExist(name, password));
        if (found) {
            return found.isAdmin();
        }
        return false;
    }
}
