# backend/app/ai_utils.py
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_accuracy(spoken_text: str, expected_text: str):
    """
    Compare user's spoken text and lesson text using cosine similarity.
    Returns accuracy %, missing words, and simple recommendations.
    """
    # --- 1. Compute text similarity ---
    vectorizer = TfidfVectorizer().fit([spoken_text, expected_text])
    vectors = vectorizer.transform([spoken_text, expected_text])
    similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    accuracy = round(similarity * 100, 2)

    # --- 2. Identify missing words (basic diff check) ---
    spoken_words = set(spoken_text.lower().split())
    expected_words = set(expected_text.lower().split())
    missing = list(expected_words - spoken_words)
ent reading! Keep it up! 🎉"
    elif accuracy > 6
    # --- 3. Simple recommendation based on score ---
    if accuracy > 85:
        rec = "Excell0:
        rec = "Good effort! Try reading a bit more slowly and clearly. 👍"
    else:
        rec = "Keep practicing. Focus on pronunciation and pacing. 💪"

    return {
        "accuracy": accuracy,
        "errors": missing[:10],  # show only first 10 missing words
        "recommendations": rec,
    }
