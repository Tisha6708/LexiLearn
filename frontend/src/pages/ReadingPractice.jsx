import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";

export default function ReadingPractice() {
  const [searchParams] = useSearchParams();
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

  // --- utility helpers ---
  const normalize = (w) =>
    w.replace(/[\u2018\u2019\u201C\u201D"'(){}\[\],.!?:;—–<>\/\\]/g, "")
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

  const computeHighlights = (expectedText, spokenText) => {
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
  };

  const computeResultMetrics = (highlightsArr) => {
    const total = highlightsArr.length;
    const correct = highlightsArr.filter((h) => h.color === "green").length;
    const near = highlightsArr.filter((h) => h.color === "orange").length;
    const accuracy = total ? Math.round(((correct + near * 0.5) / total) * 100) : 0;

    const start = startTimeRef.current;
    const end = stopTimeRef.current || Date.now();
    const minutes = Math.max((end - start) / 60000, 1 / 60);
    const spokenCount = finalTranscript.split(/\s+/).filter(Boolean).length;
    const wpm = Math.round(spokenCount / minutes);

    return { total, correct, near, accuracy, wpm };
  };

  // --- fetch lesson ---
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

  // --- initialize SpeechRecognition once ---
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

      const combined = (finalTranscript + " " + final + interim).trim();
      setTranscript(combined);

      if (lesson?.content && combined) {
        const h = computeHighlights(lesson.content, combined);
        setHighlights(h);
      }

      if (final) {
        setFinalTranscript((prev) => (prev + " " + final).trim());
      }
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
      if (e.error === "network") {
        setError("⚠️ Speech recognition requires internet and HTTPS. Please check your connection.");
      } else if (e.error === "not-allowed") {
        setError("🎤 Microphone access denied. Please allow microphone permission.");
      } else if (e.error === "no-speech") {
        setError("No speech detected. Try again.");
      } else {
        setError("Speech recognition error: " + (e.error || "unknown"));
      }
    };


    recognition.onend = () => {
      console.log("Speech recognition stopped.");
      setListening(false);
      stopTimeRef.current = Date.now();

      if (lesson?.content) {
        const h = computeHighlights(lesson.content, finalTranscript || transcript);
        setHighlights(h);
        setResult(computeResultMetrics(h));
      }
    };

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, [lesson, finalTranscript, transcript]);

  // --- controls ---
  const startListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return setError("SpeechRecognition not supported.");
    if (listening) return;

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

  const submitSession = async () => {
    try {
      const rawToken = localStorage.getItem("lexi_token");
      const payloadUser = rawToken ? JSON.parse(atob(rawToken.split(".")[1])) : null;
      const userId = payloadUser?.sub || payloadUser?.id;

      const sessionPayload = {
        user_id: userId,
        lesson_id: lessonId,
        spoken_text: finalTranscript || transcript,
      };

      const res = await API.post("/sessions/", sessionPayload);

      // get backend metrics (with ML results)
      const backendMetrics = res.data.metrics;

      setResult({
        accuracy: backendMetrics.accuracy,
        wpm: backendMetrics.wpm,
        errors: backendMetrics.errors || [],
        feedback: backendMetrics.recommendations || "Keep practicing!",
      });

      alert("✅ Session analyzed successfully!");
    } catch (err) {
      console.error("Error submitting session:", err);
      alert("❌ Failed to submit session. Check console for details.");
    }
  };


  // --- render ---
  if (!lessonId) return <p className="text-center mt-10">No lesson selected.</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-600">
        {error}
      </p>
    );
  if (!lesson) return <p className="text-center mt-10">Loading lesson...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">{lesson.title}</h2>

      {/* Lesson content with live highlights */}
      <div className="prose mb-4 leading-8">
        {highlights.length > 0 ? (
          <div>
            {highlights.map((h, i) => (
              <span
                key={i}
                className="mr-1 inline-block px-0.5 py-0.5 rounded"
                style={{
                  color:
                    h.color === "green"
                      ? "#166534"
                      : h.color === "orange"
                        ? "#b45309"
                        : "#6b7280",
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

      {/* Controls */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={startListening}
          disabled={listening}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-400 disabled:opacity-50"
        >
          🎙️ Start Reading
        </button>

        <button
          onClick={stopListening}
          disabled={!listening}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-400 text-white disabled:opacity-50"
        >
          ⏹️ Stop
        </button>

        <button onClick={resetSession} className="px-4 py-2 rounded hover:bg-black hover:text-white border">
          Reset
        </button>

        <button
          onClick={submitSession}
          className="ml-auto px-4 py-2 rounded bg-green-600 text-white"
        >
          Submit Practice
        </button>
      </div>

      {listening && (
        <div className="text-green-600 font-medium mb-3">🎤 Listening...</div>
      )}

      {/* Live transcript */}
      <div className="mt-3 bg-gray-50 p-3 rounded">
        <div className="text-sm text-gray-500">Live transcript:</div>
        <div className="mt-1 text-sm text-gray-800 min-h-[2rem]">
          {transcript || "(say something...)"}
        </div>
      </div>

      {/* Result box */}
      {result && (
        <div className="mt-6 bg-white shadow rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-2 text-blue-600">Your Results (AI Analysis)</h4>

          <p>🎯 Accuracy: <strong>{result.accuracy}%</strong></p>
          <p>⚡ Words Per Minute: <strong>{result.wpm}</strong></p>

          {result.errors?.length > 0 && (
            <p className="text-sm text-red-600 mt-2">
              Missing or skipped words: {result.errors.join(", ")}
            </p>
          )}

          {result.performance && (
            <p className="mt-2 text-green-700 font-semibold">
              🌟 Performance: {result.performance}
            </p>
          )}
          

          {result.feedback && (
            <p className="mt-3 text-blue-700 font-medium">
              💬 Feedback: {result.feedback}
            </p>
          )}
        </div>
      )}

    </div>
  );
}
