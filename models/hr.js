const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const hrSchema = new Schema({
    username:{
        type: String
    },
    hrEmail:{
        type: String,
    },
    infs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Intern'
    }],
    jnfs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }]

})

hrSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Hr', hrSchema);