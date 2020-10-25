var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var schema = new Schema({
    message: String,
    name:String,
    timestamp:String,
    received:Boolean,
})
module.exports = mongoose.model('messagedetails',schema)
