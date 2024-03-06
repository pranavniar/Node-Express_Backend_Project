const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeShema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    }
});

//by default mongoose will look for the plural version of the model name
module.exports = mongoose.model('Employee', employeeShema);