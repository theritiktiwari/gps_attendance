const express = require("express");
const router = express.Router();

const User = require('../model/users');
const Course = require('../model/courses');
const Enrollment = require('../model/enrollments');

const fetchUser = require("../middleware/fetchUser");

// Route 1 - Create a new course with endpoint (POST : '/course')
router.post('/', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "faculty")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        const { name, id, location } = req.body;

        if (!name)
            return res.status(400).json({
                type: "error",
                message: "Please fill the name of the course."
            });

        if (req.user.role === "admin" && !id)
            return res.status(400).json({
                type: "error",
                message: "Please fill the faculty id."
            });

        if (!location)
            return res.status(400).json({
                type: "error",
                message: "Please allow location access."
            });

        const existCourse = await Course.findOne({
            name,
            faculty_id: req.user.role === "admin" ? id : req.user.id
        });

        if (existCourse)
            return res.status(400).json({
                type: "error",
                message: "Course already exists with this faculty."
            });

        const item = await Course.create({
            name,
            faculty_id: req.user.role === "admin" ? id : req.user.id,
            location
        });

        return res.status(200).json({
            type: "success",
            message: "Course added successfully",
            data: item
        });
    } catch (err) {
        return res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
});

// Route 2 - Get all courses with endpoint (GET : '/courses')
router.get('/', fetchUser, async (req, res) => {
    try {
        let item;
        if (req.user.role === "admin") {
            item = await Course.find();
        } else if (req.user.role === "faculty") {
            item = await Course.find({ faculty_id: req.user.id });
        } else {
            const enrollments = await Enrollment.find({ student_id: req.user.id });
            const courseIds = enrollments.map(enrollment => enrollment.course_id);
            item = await Course.find({ _id: { $in: courseIds } }).select('-location');
        }

        const courses = await Promise.all(item.map(async (course) => {
            const faculty = await User.findById(course.faculty_id);
            return {
                ...course._doc,
                faculty_name: faculty.name
            };
        }));

        if (item.length === 0)
            return res.status(404).json({
                type: "error",
                message: "No courses found.",
                data: []
            });

        return res.status(200).json({
            type: "success",
            message: "Courses fetched successfully",
            data: courses
        });
    } catch (err) {
        return res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
});

// Route 3 - Get course with ID with endpoint (GET : '/courses/:id')
router.get('/:id', fetchUser, async (req, res) => {
    try {
        let item;
        if (req.user.role === "admin") {
            item = await Course.findById(req.params.id);
        } else if (req.user.role === "faculty") {
            item = await Course.find({ _id: req.params.id, faculty_id: req.user.id });
        } else {
            const enrollments = await Enrollment.find({ _id: req.params.id, student_id: req.user.id });
            const courseIds = enrollments.map(enrollment => enrollment.course_id);
            item = await Course.find({ _id: { $in: courseIds } }).select('-location');
        }

        if (item.length === 0)
            return res.status(404).json({
                type: "error",
                message: "No courses found.",
                data: []
            });

        return res.status(200).json({
            type: "success",
            message: "Courses fetched successfully",
            data: item
        });
    } catch (err) {
        return res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
});

// ROUTE 4 - Update the course with endpoint (PUT : '/course/:id')
router.put('/:id', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "faculty")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        const { name, faculty_id, location } = req.body;
        let course;

        if (req.user.role === "admin")
            course = await Course.findById(req.params.id);
        else
            course = await Course.findOne({ _id: req.params.id, faculty_id: req.user.id });

        if (!course)
            return res.status(404).json({
                type: "error",
                message: "Course not found."
            });

        course.name = name || course.name;
        course.faculty_id = (req.user.role === "admin" && faculty_id) ? faculty_id : course.faculty_id;
        course.location = location || course.location;

        await course.save();

        return res.status(200).json({
            type: "success",
            message: "Course updated successfully.",
        });
    } catch (err) {
        return res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 5 - Delete the course with endpoint (DELETE : '/course/:id')
router.delete('/:id', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "faculty")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        let course;
        if (req.user.role === "admin")
            course = await Course.findByIdAndDelete(req.params.id);
        else
            course = await Course.findOneAndDelete({ _id: req.params.id, faculty_id: req.user.id });

        if (!course)
            return res.status(404).json({
                type: "error",
                message: "Course not found."
            });

        // Delete all enrollments of this course
        await Enrollment.deleteMany({ course_id: req.params.id });

        return res.status(200).json({
            type: "success",
            message: "Course deleted successfully."
        });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

module.exports = router;