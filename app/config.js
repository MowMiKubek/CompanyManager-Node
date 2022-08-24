require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    dbURL: process.env.DBURL || 'mongodb://localhost:27017/Node'
}