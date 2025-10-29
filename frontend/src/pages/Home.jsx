export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center text-center p-10">
      {/* Hero Section */}
      <section className="max-w-3xl mt-10">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4">
          Welcome to LexiLearn 🎓
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          Empowering dyslexic learners with an AI-powered tutor that adapts to their pace and style of learning.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-blue-700 transition">
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="mt-20 grid md:grid-cols-3 gap-10 max-w-5xl">
        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
          <h3 className="text-2xl font-bold text-blue-600 mb-3">🎯 Personalized Learning</h3>
          <p className="text-gray-600">
            Lessons adapt to each learner’s reading speed, comprehension level, and progress.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
          <h3 className="text-2xl font-bold text-blue-600 mb-3">🧠 Dyslexia-Friendly Design</h3>
          <p className="text-gray-600">
            Accessible fonts, colors, and interactive tools to make reading easier and more engaging.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
          <h3 className="text-2xl font-bold text-blue-600 mb-3">💬 Real-Time Feedback</h3>
          <p className="text-gray-600">
            Get instant suggestions and support from your AI tutor as you learn and practice.
          </p>
        </div>
      </section>

      {/* Quote Section */}
      <section className="mt-20 max-w-3xl">
        <blockquote className="text-xl italic text-gray-700">
          “LexiLearn isn’t just a tool — it’s a bridge to confidence and understanding for every learner.”
        </blockquote>
        <p className="mt-3 text-gray-500">— The LexiLearn Team</p>
      </section>
    </div>
  );
}
