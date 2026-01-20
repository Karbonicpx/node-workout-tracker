
const User = require('../utils/userObj');
const admin = new User(1, 'admin', 'admin@example.com', '123');
const users = [ admin.toJSON() ];
console.log(`\nInitial users: ${JSON.stringify(users)}`);


module.exports = users;