// import { useEffect, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import API from "../services/api";
// import { motion } from "framer-motion";

// export default function ReadingPractice() {
//   const [lesson, setLesson] = useState(null);
//   const [spokenText, setSpokenText] = useState("");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const lessonId = searchParams.get("lessonId");
//   const token = localStorage.getItem("lexi_token");

//   useEffect(() => {
//     if (!lessonId) {
//       navigate("/student/lessons");
//       return;
//     }

//     const fetchLesson = async () => {
//       try {
//         const res = await API.get(`/lessons/${lessonId}`);
//         setLesson(res.data.lesson);
//       } catch (err) {
//         console.error("Error fetching lesson:", err);
//       }
//     };
//     fetchLesson();
//   }, [lessonId, navigate]);

//   const handleSubmit = async () => {
//   if (!spokenText.trim()) return alert("Please enter your response first.");

//   setLoading(true);
//   try {
//     const user = JSON.parse(atob(token.split(".")[1])); // decode JWT
//     const payload = {
//       user_id: user.sub || user.id,  // add this line
//       lesson_id: lessonId,
//       spoken_text: spokenText,
//     };
//     const res = await API.post("/sessions/", payload, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setResult(res.data.metrics);
//   } catch (err) {
//     console.error("Error submitting practice:", err.response?.data || err);
//     alert("Something went wrong. Please try again.");
//   } finally {
//     setLoading(false);
//   }
// };

//   if (!lesson) return <p className="text-center mt-10">Loading lesson...</p>;

//   return (
//     <div className="max-w-3xl mx-auto p-6 mt-6">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
//       >
//         <h2 className="text-2xl font-bold text-blue-600 mb-4">
//           {lesson.title}
//         </h2>
//         <p className="text-gray-700 mb-6 whitespace-pre-line leading-relaxed">
//           {lesson.content}
//         </p>

//         <textarea
//           placeholder="Type what you read..."
//           className="border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none p-3 w-full rounded-lg mb-4 resize-none text-gray-700"
//           rows={6}
//           value={spokenText}
//           onChange={(e) => setSpokenText(e.target.value)}
//         />

//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className={`w-full py-2 rounded-lg font-semibold text-white transition ${
//             loading
//               ? "bg-blue-300 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {loading ? "Evaluating..." : "Submit Practice"}
//         </button>

//         {result && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4"
//           >
//             <h4 className="text-lg font-semibold mb-2 text-blue-700">
//               Your Results 📊
//             </h4>
//             <p>Accuracy: {result.accuracy}%</p>
//             <p>WPM: {result.wpm}</p>
//             {result.errors?.length > 0 && (
//               <p className="text-red-600 mt-2">
//                 Missing words: {result.errors.join(", ")}
//               </p>
//             )}
//           </motion.div>
//         )}
//       </motion.div>
//     </div>
//   );
// }





import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";

// ReadingPractice.jsx
// Voice-enabled reading practice for dyslexic learners
// - Uses Web Speech API for in-browser speech-to-text
// - Live highlights words: green = correct, orange = near-match/mispronounced, gray = skipped
// - Calculates accuracy and WPM and can submit a session to backend

export default function ReadingPractice() {
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get("lessonId");

  const [lesson, setLesson] = useState(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState(""); // full live transcript
  const [finalTranscript, setFinalTranscript] = useState(""); // what was captured when stopped
  const [highlights, setHighlights] = useState([]); // [{word, color}]
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const startTimeRef = useRef(null);
  const stopTimeRef = useRef(null);

  // --- helpers ---
  const normalize = (w) => w.replace(/[\u2018\u2019\u201C\u201D"'(){}\[\],.!?:;—–<>\/\\]/g, "").trim().toLowerCase();

  // Levenshtein distance for 'near' matches (very small implementation)
  const levenshtein = (a, b) => {
    if (!a) return b.length;
    if (!b) return a.length;
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
    }
    return dp[m][n];
  };

  // Determine if two words are a near match (mispronunciation rather than completely different)
  const isNearMatch = (expected, spoken) => {
    if (!expected || !spoken) return false;
    const e = normalize(expected);
    const s = normalize(spoken);
    if (!e || !s) return false;
    if (e === s) return true;
    const dist = levenshtein(e, s);
    // threshold: allow 1 for short words, 2 for longer words
    const threshold = e.length <= 4 ? 1 : 2;
    return dist <= threshold;
  };

  // Compare expected words to spoken words and produce highlights
  const computeHighlights = (expectedText, spokenText) => {
    const expected = expectedText
      .split(/\s+/)
      .map((w) => normalize(w))
      .filter(Boolean);

    const spoken = spokenText
      .split(/\s+/)
      .map((w) => normalize(w))
      .filter(Boolean);

    const spokenUsed = new Array(spoken.length).fill(false);
    const out = expected.map((expWord, i) => {
      // try exact match at same index first
      const spokenAtIndex = spoken[i];
      if (spokenAtIndex && spokenAtIndex === expWord) {
        spokenUsed[i] = true;
        return { word: expWord, color: "green" };
      }

      // try near match at same index
      if (spokenAtIndex && isNearMatch(expWord, spokenAtIndex)) {
        spokenUsed[i] = true;
        return { word: expWord, color: "orange" };
      }

      // try to find the expected word elsewhere in the spoken array (user might have read ahead or repeated)
      const foundIdx = spoken.findIndex((s, idx) => !spokenUsed[idx] && (s === expWord || isNearMatch(expWord, s)));
      if (foundIdx !== -1) {
        spokenUsed[foundIdx] = true;
        // if exact match -> green, else orange
        return { word: expWord, color: spoken[foundIdx] === expWord ? "green" : "orange" };
      }

      // otherwise it's skipped/not pronounced
      return { word: expWord, color: "gray" };
    });

    return out;
  };

  // Compute accuracy and wpm from highlights and timestamps
  const computeResultMetrics = (highlightsArr) => {
    const total = highlightsArr.length;
    const correct = highlightsArr.filter((h) => h.color === "green").length;
    const near = highlightsArr.filter((h) => h.color === "orange").length;
    const accuracy = total ? Math.round(((correct + near * 0.5) / total) * 100) : 0; // count near as half-credit

    const start = startTimeRef.current;
    const end = stopTimeRef.current || Date.now();
    const minutes = Math.max((end - start) / 60000, 1 / 60); // avoid zero
    const spokenCount = finalTranscript.split(/\s+/).filter(Boolean).length;
    const wpm = Math.round(spokenCount / minutes);

    return { total, correct, near, accuracy, wpm };
  };

  // --- Speech recognition setup ---
  useEffect(() => {
    // load lesson
    const fetchLesson = async () => {
      if (!lessonId) return;
      try {
        const res = await API.get(`/lessons/${lessonId}`);
        setLesson(res.data.lesson);
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setError("Could not load lesson.");
      }
    };
    fetchLesson();

    // prepare recognition if supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      recognitionRef.current = null;
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US"; // you may want to make this configurable

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) final += res[0].transcript + " ";
        else interim += res[0].transcript + " ";
      }

      const combined = (finalTranscript + " " + final + interim).trim();
      setTranscript(combined);

      // live compute highlights (non-blocking simple computation)
      if (lesson && combined) {
        const h = computeHighlights(lesson.content, combined);
        setHighlights(h);
      }

      if (final) {
        setFinalTranscript((prev) => (prev + " " + final).trim());
      }
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error", e);
      setError("Speech recognition error: " + (e.error || "unknown"));
    };

    recognition.onend = () => {
      // when recognition stops (either user stopped or browser ended)
      setListening(false);
      stopTimeRef.current = Date.now();
      // finalize highlights using finalTranscript (if any)
      if (lesson) {
        const h = computeHighlights(lesson.content, finalTranscript || transcript);
        setHighlights(h);
        setResult(computeResultMetrics(h));
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, lesson, finalTranscript]);

  const startListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setError("SpeechRecognition not supported in this browser. Use Chrome or Edge.");
      return;
    }
    setTranscript("");
    setFinalTranscript("");
    setHighlights([]);
    setResult(null);
    setError(null);
    startTimeRef.current = Date.now();
    stopTimeRef.current = null;
    try {
      recognition.start();
      setListening(true);
    } catch (e) {
      // some browsers throw if start() called while already running
      console.warn(e);
    }
  };

  const stopListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.stop();
    } catch (e) {
      console.warn(e);
    }
    // onend handler will set listening=false and compute results
  };

  const resetSession = () => {
    setTranscript("");
    setFinalTranscript("");
    setHighlights([]);
    setResult(null);
    setError(null);
    startTimeRef.current = null;
    stopTimeRef.current = null;
  };

  const submitSession = async () => {
    // submit the computed result to backend similar to previous implementation
    try {
      // token parsing (try different key names depending on your auth implementation)
      const rawToken = localStorage.getItem("lexi_token") || localStorage.getItem("token");
      const payloadUser = rawToken ? JSON.parse(atob(rawToken.split(".")[1])) : null;
      const userId = payloadUser?.sub || payloadUser?.user_id || payloadUser?.id || null;

      const sessionPayload = {
        user_id: userId,
        lesson_id: lessonId,
        spoken_text: finalTranscript || transcript,
        metrics: result,
      };

      const res = await API.post("/sessions/", sessionPayload);
      // assume backend returns saved session metrics
      setResult(res.data.metrics || result);
      alert("Session submitted — great work!");
    } catch (err) {
      console.error("Error submitting practice:", err);
      alert("Failed to submit session. Check console for details.");
    }
  };

  if (!lessonId) return <p className="text-center mt-10">No lesson selected.</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!lesson) return <p className="text-center mt-10">Loading lesson...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">{lesson.title}</h2>

      <div className="prose mb-4" style={{ lineHeight: 1.9 }}>
        {/* Render lesson content with highlights */}
        {highlights.length > 0 ? (
          <div className="leading-8">
            {highlights.map((h, i) => (
              <span
                key={i}
                className={"mr-1 inline-block px-0.5 py-0.5 rounded"}
                style={{
                  color: h.color === "green" ? "#166534" : h.color === "orange" ? "#b45309" : "#6b7280",
                  fontWeight: h.color === "green" ? 700 : 600,
                }}
              >
                {h.word}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 whitespace-pre-line">{lesson.content}</p>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={startListening}
            disabled={listening}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            🎙️ Start Reading
          </button>

          <button
            onClick={stopListening}
            disabled={!listening}
            className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50"
          >
            ⏹️ Stop
          </button>

          <button onClick={resetSession} className="px-4 py-2 rounded border">
            Reset
          </button>

          <button onClick={submitSession} className="ml-auto px-4 py-2 rounded bg-green-600 text-white">
            Submit Practice
          </button>
        </div>

        <div className="mt-3 bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-500">Live transcript:</div>
          <div className="mt-1 text-sm text-gray-800 min-h-[2rem]">{transcript || "(say something...)"}</div>
        </div>
      </div>

      {result && (
        <div className="mt-6 bg-white shadow rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-2 text-blue-600">Your Results</h4>
          <p>Accuracy: <strong>{result.accuracy ?? computeResultMetrics(highlights).accuracy}%</strong></p>
          <p>Words Per Minute: <strong>{result.wpm ?? computeResultMetrics(highlights).wpm}</strong></p>
          <p>Correct: {result.correct ?? highlights.filter(h => h.color === 'green').length} / {highlights.length}</p>
          {highlights.some(h => h.color === 'gray') && (
            <p className="text-sm text-gray-600">Skipped words highlighted in grey — consider re-reading those lines.</p>
          )}
        </div>
      )}
    </div>
  );
}
