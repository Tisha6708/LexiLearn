import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-600 text-white w-full py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
