// import { useEffect, useState } from "react";
// import API from "../services/api";

// export default function ReadingPractice() {
//   const [lesson, setLesson] = useState(null);
//   const [spokenText, setSpokenText] = useState("");
//   const [feedback, setFeedback] = useState(null);
//   const [recording, setRecording] = useState(false);
//   const [recognition, setRecognition] = useState(null);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Please login first!");
//       window.location.href = "/login";
//       return;
//     }
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     setUser(payload);

//     const fetchLesson = async () => {
//       const res = await API.get("/lessons/");
//       if (res.data.lessons.length > 0) {
//         setLesson(res.data.lessons[0]);
//       }
//     };
//     fetchLesson();

//     // Web Speech API setup
//     if ("webkitSpeechRecognition" in window) {
//       const rec = new window.webkitSpeechRecognition();
//       rec.continuous = true;
//       rec.lang = "en-US";
//       rec.onresult = (event) => {
//         const transcript = Array.from(event.results)
//           .map((result) => result[0].transcript)
//           .join(" ");
//         setSpokenText(transcript);
//       };
//       setRecognition(rec);
//     } else {
//       alert("Speech Recognition not supported in this browser.");
//     }
//   }, []);

//   const handleVoiceToggle = () => {
//     if (!recognition) return;
//     if (recording) {
//       recognition.stop();
//       setRecording(false);
//     } else {
//       recognition.start();
//       setRecording(true);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!spokenText) return alert("Please speak or type something first!");
//     try {
//       const res = await API.post("/sessions/", {
//         user_id: user.user_id,
//         lesson_id: lesson.id,
//         spoken_text: spokenText,
//       });
//       setFeedback(res.data.metrics);
//       alert("Session recorded successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Error saving session!");
//     }
//   };

//   if (!lesson) return <p className="text-center mt-10">Loading lesson...</p>;

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h2 className="text-3xl font-bold text-blue-600 mb-4">{lesson.title}</h2>
//       <p className="bg-gray-100 p-4 rounded mb-6">{lesson.content}</p>

//       <textarea
//         value={spokenText}
//         onChange={(e) => setSpokenText(e.target.value)}
//         placeholder="Your speech will appear here..."
//         className="w-full border p-3 rounded-lg mb-4"
//         rows={4}
//       />

//       <div className="flex items-center gap-4 mb-4">
//         <button
//           onClick={handleVoiceToggle}
//           className={`px-4 py-2 rounded text-white ${
//             recording ? "bg-red-500" : "bg-green-600"
//           }`}
//         >
//           {recording ? "Stop Recording" : "Start Speaking 🎤"}
//         </button>

//         <button
//           onClick={handleSubmit}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Submit Reading
//         </button>
//       </div>

//       {feedback && (
//         <div className="mt-6 bg-white shadow p-4 rounded-lg border-l-4 border-green-500">
//           <h3 className="font-semibold text-lg mb-2">AI Feedback 🧠</h3>
//           <p>Words per minute (WPM): {feedback.wpm}</p>
//           <p>Accuracy: {feedback.accuracy}%</p>
//           <p className="text-gray-500 text-sm mt-2">
//             Great job! Keep practicing to improve your fluency.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import API from "../services/api";

export default function ReadingPractice() {
  const [lesson, setLesson] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [feedback, setFeedback] = useState(null);

  const lessonId = new URLSearchParams(window.location.search).get("id");
  const token = localStorage.getItem("token");
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;

  useEffect(() => {
    if (!lessonId) return;
    API.get(`/lessons/${lessonId}`).then((res) => setLesson(res.data.lesson));
  }, [lessonId]);

  // --- Text to Speech ---
  const speakText = (text) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9; // slower for dyslexia-friendly reading
    window.speechSynthesis.speak(utterance);
  };

  // --- Speech to Text ---
  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setRecording(true);
      setRecognizedText("");
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setRecognizedText(transcript);
    };

    recognition.onerror = (err) => console.error("Speech error:", err);
    recognition.onend = () => setRecording(false);

    recognition.start();
  };

  const stopRecording = () => {
    window.speechSynthesis.cancel();
    setRecording(false);
  };

  // --- Send Speech Text to Backend ---
  const submitPractice = async () => {
    if (!recognizedText) {
      alert("Please record your reading first.");
      return;
    }

    try {
      const res = await API.post("/sessions/", {
        user_id: payload.user_id,
        lesson_id: parseInt(lessonId),
        spoken_text: recognizedText,
      });
      setFeedback(res.data.metrics);
    } catch (err) {
      console.error(err);
      alert("Error while submitting session");
    }
  };

  if (!lesson) return <p className="text-center mt-10">Loading lesson...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4 text-blue-600">{lesson.title}</h2>
      <p className="text-gray-700 mb-6 leading-relaxed">{lesson.content}</p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => speakText(lesson.content)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          🔊 Read Aloud
        </button>

        {!recording ? (
          <button
            onClick={startRecording}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            🎙️ Start Reading
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            ⏹ Stop
          </button>
        )}
      </div>

      {recognizedText && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">You Read:</h4>
          <p>{recognizedText}</p>
        </div>
      )}

      <button
        onClick={submitPractice}
        className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700"
      >
        ✅ Get AI Feedback
      </button>

      {feedback && (
        <div className="mt-6 bg-white shadow p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-700 mb-3">
            AI Feedback Summary
          </h4>

          <p className="mb-2">📈 Accuracy: <b>{feedback.accuracy}%</b></p>
          <p className="mb-4">⚡ Words Per Minute: <b>{feedback.wpm}</b></p>

          <h5 className="font-semibold text-gray-700 mb-2">Your Reading Analysis:</h5>
          <div className="bg-gray-50 p-4 rounded-lg leading-relaxed">
            {lesson.content.split(" ").map((word, idx) => {
              const cleanWord = word.toLowerCase().replace(/[.,!?]/g, "");
              const isMissed = feedback.errors?.includes(cleanWord);
              const isRead = recognizedText.toLowerCase().includes(cleanWord);

              let color = "text-gray-600"; // default color
              if (isMissed) color = "text-red-600 font-semibold"; // missed words
              else if (isRead) color = "text-green-700"; // correctly read words

              return (
                <span key={idx} className={`${color} mr-1`}>
                  {word}
                </span>
              );
            })}
          </div>

          {feedback.errors && feedback.errors.length > 0 && (
            <p className="text-red-600 mt-3">
              ❌ Missed Words: {feedback.errors.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
