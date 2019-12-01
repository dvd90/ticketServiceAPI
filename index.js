const http = require('http');
const controller = require('./controller');
const port = process.env.PORT || 3000;
const chalk = require('chalk');

const server = http.createServer(controller);

console.log(chalk.underline.blue("Welcome to Shenkar wonderful Ticket Service for the Lady Gaga live show 🔥"));
console.log(chalk.yellow("\nWaiting for API calls..."));

server.listen(port, () => console.log(`listening on port ${port}`));
