const mongoose = require('mongoose');
const schema = mongoose.Schema;
const schmaName = require('../constants').schemas;

var categorySchema = new schema({

    name: { type: String },
    imageUrl: { type: String }
});
User = module.exports = mongoose.model(schmaName.category, categorySchema)