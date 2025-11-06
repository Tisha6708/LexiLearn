# backend/app/performance_model.py
import numpy as np
from sklearn.linear_model import LogisticRegression
import joblib
import os

# --- train once (dummy data for mini project) ---
def train_performance_model():
    # Features: [WPM, Difficulty (1=Easy, 2=Medium, 3=Hard)]
    X = np.array([
        [80, 1], [90, 1], [100, 2],
        [60, 2], [45, 3], [30, 3],
        [110, 2], [75, 2], [50, 3]
    ])
    # Labels: 2=Good, 1=Average, 0=Needs Practice
    y = np.array([2, 2, 2, 1, 0, 0, 2, 1, 0])

    model = LogisticRegression(max_iter=200)
    model.fit(X, y)
    joblib.dump(model, "performance_model.pkl")
    print("✅ Model trained and saved!")


# --- make prediction ---
def predict_performance(wpm: float, difficulty: int):
    # train if not exists
    if not os.path.exists("performance_model.pkl"):
        train_performance_model()

    model = joblib.load("performance_model.pkl")
    pred = model.predict([[wpm, difficulty]])[0]

    levels = {0: "Needs Practice 💪", 1: "Average 👍", 2: "Good Performance 🌟"}
    return {"performance_level": levels[pred]}
