import React, { useState, useEffect, useRef } from "react";

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState(() => {
        try {
            const raw = localStorage.getItem("floating_chat_history");
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    });
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const listRef = useRef(null);

    useEffect(() => {
        localStorage.setItem("floating_chat_history", JSON.stringify(messages));
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages]);

    const getChatContext = () => {
        // Return the last 10 messages as context memory
        const contextMessages = messages.slice(-10).map((m) => `${m.role}: ${m.text}`).join("\n");
        return contextMessages;
    };

    const sendMessage = async () => {
        const text = input.trim();
        if (!text) return;

        const userMsg = { id: Date.now() + "-user", role: "user", text };
        setMessages((m) => [...m, userMsg]);
        setInput("");
        setLoading(true);
        setError(null);

        try {
            const context = getChatContext();
            const fullPrompt = `${context}\nuser: ${text}`;

            const resp = await fetch("http://127.0.0.1:8000/chatbot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: fullPrompt }),
            });

            if (!resp.ok) {
                const errText = await resp.text();
                throw new Error(errText || `HTTP ${resp.status}`);
            }

            const data = await resp.json();
            const botMsg = {
                id: Date.now() + "-bot",
                role: "bot",
                text: data.reply ?? data.message ?? "(no reply)",
            };

            setMessages((m) => [...m, botMsg]);
        } catch (err) {
            console.error("Chatbot error:", err);
            setError(err.message || "An error occurred");
            const errMsg = { id: Date.now() + "-err", role: "bot", text: "Error: " + (err.message || "Unknown") };
            setMessages((m) => [...m, errMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!loading) sendMessage();
        }
    };

    const clearHistory = () => {
        setMessages([]);
        localStorage.removeItem("floating_chat_history");
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className="flex flex-col items-end">
                {open && (
                    <div className="mb-2 text-right">
                        <button
                            onClick={clearHistory}
                            className="mr-2 px-3 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200"
                            title="Clear chat"
                        >
                            Clear
                        </button>
                        <button
                            onClick={() => setOpen(false)}
                            className="px-3 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200"
                            title="Close chat"
                        >
                            Close
                        </button>
                    </div>
                )}

                <div
                    className={`transform transition-all duration-200 ease-in-out ${open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
                    style={{ width: 460, maxWidth: "calc(100vw - 32px)" }}
                >
                    {open && (
                        <div className="flex flex-col bg-white shadow-2xl rounded-2xl overflow-hidden" style={{ height: 580 }}>
                            <div className="px-4 py-3 bg-blue-600 text-white flex items-center justify-between">
                                <div className="font-semibold">LexiLearn Chat</div>
                            </div>

                            <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                                {messages.length === 0 && (
                                    <div className="text-sm text-gray-500">Say hi — ask the bot anything related to learning!</div>
                                )}

                                {messages.map((m) => (
                                    <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                        <div
                                            className={`max-w-[78%] px-3 py-2 rounded-lg break-words ${m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"}`}
                                        >
                                            {m.text}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-3 border-t bg-white flex items-center">
                                <textarea
                                    rows="1"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message..."
                                    className="flex-1 resize-none border rounded-lg p-2 mr-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60"
                                >
                                    {loading ? "..." : "Send"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {!open && (
                    <button
                        onClick={() => setOpen(true)}
                        className="p-4 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition"
                        title="Open chat"
                    >
                        💬
                    </button>
                )}
            </div>
        </div>
    );
}
