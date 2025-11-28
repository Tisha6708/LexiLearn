import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Brain, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import Chatbot from "../components/ChatBot";

export default function Home() {
  // Define animation variants for cleaner code and potential reuse
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  return (
    // IMPROVISATION: Changed BG to a softer, more contrast-friendly neutral off-white/very light gray for better readability.
    <div className="min-h-screen bg-gray-50 flex flex-col items-center text-center overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="max-w-5xl mt-24 md:mt-32 px-6">
        {/* Title animation remains, but slightly adjusted styling for punch */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          // IMPROVISATION: Increased size and contrast for the main heading, softer blue.
          className="text-6xl md:text-7xl font-extrabold text-gray-800 mb-6 leading-tight"
        >
          Read. Speak. Grow.
          {/* IMPROVISATION: Sub-text changed to a vibrant primary color */}
          <span className="block text-blue-600 mt-2">With LexiLearn.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          // IMPROVISATION: Increased text size and reduced width slightly for better line length
          className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-normal"
        >
          LexiLearn helps dyslexic learners build reading confidence with **AI-powered voice feedback** and personalized lessons that adapt to their pace.
        </motion.p>

        {/* Call to Action (CTA) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link
            to="/signup"
            // IMPROVISATION: CTA button is larger, slightly more rounded (full rounded ends), and uses a stronger shadow for presence.
            className="bg-blue-600 text-white px-10 py-4 rounded-full text-xl font-bold shadow-lg shadow-blue-300/60 hover:bg-blue-700 transition transform hover:scale-[1.02] active:scale-100 flex items-center justify-center mx-auto w-fit gap-3"
          >
            Get Started <ArrowRight className="w-6 h-6" />
          </Link>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <motion.section 
        className="mt-32 max-w-7xl grid md:grid-cols-3 gap-8 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        {/* ... feature data remains the same ... */}
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
            // IMPROVISATION: Used the defined variant for simple staggered entry animation
            variants={sectionVariants}
            whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)", scale: 1.01 }}
            // IMPROVISATION: Used a brighter white and softer shadow for a "lifted" feel.
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 transition duration-300 text-left" // Align text left for better readability in columns
          >
            {feature.icon}
            <h3 className="text-2xl font-bold text-blue-700 mb-3">{feature.title}</h3>
            <p className="text-gray-600 text-lg">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Why LexiLearn Section */}
      <motion.section 
        className="mt-32 max-w-5xl px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        {/* IMPROVISATION: Increased contrast on section title */}
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Why LexiLearn?</h2>
        <p className="text-xl text-gray-700 mb-12 max-w-4xl mx-auto">
          LexiLearn isn’t just another learning platform — it’s an **inclusive AI companion** designed to empower every learner, especially those who struggle with reading.
          Our dyslexia-friendly design ensures visual comfort, gentle feedback, and positive reinforcement.
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left">
          {/* Feature 1 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-blue-500 hover:shadow-2xl transition"
          >
            <h4 className="text-xl font-bold text-blue-700 mb-2">Accessibility First</h4>
            <p className="text-gray-600">
              From font choice to color balance, every design decision supports cognitive readability and reduced visual strain.
            </p>
          </motion.div>
          {/* Feature 2 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-green-500 hover:shadow-2xl transition"
          >
            <h4 className="text-xl font-bold text-green-700 mb-2">Instant Feedback</h4>
            <p className="text-gray-600">
              Real-time highlighting of words — green for correct, orange for mispronounced, grey for skipped — provides intuitive learning cues.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Quote / Impact Section */}
      <motion.section 
        className="mt-32 max-w-3xl mb-24 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        {/* IMPROVISATION: Blockquote is larger and has a distinct visual marker */}
        <blockquote className="text-3xl italic text-gray-700 border-l-4 border-blue-400 pl-6">
          “For many learners, reading isn’t just a skill — it’s a challenge.
          LexiLearn turns that challenge into progress, one word at a time.”
        </blockquote>
        <p className="mt-4 text-xl font-semibold text-gray-500 text-right">— The LexiLearn Team</p>
      </motion.section>
      
      {/* Chatbot remains outside the main container flow to ensure visibility (if it's a fixed component) */}
      <Chatbot/>
    </div>
  );
}