const express = require("express");
const router = express.Router();

const Course = require('../model/courses');
const Attendance = require('../model/attendance');
const Enrollment = require('../model/enrollments');
const User = require('../model/users');

const fetchUser = require("../middleware/fetchUser");

const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
}

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 1000);
}

// Route 1 - Create a new attendance with endpoint (PUT : '/attendance')
router.put('/', fetchUser, async (req, res) => {
    try {
        let { course_id, student_id, date, status, location } = req.body;
        date = new Date(date.split("-").reverse().join("-"));

        if (req.user.role === "admin") {
            const enrollment = await Enrollment.findOne({ course_id, student_id });
            if (!enrollment)
                return res.status(404).json({
                    type: "error",
                    message: "Enrollment not found."
                });

            const attendance = await Attendance.findOne({ enrollment_id: enrollment._id, date });
            if (!attendance)
                return res.status(404).json({
                    type: "error",
                    message: "Attendance not found."
                });

            attendance.status = status || attendance.status;
            attendance.remarks = remarks || attendance.remarks;

            await attendance.save();
        } else if (req.user.role === "student") {
            const enrollment = await Enrollment.findOne({ course_id, student_id: req.user.id });
            if (!enrollment)
                return res.status(404).json({
                    type: "error",
                    message: "Enrollment not found."
                });

            const attendance = await Attendance.findOne({ enrollment_id: enrollment._id, date });
            if (attendance)
                return res.status(400).json({
                    type: "error",
                    message: "Attendance already marked."
                });

            const course = await Course.findById(enrollment.course_id);
            if (!course)
                return res.status(404).json({
                    type: "error",
                    message: "Course not found."
                });

            const distance = getDistanceFromLatLonInKm(course.location.latitude, course.location.longitude, location.latitude, location.longitude);
            status = (distance > 100) && "absent" || "present";
            remarks = (distance > 100) && "Outside the class" || "";

            await Attendance.create({
                enrollment_id: enrollment._id,
                course_id: course._id,
                student_id: req.user.id,
                student_name: req.user.name,
                date,
                status,
                remarks
            });

            if (distance > 100)
                return res.status(400).json({
                    type: "error",
                    message: "You are outside the class."
                });
        } else {
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Attendance updated successfully.",
        });
    } catch (err) {
        return res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
});

// Route 2 - Get all attendance with endpoint (GET : '/attendance')
router.get('/', fetchUser, async (req, res) => {
    try {
        let item;
        if (req.user.role === "admin") {
            // Get all attendance
            item = await Attendance.find().populate('enrollment_id');
        } else if (req.user.role === "faculty") {
            // Get all attendance of this faculty
            const courses = await Course.find({ faculty_id: req.user.id });
            const enrollments = await Enrollment.find({ course_id: courses.map(course => course._id) });
            item = await Attendance.find({ enrollment_id: enrollments.map(enrollment => enrollment._id) }).populate('enrollment_id');
        } else {
            // Get all attendance of this student
            const enrollments = await Enrollment.find({ student_id: req.user.id });
            item = await Attendance.find({ enrollment_id: enrollments.map(enrollment => enrollment._id) }).populate('enrollment_id');
        }

        if (item.length === 0)
            return res.status(404).json({
                type: "error",
                message: "No attendance found.",
                data: []
            });

        return res.status(200).json({
            type: "success",
            message: "Attendance fetched successfully.",
            data: item
        });
    } catch (err) {
        return res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
});

// ROUTE 3 - Delete the attendance with endpoint (DELETE : '/attendance/:id')
router.delete('/:id', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        const attendance = await Attendance.findByIdAndDelete(req.params.id);
        if (!attendance)
            return res.status(404).json({
                type: "error",
                message: "Attendance not found."
            });

        return res.status(200).json({
            type: "success",
            message: "Attendance deleted successfully.",
        });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

module.exports = router;