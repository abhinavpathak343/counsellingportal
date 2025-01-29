import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button.jsx'; // Adjust the import path
import Students from "../../assets/students.jpg";

const Home = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden relative">
            {/* Animated beams */}
      {/* <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute left-0 right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500 opacity-20 blur-[100px] animate-pulse"></div>
        <div className="absolute right-0 bottom-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500 opacity-20 blur-[100px] animate-pulse"></div>
      </div> */}
            {/* Main content */}
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl z-10"
            >
                <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden border border-gray-700 flex">
                    <div className="w-1/2 p-8">
                        <img src={Students} alt="students" className="w-full h-auto" />
                    </div>
                    <div className="w-1/2 p-8">
                        <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">
                            Welcome to
                            <br />
                            Student Counselling
                            <br />
                            Portal
                        </h2>
                        <p className="text-gray-300 mb-8 text-center">
                            Streamline class organization, and add students and faculty.
                            Seamlessly track attendance, assess performance, and provide feedback.
                            Access records, view marks, and communicate effortlessly.
                        </p>
                        <div className="space-y-4">
                            <Link to="/login" className="block w-full">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold">
                                    Login as Student
                                </Button>
                            </Link>
                            <Link to="/admin-login" className="block w-full">
                                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 text-lg font-semibold">
                                    Login as Admin
                                </Button>
                            </Link>
                        </div>
                        <p className="text-sm text-gray-400 text-center mt-6">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-medium text-blue-400 hover:text-blue-300">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Home;
