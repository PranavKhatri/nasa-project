// schema for launches

// default: for the very first document we create, required it is needed.

// ref is referring some collection name planet
// target :{
//     type: mongoose.isObjectIdOrHexString,
//     ref : 'Planet',
// }

const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
        default: 100,
        min: 100,
        max: 209,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },
    target :{
        type: String,
    },
    upcoming:{
        type: Boolean,
        required: true,
    },
    success: {
        type: Boolean,
        required: true,
        default: true,
    },
    customers: [ String ],
    source: {
        type: String,
        required: true,
    }

});

// creating model with the above schema.

// mongoose.model(collection_name, schema_name)

module.exports = mongoose.model('Launch', launchesSchema); // compiling the model

// collection_name is taken by the mongoose and collection of name  "collection_names" is made.
// In plural because they represent many collection_name documents.

// When a model is set to use a schema like this, mongoose calls this statement as compiling the model.