import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Brain, Mic } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 flex flex-col items-center text-center overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="max-w-4xl mt-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-extrabold text-blue-800 mb-4 leading-tight"
        >
          Read. Speak. Grow.  
          <span className="block text-blue-500">With LexiLearn.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          LexiLearn helps dyslexic learners build reading confidence with AI-powered voice feedback and personalized lessons that adapt to their pace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-lg font-semibold shadow-md hover:bg-blue-700 transition flex items-center justify-center mx-auto w-fit gap-2"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="mt-28 max-w-6xl grid md:grid-cols-3 gap-10 px-6">
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
            whileHover={{ scale: 1.05 }}
            className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition"
          >
            {feature.icon}
            <h3 className="text-2xl font-bold text-blue-700 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-lg">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Why LexiLearn Section */}
      <section className="mt-28 max-w-5xl px-6">
        <h2 className="text-4xl font-bold text-blue-700 mb-6">Why LexiLearn?</h2>
        <p className="text-lg text-gray-700 mb-10">
          LexiLearn isn’t just another learning platform — it’s an **inclusive AI companion** designed to empower every learner, especially those who struggle with reading.  
          Our dyslexia-friendly design ensures visual comfort, gentle feedback, and positive reinforcement.
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left">
          <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500">
            <h4 className="text-xl font-semibold text-blue-700 mb-2">Accessibility First</h4>
            <p className="text-gray-600">
              From font choice to color balance, every design decision supports cognitive readability and reduced visual strain.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500">
            <h4 className="text-xl font-semibold text-green-700 mb-2">Instant Feedback</h4>
            <p className="text-gray-600">
              Real-time highlighting of words — green for correct, orange for mispronounced, grey for skipped — provides intuitive learning cues.
            </p>
          </div>
        </div>
      </section>

      {/* Quote / Impact Section */}
      <section className="mt-24 max-w-3xl mb-20">
        <blockquote className="text-2xl italic text-gray-700">
          “For many learners, reading isn’t just a skill — it’s a challenge.  
          LexiLearn turns that challenge into progress, one word at a time.”
        </blockquote>
        <p className="mt-4 text-gray-500">— The LexiLearn Team</p>
      </section>
    </div>
  );
}
