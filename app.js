/* ============================================
   Blossom CEU – Client-Side Certificate Generator
   With Code Word Quiz Verification
   ============================================ */

// =============================================
// CODE WORDS PER EPISODE
// To update: just edit the arrays below.
// Words are matched case-insensitively.
// =============================================
const EPISODE_CODE_WORDS = {
    "Episode 01": [],
    "Episode 02": [],
    "Episode 03": ["ice cream", "cupcake", "kale"],
    "Episode 04": ["child-led", "glp", "collaborate"],
    "Episode 05": ["moving", "dentist", "plane ride"],
    "Episode 06": ["mirna", "jenny", "taylor"],
    "Episode 08": ["mirna", "jenny", "taylor"],
    "Episode 09": ["feedback", "time management", "goals"],
    "Episode 10": ["student", "supervisor", "change"],
    "Episode 11": ["collaboration", "implementation", "consistency"],
    "Episode 12": ["rapport", "intake", "goals"],
    "Episode 13": ["hair twirling", "nail biting", "tapping"],
    "Episode 14": ["sleep", "wake window", "night waking"],
    "Episode 16": ["student", "feedback", "skills"],
    "Episode 17": ["request", "mo", "model"],
    "Episode 18": ["aac", "myth", "learner"],
};

// Kosai Zaya's signature (base64-encoded PNG)
const KOSAI_SIGNATURE = "data:image/png;base64,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";

// In-memory state
let lastPdfBlob = null;
let lastFilename = null;
