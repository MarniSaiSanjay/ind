const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    stipend:{
        type: Number,
        min: 0,
    },
    
})

module.exports = mongoose.model('Intern', internSchema);