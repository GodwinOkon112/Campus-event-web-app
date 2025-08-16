import sys
import json
import re
import statistics

# ------------------------------
# Bot Detection Helper Functions
# ------------------------------

def is_missing_fields(user_data):
    required_fields = ["name", "email", "phone"]
    return any(not str(user_data.get(f, "")).strip() for f in required_fields)

def is_invalid_email(email):
    return not re.match(r"[^@]+@[^@]+\.[^@]+", email)

def is_invalid_phone(phone):
    digits = re.sub(r"\D", "", phone)
    return len(digits) < 10

def contains_spam_keywords(text):
    spam_keywords = ["buy now", "click here", "free money", "viagra", "lottery", "cheap pills"]
    return any(keyword in text.lower() for keyword in spam_keywords)

def is_submission_too_fast(submission_time_ms):
    return submission_time_ms < 15000

def is_typing_pattern_suspicious(per_field_intervals):
    """
    Expects per_field_intervals as a dict, e.g.:
    {
        "name": [120, 100, 110],
        "email": [130, 125, 140],
        "phone": [150, 160]
    }
    """
    if not per_field_intervals:
        return False
    for field, intervals in per_field_intervals.items():
        if not intervals:
            continue
        stdev = statistics.pstdev(intervals)
        if stdev < 15:  # very uniform typing -> suspicious
            return True
    return False

def is_user_agent_suspicious(user_agent):
    bot_signatures = ["bot", "crawler", "spider", "scraper", "curl", "wget", "python-requests"]
    ua_lower = user_agent.lower()
    return any(sig in ua_lower for sig in bot_signatures)

def is_language_suspicious(lang):
    return not lang or lang.lower() in ["c", "xx", "null"]

# ------------------------------
# Main Bot Detection Logic
# ------------------------------

def check_bot(user_data):
    reasons = []

    if is_missing_fields(user_data):
        reasons.append("Missing required fields")
    if is_invalid_email(user_data.get("email", "")):
        reasons.append("Invalid email")
    if is_invalid_phone(user_data.get("phone", "")):
        reasons.append("Invalid phone")
    
    combined_text = f"{user_data.get('name','')} {user_data.get('email','')}"
    if contains_spam_keywords(combined_text):
        reasons.append("Contains spam keywords")
    
    if is_submission_too_fast(user_data.get("submissionTimeMs", 2000)):
        reasons.append("Submission too fast")
    
    if is_typing_pattern_suspicious(user_data.get("keystrokeIntervals", {})):
        reasons.append("Suspicious typing pattern")

    # Mouse pattern removed per request

    if is_user_agent_suspicious(user_data.get("userAgent", "")):
        reasons.append("Suspicious user agent")
    
    if is_language_suspicious(user_data.get("acceptLanguage", "")):
        reasons.append("Suspicious language header")

    is_bot = len(reasons) > 0
    confidence = 1.0 if is_bot else 0.0
    reason_text = "; ".join(reasons) if is_bot else "No issues detected"

    return {"isBot": is_bot, "confidenceScore": confidence, "reason": reason_text}

# ------------------------------
# Script Entry Point
# ------------------------------

if __name__ == "__main__":
    try:
        raw_input = sys.argv[1]
        data = json.loads(raw_input)
        result = check_bot(data)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
