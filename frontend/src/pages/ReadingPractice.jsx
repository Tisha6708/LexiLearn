import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";

export default function ReadingPractice() {
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get("lessonId");

  const [lesson, setLesson] = useState(null);
  const [listening, setListening] = useState(false);
  const [reading, setReading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [highlights, setHighlights] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [readingIndex, setReadingIndex] = useState(-1);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  const startTimeRef = useRef(null);
  const stopTimeRef = useRef(null);

  const normalize = (w) =>
    w.replace(/[\u2018\u2019\u201C\u201D"'(){}\[\],.!?:;—–<>\/\\]/g, "").trim().toLowerCase();

  // fetch lesson content
  useEffect(() => {
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

    // Cleanup when component unmounts (stop both speech + recognition)
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, [lessonId]);

  // --- Text-to-Speech (Read Aloud) ---
  const startReading = () => {
    if (!lesson) return;
    const synth = synthRef.current;
    if (synth.speaking) synth.cancel();

    const words = lesson.content.split(/\s+/);
    let currentIndex = 0;
    setReading(true);
    setReadingIndex(0);

    const utter = new SpeechSynthesisUtterance(lesson.content);
    utter.lang = "en-US";
    utter.rate = 0.95; // slightly slower for dyslexic users
    utter.pitch = 1.0;
    utter.volume = 1.0;

    utter.onboundary = (event) => {
      if (event.name === "word" || event.charIndex) {
        const word = words[currentIndex];
        setReadingIndex(currentIndex);
        currentIndex++;
      }
    };

    utter.onend = () => {
      setReading(false);
      setReadingIndex(-1);
    };

    utter.onerror = (e) => {
      console.error("Speech synthesis error", e);
      setReading(false);
      setReadingIndex(-1);
    };

    utteranceRef.current = utter;
    synth.speak(utter);
  };

  const stopReading = () => {
    const synth = synthRef.current;
    if (synth && synth.speaking) synth.cancel();
    setReading(false);
    setReadingIndex(-1);
  };

  // --- Speech-to-text (user reading) setup ---
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      recognitionRef.current = null;
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
      if (final) setFinalTranscript((prev) => (prev + " " + final).trim());
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error", e);
      setError("Speech recognition error: " + (e.error || "unknown"));
    };

    recognition.onend = () => {
      setListening(false);
      stopTimeRef.current = Date.now();
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [finalTranscript]);

  const startListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setError("SpeechRecognition not supported in this browser. Use Chrome or Edge.");
      return;
    }
    setTranscript("");
    setFinalTranscript("");
    setResult(null);
    startTimeRef.current = Date.now();
    try {
      recognition.start();
      setListening(true);
    } catch (e) {
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
  };

  const submitSession = async () => {
    try {
      const token = localStorage.getItem("lexi_token");
      const user = token ? JSON.parse(atob(token.split(".")[1])) : null;
      const payload = {
        user_id: user?.sub,
        lesson_id: lessonId,
        spoken_text: finalTranscript || transcript,
      };
      const res = await API.post("/sessions/", payload);
      setResult(res.data.metrics);
      alert("Session submitted successfully!");
    } catch (err) {
      console.error("Error submitting practice:", err);
      alert("Submission failed. Check console for details.");
    }
  };

  if (!lessonId) return <p className="text-center mt-10">No lesson selected.</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!lesson) return <p className="text-center mt-10">Loading lesson...</p>;

  // Split words for dynamic reading highlights
  const words = lesson.content.split(/\s+/);

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8">
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
        <h2 className="text-3xl font-bold text-blue-600 mb-4 text-center">
          {lesson.title}
        </h2>

        <div className="text-lg leading-relaxed mb-6 text-gray-800">
          {words.map((word, idx) => (
            <span
              key={idx}
              className={`inline-block mr-1 transition-all duration-150 ${
                idx === readingIndex
                  ? "bg-yellow-300 text-gray-900 font-semibold px-1 rounded"
                  : ""
              }`}
            >
              {word}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            onClick={startReading}
            disabled={reading}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50"
          >
            🔊 Read Aloud
          </button>
          <button
            onClick={stopReading}
            disabled={!reading}
            className="px-5 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 disabled:opacity-50"
          >
            ⏹ Stop Reading
          </button>
          <button
            onClick={startListening}
            disabled={listening}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
          >
            🎙 Start Practice
          </button>
          <button
            onClick={stopListening}
            disabled={!listening}
            className="px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 disabled:opacity-50"
          >
            ⏹ Stop Practice
          </button>
        </div>

        {transcript && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 mb-4">
            <strong>Your Speech:</strong> {transcript}
          </div>
        )}

        {result && (
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-2 text-blue-700">
              Your Results 📊
            </h4>
            <p>Accuracy: {result.accuracy}%</p>
            <p>WPM: {result.wpm}</p>
          </div>
        )}

        <div className="flex justify-center mt-4">
          <button
            onClick={submitSession}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 shadow"
          >
            ✅ Submit Practice
          </button>
        </div>
      </div>
    </div>
  );
}
