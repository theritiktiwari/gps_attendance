const mongoose = require('mongoose');
const { Schema } = mongoose;

// Declare the schema (how the enrollment data will be stored)
const enrollmentSchema = new Schema({
    student_id: {
        type: String,
        required: true
    },
    course_id: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Enrollment = mongoose.model('enrollment', enrollmentSchema);
module.exports = Enrollment;