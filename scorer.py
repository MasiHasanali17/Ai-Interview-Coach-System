# Pure logic file — no AI needed here
# Handles all scoring calculations

# Weights for each test in final score
TEST_WEIGHTS = {
    "mcq_technical": 0.30,   # 30%
    "written":       0.25,   # 25%
    "aptitude":      0.20,   # 20%
    "soft_skills":   0.15,   # 15%
    "project":       0.10,   # 10%
}

TEST_NAMES = {
    "mcq_technical": "Technical Knowledge",
    "written":       "Knowledge Depth",
    "aptitude":      "Aptitude & Reasoning",
    "soft_skills":   "Soft Skills",
    "project":       "Project Deep Dive",
}


def score_mcq_batch(submissions: list) -> dict:
    """
    Score a list of MCQ answers.
    Each submission: {question_id, selected_answer, correct_answer, explanation}
    Returns per-question results + total correct + score out of 10.
    """
    results = []
    correct_count = 0

    for sub in submissions:
        is_correct = sub["selected_answer"] == sub["correct_answer"]
        if is_correct:
            correct_count += 1

        results.append({
            "question_id":      sub["question_id"],
            "selected_answer":  sub["selected_answer"],
            "correct_answer":   sub["correct_answer"],
            "is_correct":       is_correct,
            "explanation":      sub.get("explanation", "")
        })

    total = len(submissions)
    percentage = (correct_count / total * 100) if total > 0 else 0
    score_out_of_10 = round((correct_count / total) * 10, 1) if total > 0 else 0

    return {
        "results":          results,
        "correct":          correct_count,
        "total":            total,
        "percentage":       round(percentage, 1),
        "score_out_of_10":  score_out_of_10
    }


def calculate_test_score(test_type: str, answers: list, total_questions: int) -> dict:
    """
    Calculate score for one complete test after all questions answered.
    For MCQ tests: counts correct answers.
    For AI-evaluated tests: averages the AI scores.
    """
    if not answers:
        return {
            "test_type":        test_type,
            "test_name":        TEST_NAMES.get(test_type, test_type),
            "score":            0,
            "total":            total_questions,
            "percentage":       0,
            "score_out_of_10":  0
        }

    if test_type in ["mcq_technical", "aptitude"]:
        # answers = list of booleans (True/False per question)
        correct = sum(1 for a in answers if a is True)
        percentage = (correct / total_questions) * 100
        score = round((correct / total_questions) * 10, 1)

    else:
        # answers = list of AI scores (integers 1-10)
        avg = sum(answers) / len(answers)
        percentage = avg * 10
        score = round(avg, 1)
        correct = None  # not applicable for written tests

    return {
        "test_type":        test_type,
        "test_name":        TEST_NAMES.get(test_type, test_type),
        "score":            score,
        "total":            10,
        "percentage":       round(percentage, 1),
        "score_out_of_10":  score,
        "correct":          correct
    }


def calculate_overall_score(test_scores: list) -> dict:
    """
    Calculate weighted overall score across all completed tests.
    If Test 5 (project) was skipped, redistribute its weight equally.

    test_scores = [
        {"test_type": "mcq_technical", "score": 7.5, ...},
        ...
    ]
    """
    completed_types = {ts["test_type"] for ts in test_scores}

    # Recalculate weights if project test was skipped
    active_weights = {
        t: w for t, w in TEST_WEIGHTS.items()
        if t in completed_types
    }

    # Normalize so weights still add to 1.0
    total_weight = sum(active_weights.values())
    normalized = {
        t: w / total_weight
        for t, w in active_weights.items()
    }

    # Calculate weighted score
    weighted_sum = 0
    for ts in test_scores:
        t = ts["test_type"]
        weight = normalized.get(t, 0)
        weighted_sum += ts["score_out_of_10"] * weight

    overall = round(weighted_sum, 1)
    percentage = round(overall * 10, 1)

    # Determine rating
    if overall >= 8.5:
        rating = "Elite"
    elif overall >= 7.0:
        rating = "Strong"
    elif overall >= 5.5:
        rating = "Developing"
    else:
        rating = "Needs Work"

    # Readiness score (0-100)
    readiness = min(100, int(percentage))

    return {
        "overall_score":      overall,
        "overall_percentage": percentage,
        "rating":             rating,
        "readiness_score":    readiness,
        "test_breakdown":     test_scores,
        "weights_used":       normalized
    }


def get_performance_label(score: float) -> str:
    """Returns emoji label for any score out of 10."""
    if score >= 9:
        return "🏆 Outstanding"
    elif score >= 7.5:
        return "⭐ Excellent"
    elif score >= 6:
        return "✅ Good"
    elif score >= 4:
        return "⚠️ Average"
    else:
        return "❌ Needs Work"