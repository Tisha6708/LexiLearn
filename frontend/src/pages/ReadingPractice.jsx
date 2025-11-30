import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ReadingPractice() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const lessonId = searchParams.get("lessonId");

  const [lesson, setLesson] = useState(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [highlights, setHighlights] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const startTimeRef = useRef(null);
  const stopTimeRef = useRef(null);
  const debounceRef = useRef(null);

  // --- Utility Helpers ---
  const normalize = (w) =>
    w
      .replace(/[\u2018\u2019\u201C\u201D"'(){}\[\],.!?:;—–<>\/\\]/g, "")
      .trim()
      .toLowerCase();

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

  const isNearMatch = (expected, spoken) => {
    if (!expected || !spoken) return false;
    const e = normalize(expected);
    const s = normalize(spoken);
    if (!e || !s) return false;
    if (e === s) return true;
    const dist = levenshtein(e, s);
    const threshold = e.length <= 4 ? 1 : 2;
    return dist <= threshold;
  };

  const computeHighlights = useCallback((expectedText, spokenText) => {
    const expected = expectedText.split(/\s+/).map(normalize).filter(Boolean);
    const spoken = spokenText.split(/\s+/).map(normalize).filter(Boolean);
    const spokenUsed = new Array(spoken.length).fill(false);

    return expected.map((expWord, i) => {
      const spokenAtIndex = spoken[i];
      if (spokenAtIndex && spokenAtIndex === expWord) {
        spokenUsed[i] = true;
        return { word: expWord, color: "green" };
      }
      if (spokenAtIndex && isNearMatch(expWord, spokenAtIndex)) {
        spokenUsed[i] = true;
        return { word: expWord, color: "orange" };
      }
      const foundIdx = spoken.findIndex(
        (s, idx) => !spokenUsed[idx] && (s === expWord || isNearMatch(expWord, s))
      );
      if (foundIdx !== -1) {
        spokenUsed[foundIdx] = true;
        return { word: expWord, color: spoken[foundIdx] === expWord ? "green" : "orange" };
      }
      return { word: expWord, color: "gray" };
    });
  }, []);

  const computeResultMetrics = (highlightsArr, spokenText) => {
    const total = highlightsArr.length;
    const correct = highlightsArr.filter((h) => h.color === "green").length;
    const near = highlightsArr.filter((h) => h.color === "orange").length;
    const accuracy = total ? Math.round(((correct + near * 0.5) / total) * 100) : 0;

    const start = startTimeRef.current;
    const end = stopTimeRef.current || Date.now();
    const minutes = Math.max((end - start) / 60000, 1 / 60);
    const spokenCount = spokenText.split(/\s+/).filter(Boolean).length;
    const wpm = Math.round(spokenCount / minutes);

    return { accuracy, wpm };
  };

  // --- Fetch Lesson ---
  useEffect(() => {
    if (!lessonId) return;
    const fetchLesson = async () => {
      try {
        const res = await API.get(`/lessons/${lessonId}`);
        setLesson(res.data.lesson);
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setError("Could not load lesson.");
      }
    };
    fetchLesson();
  }, [lessonId]);

  // --- Initialize SpeechRecognition Once ---
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("SpeechRecognition not supported. Use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) final += res[0].transcript + " ";
        else interim += res[0].transcript + " ";
      }

      const newTranscript = finalTranscript + " " + final + interim;

      // Debounce highlight updates to reduce lag
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (lesson?.content && newTranscript) {
          const h = computeHighlights(lesson.content, newTranscript);
          setHighlights(h);
        }
      }, 300);

      if (final) {
        setFinalTranscript((prev) => (prev + " " + final).trim());
      }

      setTranscript(newTranscript.trim());
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
      const messages = {
        network: "⚠️ Speech recognition requires internet and HTTPS.",
        "not-allowed": "🎤 Microphone access denied.",
        "no-speech": "No speech detected. Try again.",
      };
      setError(messages[e.error] || "Speech recognition error occurred.");
    };

    recognition.onend = () => {
  console.log("Speech recognition stopped.");
  setListening(false);
  stopTimeRef.current = Date.now();

  setTimeout(() => {
    const combinedText = (finalTranscript || "") + " " + (transcript || "");
    const cleanCombined = combinedText.trim();

    if (lesson?.content && cleanCombined) {
      const h = computeHighlights(lesson.content, cleanCombined);
      setHighlights(h);
      // 🧠 Frontend no longer computes accuracy/WPM.
      // Backend will handle analysis on submit.
    }
    // ❌ REMOVE setResult({ accuracy: 0, wpm: 0 });
  }, 400);
};



    recognitionRef.current = recognition;
    return () => {
      try {
        recognition.stop();
      } catch (err) {
        console.warn("Recognition stop error:", err);
      }
    };
  }, [lesson, computeHighlights]);

  // --- Controls ---
  const startListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return setError("SpeechRecognition not supported.");
    if (listening) return;

    setTranscript("");
    setFinalTranscript("");
    setResult(null);
    setError(null);

    startTimeRef.current = Date.now();
    stopTimeRef.current = null;

    try {
      recognition.start();
      setListening(true);
    } catch (e) {
      console.warn("Recognition already running:", e);
    }
  };

  const stopListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.stop();
    } catch (e) {
      console.warn("Stop failed:", e);
    }
  };

  const resetSession = () => {
    setTranscript("");
    setFinalTranscript("");
    setHighlights([]);
    setResult(null);
    setError(null);
  };

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  };

  const submitSession = async () => {
  try {
    const rawToken = localStorage.getItem("lexi_token");
    const payloadUser = decodeJWT(rawToken);
    const userId = payloadUser?.sub || payloadUser?.id;

    const combinedText =
      ((finalTranscript || "") + " " + (transcript || "")).trim();

    if (!combinedText) {
      alert("No speech captured. Please read the passage first.");
      return;
    }

    console.log("🧠 SENT TEXT:", combinedText);

    const sessionPayload = {
      user_id: userId,
      lesson_id: lessonId,
      spoken_text: combinedText,
    };

    const res = await API.post("/sessions/", sessionPayload);

    console.log("✅ Backend response:", res.data);

    const backendMetrics = res.data?.metrics || res.data || {};

    setResult({
      accuracy: backendMetrics.accuracy ?? 0,
      wpm: backendMetrics.wpm ?? 0,
      errors: backendMetrics.errors ?? [],
      feedback:
        backendMetrics.recommendations ||
        backendMetrics.feedback ||
        "Keep practicing!",
    });

    alert("✅ Session analyzed successfully!");
  } catch (err) {
    console.error("❌ Submit failed:", err);
    alert("❌ Failed to submit session. Check console.");
  }
};


  // --- Render ---
  if (!lessonId) return <p className="text-center mt-10">No lesson selected.</p>;
  if (error)
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!lesson) return <p className="text-center mt-10">Loading lesson...</p>;

  return (
  <div className="min-h-screen bg-[#f7f4ed] flex justify-center p-6">
    <div className="w-full max-w-4xl bg-[#fffdf8] rounded-3xl shadow-xl p-8 border border-gray-200">

      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center tracking-wide">
        {lesson.title}
      </h2>

      {/* ✅ Dyslexia-Friendly Reading Area */}
      <div
        className="rounded-xl bg-[#faf7f2] p-6 mb-6"
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "1.8rem",
          lineHeight: "2.6rem",
          letterSpacing: "0.05em",
        }}
      >
        {highlights.length > 0 ? (
          <div>
            {highlights.map((h, i) => (
              <span
                key={i}
                className="inline-block px-2 py-1 rounded-md mr-1 mb-1 transition-all"
                style={{
                  background:
                    h.color === "green"
                      ? "#bbf7d0"
                      : h.color === "orange"
                        ? "#fde68a"
                        : "#f1f5f9",
                  color: "#1f2933",
                  fontWeight: h.color !== "gray" ? 700 : 500,
                }}
              >
                {h.word}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-800 whitespace-pre-line">
            {lesson.content}
          </p>
        )}
      </div>

      {/* ✅ Large High-Contrast Controls */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <button
          onClick={startListening}
          disabled={listening}
          className="px-8 py-4 rounded-xl bg-blue-700 text-white text-lg font-bold hover:bg-blue-500 disabled:opacity-50"
        >
          🎙️ Start Reading
        </button>

        <button
          onClick={stopListening}
          disabled={!listening}
          className="px-8 py-4 rounded-xl bg-red-700 text-white text-lg font-bold hover:bg-red-500 disabled:opacity-50"
        >
          ⏹️ Stop
        </button>

        <button
          onClick={resetSession}
          className="px-8 py-4 rounded-xl bg-gray-800 text-white text-lg font-bold hover:bg-black"
        >
          Reset
        </button>

        <button
          onClick={submitSession}
          className="px-8 py-4 rounded-xl bg-green-700 text-white text-lg font-bold hover:bg-green-500"
        >
          ✅ Submit
        </button>
      </div>

      {listening && (
        <div className="text-center text-green-700 font-bold text-lg mb-4">
          🎤 Listening...
        </div>
      )}

      {/* ✅ Large Live Transcript */}
      <div className="bg-gray-100 p-4 rounded-xl">
        <div className="text-sm text-gray-600 mb-1">Live transcript</div>
        <div
          className="text-gray-900"
          style={{
            fontFamily: "OpenDyslexic, Arial, sans-serif",
            fontSize: "1.2rem",
            lineHeight: "2rem",
          }}
        >
          {transcript || "(Speak to begin)"}
        </div>
      </div>

      {/* ✅ Results */}
      {result && (
  <div className="mt-6 bg-white shadow rounded-xl p-6 border">
    <h4 className="text-2xl font-bold mb-3 text-blue-700">
      Your Reading Analysis
    </h4>

    <p className="text-lg mb-1">
      🎯 Accuracy: <strong>{result.accuracy}%</strong>
    </p>
    <p className="text-lg mb-1">
      ⚡ WPM: <strong>{result.wpm}</strong>
    </p>

    {result.errors?.length > 0 && (
      <p className="text-red-600 mt-2">
        Skipped words: {result.errors.join(", ")}
      </p>
    )}

    {result.feedback && (
      <p className="mt-3 text-green-800 font-semibold">
        💬 {result.feedback}
      </p>
    )}

    {/* ✅ EXIT BUTTON */}
    <button
      onClick={() => navigate("/student/lessons")}
      className="mt-6 w-full px-6 py-3 rounded-xl bg-purple-700 text-white text-lg font-bold hover:bg-purple-500"
    >
      ⬅️ Back to Lessons
    </button>
  </div>
)}

    </div>
  </div>
);
}
