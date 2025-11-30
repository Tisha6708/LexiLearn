# # backend/app/ai_utils.py
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity

# def calculate_accuracy(spoken_text: str, expected_text: str):
#     """
#     Compare user's spoken text and lesson text using cosine similarity.
#     Returns accuracy %, missing words, and simple recommendations.
#     """
#     # --- 1. Compute text similarity ---
#     vectorizer = TfidfVectorizer().fit([spoken_text, expected_text])
#     vectors = vectorizer.transform([spoken_text, expected_text])
#     similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
#     accuracy = round(similarity * 100, 2)

#     # --- 2. Identify missing words (basic diff check) ---
#     spoken_words = set(spoken_text.lower().split())
#     expected_words = set(expected_text.lower().split())
#     missing = list(expected_words - spoken_words)
# ent reading! Keep it up! 🎉"
#     elif accuracy > 6
#     # --- 3. Simple recommendation based on score ---
#     if accuracy > 85:
#         rec = "Excell0:
#         rec = "Good effort! Try reading a bit more slowly and clearly. 👍"
#     else:
#         rec = "Keep practicing. Focus on pronunciation and pacing. 💪"

#     return {
#         "accuracy": accuracy,
#         "errors": missing[:10],  # show only first 10 missing words
#         "recommendations": rec,
#     }


import re
from difflib import SequenceMatcher

def normalize(word: str):
    return re.sub(r"[^\w]", "", word.lower())

def is_near_match(a: str, b: str):
    return SequenceMatcher(None, a, b).ratio() >= 0.8

def calculate_accuracy(spoken_text: str, expected_text: str):
    expected = [normalize(w) for w in expected_text.split() if normalize(w)]
    spoken = [normalize(w) for w in spoken_text.split() if normalize(w)]

    matched = [False] * len(expected)
    used_spoken = [False] * len(spoken)

    for i, exp in enumerate(expected):
        # direct positional match
        if i < len(spoken) and not used_spoken[i]:
            if exp == spoken[i] or is_near_match(exp, spoken[i]):
                matched[i] = True
                used_spoken[i] = True
                continue

        # search forward for a near match
        for j in range(len(spoken)):
            if not used_spoken[j] and (exp == spoken[j] or is_near_match(exp, spoken[j])):
                matched[i] = True
                used_spoken[j] = True
                break

    total = len(expected)
    correct = sum(matched)

    accuracy = round((correct / total) * 100, 2) if total else 0

    missing_words = [
        expected_text.split()[i]
        for i, ok in enumerate(matched)
        if not ok
    ][:10]

    if accuracy > 85:
        rec = "Excellent reading! Keep it up! 🎉"
    elif accuracy > 60:
        rec = "Good effort! Try to slow down and pronounce each word clearly. 👍"
    else:
        rec = "Keep practicing. Focus on accuracy and pacing. 💪"

    return {
        "accuracy": accuracy,
        "errors": missing_words,
        "recommendations": rec,
    }
