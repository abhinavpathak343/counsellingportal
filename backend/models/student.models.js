const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userId: {
      type: String, // Changed from ObjectId to String to accommodate Google IDs
      required: true,
      unique: true
  },


    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    highSchoolMarks: {
        math: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        science: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        english: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        hindi: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
    },
    intermediateMarks: {
        physics: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        chemistry: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        maths: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
    },
    branchPreferences: {
        firstChoice: {
            type: String,
            required: true
        },
        secondChoice: {
            type: String,
            required: true
        },
        thirdChoice: {
            type: String,
            required: true
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
      assignedBranch: {
          type: String,
          default: null
      }, // Add this field

});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
