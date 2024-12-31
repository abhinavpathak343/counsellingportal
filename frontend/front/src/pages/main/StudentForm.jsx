"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";

export default function StudentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [assignedBranch, setAssignedBranch] = useState(null);
  const [isFetching, setIsFetching] = useState(true); // Start as true for initial fetch
  const [studentId, setStudentId] = useState(null);
  const [existingStudent, setExistingStudent] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    math: "",
    science: "",
    english: "",
    hindi: "",
    physics: "",
    chemistry: "",
    maths: "",
    firstChoice: "Select",
    secondChoice: "Select",
    thirdChoice: "Select",
  });

  const branchOptions = [
    "Select",
    "Computer Science",
    "Electronics",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
  ];

  // Check if student exists with current userId
  useEffect(() => {
    const checkExistingStudent = async () => {
      const userId = localStorage.getItem("userId");
      console.log("userId from localStorage:", localStorage.getItem("userId"));

      try {
        const response = await axios.get(
          `http://localhost:8000/students/user/${userId}`
        );
        if (response.data && response.data.student) {
          setExistingStudent(response.data.student);
          setStudentId(response.data.student._id);
          setIsSubmitted(true);
          fetchBranchInfo(response.data.student._id);
        } else {
          setExistingStudent(null); // Explicitly set no existing student
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log("Student not found for userId:", userId);
          setExistingStudent(null); // No student record, show form
        } else {
          console.error("Unexpected error:", error);
        }
      } finally {
        setIsFetching(false);
      }
    };

    checkExistingStudent();
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.dob &&
      formData.math &&
      formData.science &&
      formData.english &&
      formData.hindi &&
      formData.physics &&
      formData.chemistry &&
      formData.maths &&
      formData.firstChoice !== "Select" &&
      formData.secondChoice !== "Select" &&
      formData.thirdChoice !== "Select"
    );
  };

  const fetchBranchInfo = async (id) => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/students/assignedbranch/${id}`
      );
      if (response.data) {
        setAssignedBranch(response.data.assignedBranch || null);
      } else {
        setAssignedBranch(null);
      }
    } catch (error) {
      console.error(
        "Error fetching branch info:",
        error.response || error.message
      );
      setAssignedBranch(null);
    } finally {
      setIsFetching(false);
    }
  };

  // ... previous imports remain the same

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userId = localStorage.getItem("userId");
      console.log("Current userId:", userId); // Debug log

      if (!userId) {
        throw new Error("User ID is missing. Please log in again.");
      }

      // Validate numeric fields
      const numericFields = {
        math: formData.math,
        science: formData.science,
        english: formData.english,
        hindi: formData.hindi,
        physics: formData.physics,
        chemistry: formData.chemistry,
        maths: formData.maths,
      };

      // Check if all marks are between 0 and 100
      for (const [field, value] of Object.entries(numericFields)) {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue < 0 || numValue > 100) {
          throw new Error(`${field} marks must be between 0 and 100`);
        }
      }

      // Validate branch preferences
      if (
        new Set([
          formData.firstChoice,
          formData.secondChoice,
          formData.thirdChoice,
        ]).size !== 3
      ) {
        throw new Error("Please select different branches for each preference");
      }

      const payload = {
        userId,
        fullName: formData.name,
        dateOfBirth: formData.dob,
        highSchoolMarks: {
          math: parseFloat(formData.math),
          science: parseFloat(formData.science),
          english: parseFloat(formData.english),
          hindi: parseFloat(formData.hindi),
        },
        intermediateMarks: {
          physics: parseFloat(formData.physics),
          chemistry: parseFloat(formData.chemistry),
          maths: parseFloat(formData.maths),
        },
        branchPreferences: {
          firstChoice: formData.firstChoice,
          secondChoice: formData.secondChoice,
          thirdChoice: formData.thirdChoice,
        },
      };

      console.log("Submitting payload:", payload); // Debug log

      const response = await axios.post(
        "http://localhost:8000/students",
        payload
      );

      console.log("Server response:", response.data); // Debug log

      const newStudentId = response.data.student._id;
      setStudentId(newStudentId);
      setExistingStudent(response.data.student);
      setIsSubmitted(true);

      await fetchBranchInfo(newStudentId);
    } catch (error) {
      console.error("Detailed error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Show a more specific error message to the user
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while submitting the form";

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the component remains the same

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  // Show loading state
  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Render based on student existence
  if (existingStudent) {
    // Show assigned branch if available
    if (assignedBranch) {
      return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 relative">
          <Button
            onClick={handleLogout}
            className="absolute top-4 left-4 bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </Button>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl z-10 mt-16"
          >
            <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden border border-gray-700">
              <div className="p-8 text-center">
                <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">
                  Your Assigned Branch
                </h2>
                <p className="text-lg text-gray-300">
                  Congratulations! You have been assigned to{" "}
                  <span className="text-teal-400 font-bold">
                    {assignedBranch}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    // Show pending message if branch not assigned
    return (
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 relative">
        <Button
          onClick={handleLogout}
          className="absolute top-4 left-4 bg-red-600 hover:bg-red-700 text-white"
        >
          Logout
        </Button>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl z-10 mt-16"
        >
          <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden border border-gray-700">
            <div className="p-8 text-center">
              <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">
                Branch Assignment Status
              </h2>
              <p className="text-lg text-gray-300">
                Your branch is not assigned yet. Please wait for further
                updates.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show form if no existing student
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 relative">
      <Button
        onClick={handleLogout}
        className="absolute top-4 left-4 bg-red-600 hover:bg-red-700 text-white"
      >
        Logout
      </Button>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl z-10 mt-16"
      >
        <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden border border-gray-700">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">
              Student Information Form
            </h2>
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Form fields */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-teal-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter student's full name"
                    required
                    className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-teal-300">
                    Date of Birth
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Marks */}
              <div className="grid grid-cols-2 gap-6">
                {/* High School Marks */}
                <div>
                  <Label className="text-teal-300">High School Marks</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      id="math"
                      type="number"
                      value={formData.math}
                      onChange={handleChange}
                      placeholder="Math"
                      required
                    />
                    <Input
                      id="science"
                      type="number"
                      value={formData.science}
                      onChange={handleChange}
                      placeholder="Science"
                      required
                    />
                    <Input
                      id="english"
                      type="number"
                      value={formData.english}
                      onChange={handleChange}
                      placeholder="English"
                      required
                    />
                    <Input
                      id="hindi"
                      type="number"
                      value={formData.hindi}
                      onChange={handleChange}
                      placeholder="Hindi"
                      required
                    />
                  </div>
                </div>
                {/* Intermediate Marks */}
                <div>
                  <Label className="text-teal-300">Intermediate Marks</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      id="physics"
                      type="number"
                      value={formData.physics}
                      onChange={handleChange}
                      placeholder="Physics"
                      required
                    />
                    <Input
                      id="chemistry"
                      type="number"
                      value={formData.chemistry}
                      onChange={handleChange}
                      placeholder="Chemistry"
                      required
                    />
                    <Input
                      id="maths"
                      type="number"
                      value={formData.maths}
                      onChange={handleChange}
                      placeholder="Maths"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="grid grid-cols-3 gap-6">
                {["firstChoice", "secondChoice", "thirdChoice"].map(
                  (choice, idx) => (
                    <div key={idx} className="space-y-2">
                      <Label htmlFor={choice} className="text-teal-300">
                        {`${choice.replace("Choice", " Choice")}`}
                      </Label>
                      <select
                        id={choice}
                        value={formData[choice]}
                        onChange={handleChange}
                        className="bg-gray-700 text-gray-100 border-gray-600 p-2 rounded"
                      >
                        {branchOptions.map((branch, index) => (
                          <option key={index} value={branch}>
                            {branch}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                )}
              </div>

              <Button type="submit" disabled={!isFormValid() || isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
