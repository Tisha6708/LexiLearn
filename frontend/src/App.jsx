// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";

// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import ParentDashboard from "./pages/ParentDashboard";
// import TeacherDashboard from "./pages/TeacherDashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
// import ReadingPractice from "./pages/ReadingPractice";
// import Lessons from "./pages/Lessons";

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Navbar />
//         <main>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />

//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute roles={["student", "parent", "teacher"]}>
//                   <Dashboard />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/student"
//               element={
//                 <ProtectedRoute roles={["student"]}>
//                   <Dashboard />
//                   <ReadingPractice />
//                   <Lessons />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/parent"
//               element={
//                 <ProtectedRoute roles={["parent"]}>
//                   <ParentDashboard />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/teacher"
//               element={
//                 <ProtectedRoute roles={["teacher"]}>
//                   <TeacherDashboard />
//                 </ProtectedRoute>
//               }
//             />
//           </Routes>
//         </main>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;



import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ParentDashboard from "./pages/ParentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ReadingPractice from "./pages/ReadingPractice";
import Lessons from "./pages/Lessons";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute roles={["student"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/lessons"
              element={
                <ProtectedRoute roles={["student"]}>
                  <Lessons />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/practice"
              element={
                <ProtectedRoute roles={["student"]}>
                  <ReadingPractice />
                </ProtectedRoute>
              }
            />

            {/* Parent Route */}
            <Route
              path="/parent"
              element={
                <ProtectedRoute roles={["parent"]}>
                  <ParentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Teacher Route */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute roles={["teacher"]}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
