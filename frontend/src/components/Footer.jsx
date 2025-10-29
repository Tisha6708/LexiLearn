import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white mt-20 py-10 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold mb-3">LexiLearn 🎓</h2>
          <p className="text-gray-200">
            Empowering dyslexic learners through AI-powered, personalized education.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-blue-200 transition">Home</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-200 transition">About</Link>
            </li>
            <li>
              <Link to="/lessons" className="hover:text-blue-200 transition">Lessons</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-200 transition">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect With Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="mailto:contact@lexilearn.ai" className="hover:text-blue-200 transition">
              <Mail />
            </a>
            <a href="#" className="hover:text-blue-200 transition">
              <Facebook />
            </a>
            <a href="#" className="hover:text-blue-200 transition">
              <Twitter />
            </a>
            <a href="#" className="hover:text-blue-200 transition">
              <Instagram />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-blue-500 mt-10 pt-4 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} LexiLearn. All rights reserved.
      </div>
    </footer>
  );
}
