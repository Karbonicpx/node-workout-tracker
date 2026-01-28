const { Pool } = require('pg');
// Database connected to the native postgresql database in dev machine
const pool = new Pool({
    host: 'localhost',
    port: 4444,
    user: 'postgres',
    password: 'nap1903',
    database: 'node_workout_tracker'
});

module.exports = pool;
