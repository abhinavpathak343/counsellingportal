require("dotenv").config();
const express = require("express");
const app = express();
const config = require("./config.json");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const {
    OAuth2Client
} = require("google-auth-library");
const client = new OAuth2Client("1098238898472-he2l97jflu50j4sn82ro2bu44nc7rkja.apps.googleusercontent.com"); // Use the same client ID as in your frontend

// Allow all origins
app.use(cors());
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ?
        ['https://your-production-domain.com'] // Replace with your production URL
        :
        ['http://localhost:5173'], // Development URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Define allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Define allowed headers
    credentials: true, // Enable credentials if needed
};

app.use(cors(corsOptions));


app.get("/", (req, res) => {
    res.send("CORS enabled for all origins");
});

const {
    authenticateJwt
} = require("./utilities");

// MongoDB Connection
mongoose
    .connect(config.connectionString)
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));

const SECRET = process.env.SECRET;

app.use(express.json());

// Models
const User = require("./models/user.models");
const Admin = require("./models/admin.models");
const Student = require("./models/student.models"); // Import Student model

// User Signup
app.post("/users/signup", async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        const user = await User.findOne({
            username
        });
        if (user) {
            return res.status(403).json({
                message: "User already exists"
            });
        }

        const newUser = new User({
            username,
            password
        });
        await newUser.save();

        const token = jwt.sign({
            username,
            role: "user"
        }, SECRET, {
            expiresIn: "1h"
        });

        res.json({
            message: "User created successfully",
            token
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});

app.post("/students/:studentId/assignBranch", async (req, res) => {
    const {
        studentId
    } = req.params;
    const {
        branch
    } = req.body;

    try {
        const student = await Student.findByIdAndUpdate(
            studentId, {
                assignedBranch: branch
            }, {
                new: true
            } // Return the updated document
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found."
            });
        }

        res.status(200).json({
            message: "Branch assigned successfully.",
            student,
        });
    } catch (error) {
        console.error("Error assigning branch:", error);
        res.status(500).json({
            message: "Failed to assign branch.",
            error: error.message,
        });
    }
});

// Admin Login
app.post("/admin/login", async (req, res) => {
    const {
        username,
        password
    } = req.headers;

    try {
        const admin = await Admin.findOne({
            username,
            password
        });
        if (admin) {
            const token = jwt.sign({
                username,
                role: "admin"
            }, SECRET, {
                expiresIn: "1h"
            });
            return res.json({
                message: "Logged in successfully",
                token
            });
        } else {
            return res.status(403).json({
                message: "Invalid username or password"
            });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});




app.get("/students/assignedbranch/:id", async (req, res) => {
    const {
        id
    } = req.params;

    try {
        // Find student by ID
        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Return the assigned branch
        res.status(200).json({
            assignedBranch: student.assignedBranch
        });
    } catch (error) {
        console.error("Error fetching assigned branch:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

// Add this route to check for existing student by userId




// Add this route to check for existing student by userId
//: POST /students - Save Student Information
// Add this validation middleware
// Update these routes in your index.js

// Get student by userId
app.get("/students/user/:userId", async (req, res) => {
    try {
        const {
            userId
        } = req.params;
        console.log("Finding student with userId:", userId);

        const student = await Student.findOne({
            userId: userId.toString()
        });

        if (!student) {
            console.log("No student found for userId:", userId);
            return res.status(404).json({
                message: "No student found for this user",
                student: null,
            });
        }

        res.status(200).json({
            message: "Student found",
            student,
        });
    } catch (error) {
        console.error("Error finding student:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});

// Create new student
app.post("/students", async (req, res) => {
    try {
        const {
            userId,
            fullName,
            dateOfBirth,
            highSchoolMarks,
            intermediateMarks,
            branchPreferences,
        } = req.body;

        console.log("Received student data:", {
            userId,
            fullName,
            dateOfBirth,
            highSchoolMarks,
            intermediateMarks,
            branchPreferences,
        });

        // Check if student already exists
        const existingStudent = await Student.findOne({
            userId: userId.toString()
        });
        if (existingStudent) {
            return res.status(400).json({
                message: "A student record already exists for this user"
            });
        }

        // Create new student document
        const newStudent = new Student({
            userId: userId.toString(), // Ensure userId is stored as string
            fullName,
            dateOfBirth,
            highSchoolMarks,
            intermediateMarks,
            branchPreferences,
        });

        await newStudent.save();

        res.status(201).json({
            message: "Student information saved successfully",
            student: newStudent,
        });
    } catch (error) {
        console.error("Server error saving student:", error);
        res.status(500).json({
            message: "Failed to save student information",
            error: error.message,
        });
    }
});

// Get assigned branch
app.get("/students/assignedbranch/:id", async (req, res) => {
    const {
        id
    } = req.params;

    try {
        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            assignedBranch: student.assignedBranch
        });
    } catch (error) {
        console.error("Error fetching assigned branch:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});
app.post("/users/login", async (req, res) => {
    try {
        const {
            username,
            password
        } = req.headers;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required in headers"
            });
        }

        const user = await User.findOne({
            username,
            password
        });

        if (!user) {
            return res.status(403).json({
                message: "Invalid username or password"
            });
        }

        // Debugging: Log the user document
        console.log("User found:", user);

        const token = jwt.sign({
                username: user.username,
                role: "user"
            },
            SECRET, {
                expiresIn: "24h"
            }
        );

        // Send both token and userId in response
        res.status(200).json({
            message: "Login successful",
            token,
            userId: user._id, // This should always exist
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});



// Fetch all students without sorting

app.get('/students', async (req, res) => {
    try {
        const students = await Student.find(); // Fetch all students from the database
        res.status(200).json(students); // Return the students data as JSON
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            message: 'Error fetching students',
            error: error.message,
        });
    }
});

app.post("/google-signup", async (req, res) => {
    const {
        email,
        name,
        googleId
    } = req.body;

    if (!email || !googleId) {
        return res.status(400).json({
            message: "Email and Google ID are required"
        });
    }

    try {
        // Check if the user already exists
        let user = await User.findOne({
            googleId
        });
        if (!user) {
            // Create a new user if one doesn't exist
            user = await User.create({
                email,
                name,
                googleId
            });
        }

        // Respond with success
        res.status(200).json({
            message: "Google signup successful",
            user
        });
    } catch (error) {
        console.error("Error handling Google signup:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});


// Update the google-auth route in index.js
app.post("/google-auth", async (req, res) => {
    const {
        email,
        name,
        googleId,
        operation
    } = req.body;

    if (!googleId || !operation) {
        return res.status(400).json({
            message: "Google ID and operation type are required"
        });
    }

    try {
        if (operation === "login") {
            let user = await User.findOne({
                googleId
            });

            if (!user) {
                return res.status(404).json({
                    message: "Account does not exist. Please sign up first."
                });
            }

            const token = jwt.sign({
                    userId: user._id,
                    googleId: user.googleId
                },
                SECRET, {
                    expiresIn: "1h"
                }
            );

            return res.status(200).json({
                message: "Login successful",
                user: {
                    ...user.toObject(),
                    googleId: user.googleId // Ensure googleId is included
                },
                token
            });
        }

        if (operation === "signup") {
            let user = await User.findOne({
                googleId
            });
            if (!user) {
                user = await User.findOne({
                    email
                });
            }
            if (!user) {
                user = await User.create({
                    email,
                    name,
                    googleId
                });
            }

            const token = jwt.sign({
                    userId: user._id,
                    googleId: user.googleId
                },
                SECRET, {
                    expiresIn: "1h"
                }
            );

            res.status(200).json({
                message: "Signup successful",
                user: {
                    ...user.toObject(),
                    googleId: user.googleId
                },
                token
            });
        }
    } catch (error) {
        console.error("Error handling Google authentication:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});


// Server Listening
app.listen(8000, () => {
    console.log("Server running on port 8000");
});


module.exports = app;