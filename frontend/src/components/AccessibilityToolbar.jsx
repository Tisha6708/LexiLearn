import { useState, useEffect } from "react";

export default function AccessibilityToolbar() {
  const [fontSize, setFontSize] = useState(16);
  const [isDyslexicFont, setIsDyslexicFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    document.body.style.fontFamily = isDyslexicFont ? "'OpenDyslexic', Arial" : "Inter, sans-serif";
    document.body.style.backgroundColor = darkMode
      ? "#1a1a1a"
      : highContrast
      ? "#fff"
      : "#f9fafb";
    document.body.style.color = darkMode ? "#f1f1f1" : highContrast ? "#000" : "#333";
  }, [fontSize, isDyslexicFont, highContrast, darkMode]);

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg border rounded-lg p-3 z-50 text-sm space-y-2 w-64">
      <h3 className="font-semibold text-center text-blue-600">Accessibility Tools</h3>
      <div className="flex justify-between items-center">
        <span>Font Size</span>
        <div className="space-x-2">
          <button
            onClick={() => setFontSize((s) => Math.max(12, s - 2))}
            className="bg-gray-200 px-2 rounded"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize((s) => Math.min(24, s + 2))}
            className="bg-gray-200 px-2 rounded"
          >
            A+
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span>Dyslexia Font</span>
        <input
          type="checkbox"
          checked={isDyslexicFont}
          onChange={() => setIsDyslexicFont(!isDyslexicFont)}
        />
      </div>

      <div className="flex justify-between items-center">
        <span>High Contrast</span>
        <input
          type="checkbox"
          checked={highContrast}
          onChange={() => setHighContrast(!highContrast)}
        />
      </div>

      <div className="flex justify-between items-center">
        <span>Dark Mode</span>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </div>
    </div>
  );
}
