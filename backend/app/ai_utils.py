import difflib

def calculate_accuracy(spoken_text: str, reference_text: str):
    """Compare spoken text with reference and return similarity %."""
    spoken_words = spoken_text.lower().split()
    ref_words = reference_text.lower().split()

    matcher = difflib.SequenceMatcher(None, spoken_words, ref_words)
    accuracy = round(matcher.ratio() * 100, 2)

    # Find missing or incorrect words (for simple feedback)
    errors = [word for word in ref_words if word not in spoken_words]

    return {
        "accuracy": accuracy,
        "errors": errors[:5],  # show top few differences
        "recommendations": "Focus on pronouncing the highlighted words clearly."
    }
