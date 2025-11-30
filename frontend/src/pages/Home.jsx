import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Brain, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import Chatbot from "../components/ChatBot";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  const ctaLink = !user
    ? "/signup"
    : user.role === "student"
    ? "student/dashboard"
    : "/teacher";

  const ctaText = !user ? "Get Started" : "Go to Dashboard";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center text-center overflow-x-hidden">
      
      {/* ================= HERO SECTION ================= */}
      <section className="max-w-5xl mt-24 md:mt-32 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl md:text-7xl font-extrabold text-gray-800 mb-6 leading-tight"
        >
          Read. Speak. Grow.
          <span className="block text-blue-600 mt-2">With LexiLearn.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-normal"
        >
          LexiLearn helps dyslexic learners build reading confidence with AI-powered
          voice feedback and personalized lessons that adapt to their pace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link
            to={ctaLink}
            className="bg-blue-600 text-white px-10 py-4 rounded-full text-xl font-bold shadow-lg shadow-blue-300/60 hover:bg-blue-700 transition transform hover:scale-[1.02] active:scale-100 flex items-center justify-center mx-auto w-fit gap-3"
          >
            {ctaText} <ArrowRight className="w-6 h-6" />
          </Link>
        </motion.div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <motion.section 
        className="mt-32 max-w-7xl grid md:grid-cols-3 gap-8 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        {[
          {
            icon: <BookOpen className="text-blue-600 w-10 h-10 mb-3" />,
            title: "Step 1: Learn",
            desc: "Access carefully designed lessons that match your reading level and gradually increase in complexity."
          },
          {
            icon: <Mic className="text-blue-600 w-10 h-10 mb-3" />,
            title: "Step 2: Speak",
            desc: "Read aloud while our AI listens — recognizing correct, missed, and mispronounced words in real time."
          },
          {
            icon: <Brain className="text-blue-600 w-10 h-10 mb-3" />,
            title: "Step 3: Improve",
            desc: "Track your progress visually, build fluency, and gain confidence with every session."
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            variants={sectionVariants}
            whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)", scale: 1.01 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 transition duration-300 text-left"
          >
            {feature.icon}
            <h3 className="text-2xl font-bold text-blue-700 mb-3">{feature.title}</h3>
            <p className="text-gray-600 text-lg">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* ================= AI LIVE PREVIEW ================= */}
      <section className="mt-32 max-w-6xl px-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          Live AI Feedback Preview
        </h2>
        <p className="text-xl text-gray-600 mb-10">
          Watch how LexiLearn analyzes speech, tracks accuracy, and improves fluency in real time.
        </p>

        <div className="bg-white rounded-3xl shadow-2xl p-8 grid md:grid-cols-2 gap-8 text-left">
          <div>
            <h3 className="text-2xl font-bold text-blue-700 mb-4">Student Reading</h3>
            <p className="text-gray-700 leading-relaxed">
              “The quick brown fox jumps over the lazy dog…”
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h4 className="font-bold text-gray-800 mb-3">AI Feedback</h4>
            <ul className="space-y-2 text-gray-700">
              <li>✅ Accuracy: <span className="font-semibold">91%</span></li>
              <li>✅ Fluency: <span className="font-semibold">Good</span></li>
              <li>⚠️ Pronunciation: “th”, “fox”</li>
              <li>⚡ Speed: Slightly fast</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= WHY LEXILEARN ================= */}
      <motion.section 
        className="mt-32 max-w-5xl px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Why LexiLearn?</h2>
        <p className="text-xl text-gray-700 mb-12 max-w-4xl mx-auto">
          LexiLearn isn’t just another learning platform — it’s an inclusive AI companion
          designed to empower every learner, especially those who struggle with reading.
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-blue-500 hover:shadow-2xl transition"
          >
            <h4 className="text-xl font-bold text-blue-700 mb-2">Accessibility First</h4>
            <p className="text-gray-600">
              From font choice to color balance, every design decision supports cognitive readability.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-green-500 hover:shadow-2xl transition"
          >
            <h4 className="text-xl font-bold text-green-700 mb-2">Instant Feedback</h4>
            <p className="text-gray-600">
              Real-time accuracy tracking with pronunciation insights for rapid improvement.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ================= IMPACT QUOTE ================= */}
      <motion.section 
        className="mt-32 max-w-3xl mb-24 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <blockquote className="text-3xl italic text-gray-700 border-l-4 border-blue-400 pl-6">
          “After just 7 days of guided practice, students using LexiLearn improved
          reading accuracy by over 25% in pilot testing.”
        </blockquote>
        <p className="mt-4 text-xl font-semibold text-gray-500 text-right">
          — LexiLearn Research Team
        </p>
      </motion.section>

      {/* ================= FLOATING CHATBOT ================= */}
      <div className="fixed bottom-6 right-6 z-50">
        <Chatbot />
      </div>

    </div>
  );
}
