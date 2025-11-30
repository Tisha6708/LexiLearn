# import difflib

# def calculate_accuracy(spoken_text: str, reference_text: str):
#     """Compare spoken text with reference and return similarity %."""
#     spoken_words = spoken_text.lower().split()
#     ref_words = reference_text.lower().split()

#     matcher = difflib.SequenceMatcher(None, spoken_words, ref_words)
#     accuracy = round(matcher.ratio() * 100, 2)

#     # Find missing or incorrect words (for simple feedback)
#     errors = [word for word in ref_words if word not in spoken_words]

#     return {
#         "accuracy": accuracy,
#         "errors": errors[:5],  # show top few differences
#         "recommendations": "Focus on pronouncing the highlighted words clearly."
#     }


import re
from difflib import SequenceMatcher


def normalize(word: str) -> str:
    """Lowercase and remove punctuation."""
    return re.sub(r"[^\w]", "", word.lower())


def is_near_match(a: str, b: str) -> bool:
    """Allow small pronunciation/spelling variations."""
    return SequenceMatcher(None, a, b).ratio() >= 0.8


def calculate_accuracy(spoken_text: str, reference_text: str):
    """
    Word-level, order-aware reading accuracy.
    Returns:
      - accuracy (0–100)
      - errors (truly missed words)
      - recommendations (simple feedback)
    """

    expected = [normalize(w) for w in reference_text.split() if normalize(w)]
    spoken = [normalize(w) for w in spoken_text.split() if normalize(w)]

    matched = [False] * len(expected)
    used_spoken = [False] * len(spoken)

    # --- Word Alignment ---
    for i, exp in enumerate(expected):

        # 1) Try direct positional match
        if i < len(spoken) and not used_spoken[i]:
            if exp == spoken[i] or is_near_match(exp, spoken[i]):
                matched[i] = True
                used_spoken[i] = True
                continue

        # 2) Search ahead for nearest unused match
        for j in range(len(spoken)):
            if not used_spoken[j] and (
                exp == spoken[j] or is_near_match(exp, spoken[j])
            ):
                matched[i] = True
                used_spoken[j] = True
                break

    # --- Metrics ---
    total = len(expected)
    correct = sum(matched)

    accuracy = round((correct / total) * 100, 2) if total else 0

    # Only true missing words (never matched at all)
    original_expected_words = reference_text.split()
    errors = [
        original_expected_words[i]
        for i, ok in enumerate(matched)
        if not ok
    ][:5]  # limit to top 5

    # --- Feedback ---
    if accuracy > 85:
        rec = "Excellent reading! Keep it up! 🎉"
    elif accuracy > 60:
        rec = "Good effort! Try reading a bit more slowly and clearly. 👍"
    else:
        rec = "Keep practicing. Focus on pronunciation and pacing. 💪"

    return {
        "accuracy": accuracy,
        "errors": errors,
        "recommendations": rec,
    }
