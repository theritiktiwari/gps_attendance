const mongoose = require('mongoose');
const { Schema } = mongoose;

// Declare the schema (how the cousre data will be stored)
const courseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    faculty_id: {
        type: String,
        required: true
    },
    location:{
        latitude:{
            type: String,
            required: true
        },
        longitude:{
            type: String,
            required: true
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Course = mongoose.model('course', courseSchema);
module.exports = Course;