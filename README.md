📘 LexiLearn — AI-Powered Reading Assistant for Dyslexic Learners

LexiLearn is an intelligent reading assistance web application designed specifically for dyslexic learners. It helps improve reading fluency using voice-based practice, real-time word-level feedback, and AI-powered performance analysis.

The platform currently supports:

👩‍🎓 Students – to practice and track reading progress

👨‍🏫 Teachers – to manage lessons and monitor performance

Built using React (Vite) for the frontend and FastAPI + SQLModel for the backend.


🚀 Key Features

✅ Student Features

🎙️ Voice-based Reading Practice
🟢 Real-time Word Highlighting (Correct / Near / Skipped)
⚡ WPM & Accuracy Analysis
📊 Progress Dashboard with Charts
🧩 Gamified Lesson Unlock System
🏆 Motivational Performance Feedback

✅ Teacher Features

📚 Create, Edit & Delete Lessons
📈 View Student Reading Sessions
🧠 Track Accuracy & Speed Trends


✅ System Features

🔐 JWT-based Authentication
🎯 Role-based Routing (Student & Teacher)
📡 Real-time Speech Recognition (Web Speech API)
🧠 AI Scoring & Analysis
📊 Data Visualization with Charts


🛠️ Tech Stack

Frontend

React (Vite)
Tailwind CSS
Framer Motion
Recharts
Web Speech API

Backend

FastAPI
SQLModel
Uvicorn
JWT Authentication
SQLite / PostgreSQL


🏗️ Project Structure

LexiLearn/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── auth.py
│   │   ├── routes/
│   │   └── db.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── context/
    │   └── services/
    └── package.json


⚙️ How to Run the Project

✅ 1. Run Backend (FastAPI)
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

Backend will run on:

http://127.0.0.1:8000


✅ 2. Run Frontend (React + Vite)
cd frontend
npm install
npm run dev

Frontend will run on:

http://localhost:5173


🔐 User Roles & Login Flow
Role	Access
Student	Lessons, Practice, Progress Dashboard
Teacher	Lesson Management, Student Sessions
🧠 AI-Based Reading Evaluation


LexiLearn analyzes:

✅ Pronunciation correctness
✅ Word skipping
✅ Near matches
✅ Accuracy percentage
✅ Words Per Minute (WPM)

All results are stored per session for visual analysis.


🎯 Purpose of This Project

Dyslexic learners often struggle with:

Slow reading speed
Word skipping
Low reading confidence

LexiLearn aims to:
✅ Improve reading accuracy
✅ Provide instant corrective feedback
✅ Visualize long-term growth
✅ Assist teachers in tracking performance


👩‍💻 Developed By

LexiLearn Team

✅ Future Improvements

👨‍👩‍👧 Parent dashboard & monitoring
🔊 Regional language support
🏆 XP, badges & leaderboard
📱 Mobile app version
📈 Advanced AI pronunciation scoring


✅ Project Status

✔️ Fully functional
✔️ Real-time speech feedback
✔️ Role-based dashboards (Student & Teacher)
✔️ Gamified learning
✔️ Ready for academic evaluation