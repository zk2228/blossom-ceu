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

// In-memory state
let lastPdfBlob = null;
let lastFilename = null;

// DOM references
const form = document.getElementById("ceuForm");
const formCard = document.getElementById("formCard");
const quizCard = document.getElementById("quizCard");
const successCard = document.getElementById("successCard");
const failCard = document.getElementById("failCard");
const submitBtn = document.getElementById("submitBtn");
const btnText = submitBtn.querySelector(".btn-text");
const btnLoading = submitBtn.querySelector(".btn-loading");
const quizSubmitBtn = document.getElementById("quizSubmitBtn");
const quizBtnText = quizSubmitBtn.querySelector(".btn-text");
const quizBtnLoading = quizSubmitBtn.querySelector(".btn-loading");
const successName = document.getElementById("successName");
const downloadBtn = document.getElementById("downloadBtn");
const anotherBtn = document.getElementById("anotherBtn");
const retryBtn = document.getElementById("retryBtn");
const startOverBtn = document.getElementById("startOverBtn");
const quizEpisodeTitle = document.getElementById("quizEpisodeTitle");
const quizFieldsContainer = document.getElementById("quizFields");
const quizForm = document.getElementById("quizForm");
const quizErrorMsg = document.getElementById("quizErrorMsg");

// Stored form data between steps
let formData = {};

// Info fields
const fields = [
    { id: "name", label: "Name", type: "text" },
    { id: "email", label: "Email", type: "email" },
    { id: "bacbCertNumber", label: "BACB Certification Number", type: "text" },
    { id: "bacbIdNumber", label: "BACB ID Number", type: "text" },
    { id: "episode", label: "Episode", type: "select" },
    { id: "dateWatched", label: "Date Watched", type: "date" },
];

// --- Validation ---
function validateField(fieldId) {
    const el = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + "Error");
    const value = el.value.trim();
    let errorMsg = "";

    if (!value) {
        errorMsg = "This field is required.";
    } else if (fieldId === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMsg = "Please enter a valid email address.";
        }
    }

    if (errorMsg) {
        el.classList.add("invalid");
        errorEl.textContent = errorMsg;
        return false;
    } else {
        el.classList.remove("invalid");
        errorEl.textContent = "";
        return true;
    }
}

function validateAll() {
    let valid = true;
    fields.forEach((f) => {
        if (!validateField(f.id)) valid = false;
    });
    return valid;
}

// Clear validation on input
fields.forEach((f) => {
    const el = document.getElementById(f.id);
    const eventType = f.type === "select" ? "change" : "input";
    el.addEventListener(eventType, () => {
        if (el.classList.contains("invalid")) {
            validateField(f.id);
        }
    });
});

// --- Date formatting ---
function formatDate(dateStr) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const parts = dateStr.split("-");
    const year = parts[0];
    const month = months[parseInt(parts[1], 10) - 1];
    const day = parseInt(parts[2], 10);
    return `${month} ${day}, ${year}`;
}

// --- Step 1: Info Form Submit → Show Quiz ---
form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateAll()) {
        const firstError = form.querySelector(".invalid");
        if (firstError) firstError.focus();
        return;
    }

    // Store form data
    formData = {};
    fields.forEach((f) => {
        formData[f.id] = document.getElementById(f.id).value.trim();
    });

    // Build quiz for selected episode
    const episode = formData.episode;
    const codeWords = EPISODE_CODE_WORDS[episode];

    if (!codeWords || codeWords.length === 0) {
        alert("Code words for this episode are not yet available. Please try another episode or check back later.");
        return;
    }

    quizEpisodeTitle.textContent = episode;
    quizFieldsContainer.innerHTML = "";
    quizErrorMsg.style.display = "none";

    codeWords.forEach((_, index) => {
        const div = document.createElement("div");
        div.className = "quiz-field";
        div.innerHTML = `
            <label for="codeWord${index}">Code Word ${index + 1} <span class="required">*</span></label>
            <input type="text" id="codeWord${index}" name="codeWord${index}" required 
                   placeholder="Enter code word ${index + 1}" autocomplete="off" spellcheck="false">
        `;
        quizFieldsContainer.appendChild(div);
    });

    // Show quiz, hide form
    formCard.style.display = "none";
    quizCard.style.display = "block";
    quizCard.scrollIntoView({ behavior: "smooth", block: "start" });
});

// --- Back button (quiz → form) ---
const quizBackBtn = document.getElementById("quizBackBtn");
quizBackBtn.addEventListener("click", () => {
    quizCard.style.display = "none";
    formCard.style.display = "block";
    formCard.scrollIntoView({ behavior: "smooth", block: "start" });
});

// --- Step 2: Quiz Submit → Verify Code Words ---
quizForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    quizErrorMsg.style.display = "none";

    const episode = formData.episode;
    const correctWords = EPISODE_CODE_WORDS[episode];
    let allCorrect = true;
    const enteredWords = [];

    correctWords.forEach((correctWord, index) => {
        const input = document.getElementById(`codeWord${index}`);
        const entered = input.value.trim();
        enteredWords.push(entered);

        if (entered.toLowerCase() !== correctWord.toLowerCase()) {
            allCorrect = false;
            input.classList.add("invalid");
        } else {
            input.classList.remove("invalid");
        }
    });

    if (!allCorrect) {
        // Show fail screen
        quizCard.style.display = "none";
        failCard.style.display = "block";
        failCard.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }

    // All correct — generate certificate
    setQuizLoading(true);

    try {
        await new Promise(r => setTimeout(r, 600));

        const doc = generateCertificate(formData);
        const pdfBlob = doc.output("blob");
        const filename = `CEU_Certificate_${formData.name.replace(/\s+/g, "_")}.pdf`;

        lastPdfBlob = pdfBlob;
        lastFilename = filename;

        downloadPdf(pdfBlob, filename);

        successName.textContent = formData.name;
        quizCard.style.display = "none";
        successCard.style.display = "block";
        successCard.scrollIntoView({ behavior: "smooth", block: "center" });

    } catch (err) {
        console.error("Certificate generation error:", err);
        alert("An error occurred generating your certificate. Please try again.");
    } finally {
        setQuizLoading(false);
    }
});

// --- Retry quiz (after failure) ---
retryBtn.addEventListener("click", () => {
    // Clear quiz inputs
    const episode = formData.episode;
    const codeWords = EPISODE_CODE_WORDS[episode];
    codeWords.forEach((_, index) => {
        const input = document.getElementById(`codeWord${index}`);
        if (input) {
            input.value = "";
            input.classList.remove("invalid");
        }
    });
    failCard.style.display = "none";
    quizCard.style.display = "block";
    quizCard.scrollIntoView({ behavior: "smooth", block: "start" });
});

// --- Start over (from fail or success) ---
startOverBtn.addEventListener("click", () => {
    resetAll();
});

anotherBtn.addEventListener("click", () => {
    resetAll();
});

function resetAll() {
    form.reset();
    formData = {};
    lastPdfBlob = null;
    lastFilename = null;
    quizFieldsContainer.innerHTML = "";
    quizErrorMsg.style.display = "none";

    successCard.style.display = "none";
    failCard.style.display = "none";
    quizCard.style.display = "none";
    formCard.style.display = "block";
    formCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

// --- PDF Download ---
function downloadPdf(blob, filename) {
    try {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
        console.error("Download error:", err);
    }
}

downloadBtn.addEventListener("click", () => {
    if (lastPdfBlob && lastFilename) {
        downloadPdf(lastPdfBlob, lastFilename);
    }
});

// --- Loading states ---
function setLoading(loading) {
    if (loading) {
        submitBtn.disabled = true;
        btnText.style.display = "none";
        btnLoading.style.display = "flex";
    } else {
        submitBtn.disabled = false;
        btnText.style.display = "inline";
        btnLoading.style.display = "none";
    }
}

function setQuizLoading(loading) {
    if (loading) {
        quizSubmitBtn.disabled = true;
        quizBtnText.style.display = "none";
        quizBtnLoading.style.display = "flex";
    } else {
        quizSubmitBtn.disabled = false;
        quizBtnText.style.display = "inline";
        quizBtnLoading.style.display = "none";
    }
}

// --- PDF Generation (jsPDF) ---
function generateCertificate(data) {
    const { jsPDF } = window.jspdf;
    
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "letter"
    });

    const w = 792;
    const h = 612;

    const orange = [242, 101, 34];
    const darkBg = [10, 24, 35];
    const peach = [232, 168, 124];
    const lightBg = [255, 248, 243];
    const gray = [85, 85, 85];
    const darkGray = [51, 51, 51];
    const lightGray = [153, 153, 153];

    // Background
    doc.setFillColor(...lightBg);
    doc.rect(0, 0, w, h, "F");

    // Outer border
    const bm = 20;
    doc.setDrawColor(...orange);
    doc.setLineWidth(3);
    doc.rect(bm, bm, w - 2 * bm, h - 2 * bm, "S");

    // Inner border
    const im = 30;
    doc.setDrawColor(...peach);
    doc.setLineWidth(1.5);
    doc.rect(im, im, w - 2 * im, h - 2 * im, "S");

    // Corner accents
    const cs = 12;
    doc.setFillColor(...orange);
    doc.rect(bm - 2, bm - 2, cs, cs, "F");
    doc.rect(w - bm - cs + 2, bm - 2, cs, cs, "F");
    doc.rect(bm - 2, h - bm - cs + 2, cs, cs, "F");
    doc.rect(w - bm - cs + 2, h - bm - cs + 2, cs, cs, "F");

    // "blossom"
    let y = 58;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(...orange);
    doc.text("blossom", w / 2, y, { align: "center" });

    // "CHILDREN'S CENTER"
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...darkBg);
    doc.text("CHILDREN'S CENTER", w / 2, y, { align: "center" });

    // Orange bar
    y += 12;
    const barW = 300;
    doc.setFillColor(...orange);
    doc.rect((w - barW) / 2, y, barW, 4, "F");

    // CERTIFICATE OF COMPLETION
    y += 32;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(...darkBg);
    doc.text("CERTIFICATE OF COMPLETION", w / 2, y, { align: "center" });

    // Decorative line
    y += 12;
    const lineW = 200;
    doc.setDrawColor(...peach);
    doc.setLineWidth(1);
    doc.line((w - lineW) / 2, y, (w + lineW) / 2, y);

    // "This certifies that"
    y += 22;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...gray);
    doc.text("This certifies that", w / 2, y, { align: "center" });

    // Participant Name
    y += 32;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(...darkBg);
    doc.text(data.name, w / 2, y, { align: "center" });

    // Name underline
    const nameWidth = doc.getTextWidth(data.name);
    y += 6;
    doc.setDrawColor(...orange);
    doc.setLineWidth(1.5);
    doc.line((w - nameWidth) / 2 - 20, y, (w + nameWidth) / 2 + 20, y);

    // BACB info
    y += 22;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.text(`BACB Certification #: ${data.bacbCertNumber}    |    BACB ID #: ${data.bacbIdNumber}`, w / 2, y, { align: "center" });

    // Completion text
    y += 26;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...darkGray);
    doc.text("has successfully completed the continuing education activity", w / 2, y, { align: "center" });

    // Episode name
    y += 26;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...orange);
    doc.text(`Blossoming Together Podcast \u2014 ${data.episode}`, w / 2, y, { align: "center" });

    // Date
    y += 26;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    const formattedDate = formatDate(data.dateWatched);
    doc.text(`Date of Completion: ${formattedDate}`, w / 2, y, { align: "center" });

    // CEU Badge
    y += 24;
    const badgeW = 200;
    const badgeH = 28;
    const badgeX = (w - badgeW) / 2;
    doc.setFillColor(...orange);
    doc.roundedRect(badgeX, y, badgeW, badgeH, 6, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("1.0 CEU Credit Awarded", w / 2, y + 19, { align: "center" });

    // Signature
    y += 60;
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(16);
    doc.setTextColor(...darkBg);
    doc.text("Katie", w / 2, y, { align: "center" });

    y += 8;
    const sigLineW = 180;
    doc.setDrawColor(...lightGray);
    doc.setLineWidth(0.8);
    doc.line((w - sigLineW) / 2, y, (w + sigLineW) / 2, y);

    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.text("Program Director", w / 2, y, { align: "center" });

    y += 12;
    doc.text("Blossom Children's Center", w / 2, y, { align: "center" });

    // Bottom bar
    doc.setFillColor(...orange);
    doc.rect((w - barW) / 2, h - im - 10, barW, 3, "F");

    return doc;
}