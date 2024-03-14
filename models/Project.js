// schema for Project model

const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({

    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    clientID: {
        type: String,
        required: true,
    },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;

