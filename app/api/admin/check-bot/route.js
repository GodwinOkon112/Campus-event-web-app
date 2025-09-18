// ------------------------------
// Bot Detection Helper Functions
// ------------------------------

function isMissingFields(userData) {
  const requiredFields = ["name", "email", "phone"];
  return requiredFields.some((f) => !String(userData[f] || "").trim());
}

function isInvalidEmail(email) {
  const regex = /^[^@]+@[^@]+\.[^@]+$/;
  return !regex.test(email);
}

function isInvalidPhone(phone) {
  const digits = (phone || "").replace(/\D/g, "");
  return digits.length < 10;
}

function containsSpamKeywords(text) {
  const spamKeywords = [
    "buy now",
    "click here",
    "free money",
    "viagra",
    "lottery",
    "cheap pills",
  ];
  const lower = (text || "").toLowerCase();
  return spamKeywords.some((kw) => lower.includes(kw));
}

function isSubmissionTooFast(submissionTimeMs) {
  return submissionTimeMs < 15000;
}

function isTypingPatternSuspicious(perFieldIntervals) {
  if (!perFieldIntervals) return false;

  for (const intervals of Object.values(perFieldIntervals)) {
    if (!intervals || intervals.length === 0) continue;

    const mean = intervals.reduce((sum, v) => sum + v, 0) / intervals.length;
    const variance =
      intervals.reduce((sum, v) => sum + (v - mean) ** 2, 0) / intervals.length;
    const stdev = Math.sqrt(variance);

    if (stdev < 15) {
      return true; // very uniform typing → suspicious
    }
  }
  return false;
}

function isUserAgentSuspicious(userAgent = "") {
  const botSignatures = [
    "bot",
    "crawler",
    "spider",
    "scraper",
    "curl",
    "wget",
    "python-requests",
  ];
  const uaLower = userAgent.toLowerCase();
  return botSignatures.some((sig) => uaLower.includes(sig));
}

function isLanguageSuspicious(lang = "") {
  return !lang || ["c", "xx", "null"].includes(lang.toLowerCase());
}

// ------------------------------
// Main Bot Detection Logic
// ------------------------------

function checkBot(userData = {}) {
  const reasons = [];

  if (isMissingFields(userData)) {
    reasons.push("Missing required fields");
  }
  if (isInvalidEmail(userData.email || "")) {
    reasons.push("Invalid email");
  }
  if (isInvalidPhone(userData.phone || "")) {
    reasons.push("Invalid phone");
  }

  const combinedText = `${userData.name || ""} ${userData.email || ""}`;
  if (containsSpamKeywords(combinedText)) {
    reasons.push("Contains spam keywords");
  }

  if (isSubmissionTooFast(userData.submissionTimeMs || 2000)) {
    reasons.push("Submission too fast");
  }

  if (isTypingPatternSuspicious(userData.keystrokeIntervals || {})) {
    reasons.push("Suspicious typing pattern");
  }

  if (isUserAgentSuspicious(userData.userAgent || "")) {
    reasons.push("Suspicious user agent");
  }

  if (isLanguageSuspicious(userData.acceptLanguage || "")) {
    reasons.push("Suspicious language header");
  }

  const isBot = reasons.length > 0;
  const confidenceScore = isBot ? 1.0 : 0.0;
  const reason = isBot ? reasons.join("; ") : "No issues detected";

  return { isBot, confidenceScore, reason };
}

// ------------------------------
// API Route Handlers (App Router)
// ------------------------------

export async function POST(req) {
  try {
    const body = await req.json();
    const result = checkBot(body);
    return Response.json(result, { status: 200 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function GET() {
  return Response.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}
