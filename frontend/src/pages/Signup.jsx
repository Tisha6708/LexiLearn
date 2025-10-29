// import { useState } from "react";
// import API from "../services/api";

// export default function Signup() {
//   const [form, setForm] = useState({
//     full_name: "",
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await API.post("/auth/signup", form);
//       alert("Signup successful! You can now log in.");
//     } catch (err) {
//       alert("Signup failed!");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-blue-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-xl shadow-lg w-96"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
//         <input
//           type="text"
//           name="full_name"
//           placeholder="Full Name"
//           className="border p-2 w-full mb-3 rounded"
//           onChange={handleChange}
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           className="border p-2 w-full mb-3 rounded"
//           onChange={handleChange}
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           className="border p-2 w-full mb-4 rounded"
//           onChange={handleChange}
//         />
//         <button className="bg-blue-600 text-white w-full py-2 rounded">
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// }


import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "student",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await API.post("/auth/signup", {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      alert("Signup successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      alert("Signup failed. Please try again!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-96"
      >
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Create Your Account ✨
        </h2>

        {/* Role Selection */}
        <div className="mb-4">
          <label className="block text-left text-gray-700 font-medium mb-2">
            I am a:
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
          >
            <option value="student">Student</option>
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        {/* Full Name */}
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          className="border border-gray-300 p-2 w-full mb-3 rounded focus:ring-2 focus:ring-blue-400"
          value={form.full_name}
          onChange={handleChange}
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border border-gray-300 p-2 w-full mb-3 rounded focus:ring-2 focus:ring-blue-400"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border border-gray-300 p-2 w-full mb-3 rounded focus:ring-2 focus:ring-blue-400"
          value={form.password}
          onChange={handleChange}
          required
        />

        {/* Confirm Password */}
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          className="border border-gray-300 p-2 w-full mb-4 rounded focus:ring-2 focus:ring-blue-400"
          value={form.confirm_password}
          onChange={handleChange}
          required
        />

        {/* Signup Button */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg font-semibold transition"
        >
          Sign Up
        </button>

        {/* Divider */}
        <div className="my-4 text-center text-gray-500 text-sm">or</div>

        {/* Login Redirect */}
        <div className="text-center">
          <p className="text-gray-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Log in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
