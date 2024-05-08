const express = require("express");
const router = express.Router();

const Course = require('../model/courses');
const Enrollment = require('../model/enrollments');
const User = require('../model/users');

const fetchUser = require("../middleware/fetchUser");

// Route 1 - Create a new enrollment with endpoint (POST : '/enrollment')
router.post('/', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        const { students, course_id } = req.body;

        if (!course_id || !students)
            return res.status(400).json({
                type: "error",
                message: "Please fill the correct details."
            });

        const existingEnrollments = await Enrollment.find({
            student_id: { $in: students },
            course_id
        });

        if (existingEnrollments.length > 0)
            return res.status(400).json({
                type: "error",
                message: "Student is already enrolled in this course."
            });

        await Enrollment.insertMany(students.map(student => ({ student_id: student, course_id })));

        return res.status(200).json({
            type: "success",
            message: "Student enrolled successfully"
        });
    } catch (err) {
        return res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
});

// Route 2 - Get all enrollments with endpoint (GET : '/enrollments')
router.get('/', fetchUser, async (req, res) => {
    try {
        let item;
        if (req.user.role === "admin") {
            item = await Enrollment.find();
        } else if (req.user.role === "faculty") {
            // Get all courses of this faculty and then get all enrollments of these courses
            const courses = await Course.find({ faculty_id: req.user.id });
            const courseIds = courses.map(course => course._id);
            item = await Enrollment.find({ course_id: { $in: courseIds } }).populate('student_id');
        } else {
            // Get all enrollments of this student
            item = await Enrollment.find({ student_id: req.user.id }).populate('course_id');
        }

        let newEnrollments = [];
        // add course name and faculty name to each enrollment
        for (let i = 0; i < item.length; i++) {
            const course = await Course.findById(item[i].course_id);
            const faculty = await User.findById(course.faculty_id);
            const student = await User.findById(item[i].student_id);
            newEnrollments.push({
                ...item[i]._doc,
                course_name: course.name,
                faculty_name: faculty.name,
                student_name: student.name
            });
        }

        if (item.length === 0)
            return res.status(404).json({
                type: "error",
                message: "No enrollments found.",
                data: []
            });

        return res.status(200).json({
            type: "success",
            message: "Enrollments fetched successfully",
            data: newEnrollments
        });
    } catch (err) {
        return res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
});

// ROUTE 3 - Update the enrollment with endpoint (PUT : '/enrollment/:id')
router.put('/:id', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "faculty")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        const { student_id, course_id } = req.body;

        const existEnrollment = await Enrollment.findOne({ student_id, course_id });
        if (existEnrollment)
            return res.status(400).json({
                type: "error",
                message: "Student is already enrolled in this course."
            });

        const enrollment = await Enrollment.findById(req.params.id);
        if (!enrollment)
            return res.status(404).json({
                type: "error",
                message: "Enrollment not found."
            });

        enrollment.student_id = student_id || enrollment.student_id;
        enrollment.course_id = course_id || enrollment.course_id;

        await enrollment.save();

        return res.status(200).json({
            type: "success",
            message: "Enrollment updated successfully.",
        });
    } catch (err) {
        return res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 4 - Delete the enrollment with endpoint (DELETE : '/enrollment/:id')
router.delete('/', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        const { ids } = req.body;

        if (!ids)
            return res.status(400).json({
                type: "error",
                message: "Please fill the correct details."
            });

        let enrollment = await Enrollment.deleteMany({ _id: { $in: ids } });
        if (!enrollment)
            return res.status(404).json({
                type: "error",
                message: "Enrollment not found."
            });

        return res.status(200).json({
            type: "success",
            message: "Enrollment deleted successfully."
        });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

module.exports = router;