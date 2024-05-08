const mongoose = require('mongoose');
const { Schema } = mongoose;

// Declare the schema (how the attendance data will be stored)
const attendanceSchema = new Schema({
    enrollment_id: {
        type: String,
        required: true
    },
    course_id: {
        type: String,
        required: true
    },
    student_id: {
        type: String,
        required: true
    },
    student_name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: "absent"
    },
    remarks: {
        type: String,
        default: "No remark"
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Attendance = mongoose.model('attendance', attendanceSchema);
module.exports = Attendance;