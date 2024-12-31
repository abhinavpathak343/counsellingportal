"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Adjust paths
import axios from "axios";

export default function AdminPanel() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBranches, setSelectedBranches] = useState({}); // To store selected branches

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const response = await axios.get("http://localhost:8000/students");
        setStudents(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching student data:", error);
        setIsLoading(false);
      }
    }

    fetchStudentData();
  }, []);

  // Handle branch selection
  const handleBranchSelection = (studentId, branch) => {
    setSelectedBranches((prev) => ({
      ...prev,
      [studentId]: branch,
    }));
  };

  // Assign branches to students
const assignBranch = async (studentId) => {
  const branch = selectedBranches[studentId]; // Get the selected branch for this student

  if (!branch || branch === "Select") {
    alert("Please select a valid branch.");
    return;
  }

  try {
    const response = await axios.post(
      `http://localhost:8000/students/${studentId}/assignBranch`,
      { branch }
    );

    // Update the students state with the newly assigned branch
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student._id === studentId
          ? { ...student, assignedBranch: branch }
          : student
      )
    );

  } catch (error) {
    console.error("Error assigning branch:", error);
    alert(
      error.response?.data?.message ||
        "An error occurred while assigning the branch."
    );
  }
};


  // Render the admin panel
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden relative">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl z-10"
      >
        <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden border border-gray-700">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">
              Admin Panel
            </h2>

            {isLoading ? (
              <p className="text-gray-300">Loading...</p>
            ) : (
              <div className="space-y-6">
                {students.length > 0 ? (
                  <table className="min-w-full bg-gray-700">
                    <thead>
                      <tr>
                        <th className="text-left p-4 text-teal-300">
                          Student Name
                        </th>
                        <th className="text-left p-4 text-teal-300">
                          12th Marks
                        </th>
                        <th className="text-left p-4 text-teal-300">
                          Branch Choices
                        </th>
                        <th className="text-left p-4 text-teal-300">
                          Assigned Branch
                        </th>
                        <th className="text-left p-4 text-teal-300">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr
                          key={student._id}
                          className="border-t border-gray-600"
                        >
                          <td className="p-4 text-gray-100">
                            {student.fullName}
                          </td>
                          <td className="p-4 text-gray-100">
                            {student.intermediateMarks.maths}
                          </td>
                          <td className="p-4 text-gray-100">
                            <ul>
                              <li>
                                <span className="text-teal-300">1st:</span>{" "}
                                {student.branchPreferences.firstChoice}
                              </li>
                              <li>
                                <span className="text-teal-300">2nd:</span>{" "}
                                {student.branchPreferences.secondChoice}
                              </li>
                              <li>
                                <span className="text-teal-300">3rd:</span>{" "}
                                {student.branchPreferences.thirdChoice}
                              </li>
                            </ul>
                          </td>
                          <td className="p-4 text-gray-100">
                            {student.assignedBranch || "Not Assigned"}
                          </td>
                          <td className="p-4">
                            <select
                              className="bg-gray-700 text-gray-100 rounded p-2"
                              value={selectedBranches[student._id] || "Select"}
                              onChange={(e) =>
                                handleBranchSelection(
                                  student._id,
                                  e.target.value
                                )
                              }
                            >
                              <option>Select</option>
                              <option>Computer Science</option>
                              <option>Electronics</option>
                              <option>Mechanical Engineering</option>
                              <option>Electrical Engineering</option>
                              <option>civil Engineering</option>
                          
                            </select>
                            <Button
                              onClick={() => assignBranch(student._id)}
                              className="bg-blue-600 text-white mt-2"
                            >
                              Assign Branch
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-300">No students available</p>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
  


