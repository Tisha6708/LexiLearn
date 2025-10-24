import { useState } from "react";
import API from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", form);
      alert("Signup successful! You can now log in.");
    } catch (err) {
      alert("Signup failed!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          className="border p-2 w-full mb-3 rounded"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          onChange={handleChange}
        />
        <button className="bg-blue-600 text-white w-full py-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}
