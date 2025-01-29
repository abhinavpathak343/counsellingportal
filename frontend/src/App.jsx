import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home"; // Adjust path as necessary
import Login from "./pages/Login/Login.jsx";
import AdminLogin from "./pages/Login/AdminLogin.jsx"; // Corrected AdminLogin import
import StudentForm from "./pages/main/StudentForm.jsx"; // Import the form
import AdminPanel from "./pages/main/AdminPanel.jsx"; // Import the form
import Signup from "./pages/Signup/Signup.jsx"; // Import Signup component
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import the provider

const App = () => {
  return (
    <GoogleOAuthProvider clientId="1098238898472-he2l97jflu50j4sn82ro2bu44nc7rkja.apps.googleusercontent.com">
      {" "}
      {/* Add your Google client ID */}
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />{" "}
            {/* AdminLogin route */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/studentform" element={<StudentForm />} />{" "}
            {/* StudentForm route */}
            <Route path="/adminpanel" element={<AdminPanel />} />{" "}
            {/* AdminPanel route */}
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
