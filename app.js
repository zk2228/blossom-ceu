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

// Kosai Zaya's signature (base64-encoded JPEG)
// IMPORTANT: Using JPEG format because jsPDF >= 2.4.0 has a known bug with PNG addImage (issue #3359)
const KOSAI_SIGNATURE = "data:image/jpeg;base64,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";

// Preload signature into an HTMLImageElement (most reliable method for jsPDF addImage)
let signatureImage = null;
let signatureReady = false;
(function preloadSignature() {
    try {
        const img = new Image();
        img.onload = function() {
            signatureImage = img;
            signatureReady = true;
            console.log("Signature image preloaded successfully:", img.width, "x", img.height);
        };
        img.onerror = function(e) {
            console.error("Signature image failed to load:", e);
        };
        img.src = KOSAI_SIGNATURE;
    } catch (e) {
        console.error("Failed to preload signature:", e);
    }
})();

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
    doc.text(`BACB Certification #: ${data.bacbCertNumber}`, w / 2, y, { align: "center" });

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

    // Signature image
    y += 44;
    const sigImgW = 120;
    const sigImgH = 50;
    let sigRendered = false;

    // Method 1: Use preloaded HTMLImageElement (most reliable for jsPDF)
    if (signatureImage && signatureReady) {
        try {
            doc.addImage(signatureImage, "JPEG", (w - sigImgW) / 2, y, sigImgW, sigImgH);
            sigRendered = true;
            console.log("Signature rendered via HTMLImageElement");
        } catch (e) {
            console.error("Signature addImage with HTMLImageElement failed:", e);
        }
    }

    // Method 2: Use data URI string directly
    if (!sigRendered) {
        try {
            doc.addImage(KOSAI_SIGNATURE, "JPEG", (w - sigImgW) / 2, y, sigImgW, sigImgH);
            sigRendered = true;
            console.log("Signature rendered via data URI");
        } catch (e2) {
            console.error("Signature addImage with data URI failed:", e2);
        }
    }

    // Method 3: Final fallback to text
    if (!sigRendered) {
        console.warn("All image methods failed, using text fallback");
        doc.setFont("helvetica", "bolditalic");
        doc.setFontSize(16);
        doc.setTextColor(...darkBg);
        doc.text("Kosai Zaya", w / 2, y + 30, { align: "center" });
    }

    y += sigImgH + 4;
    const sigLineW = 180;
    doc.setDrawColor(...lightGray);
    doc.setLineWidth(0.8);
    doc.line((w - sigLineW) / 2, y, (w + sigLineW) / 2, y);

    y += 14;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...darkBg);
    doc.text("Kosai Zaya, MA, BCBA, LBA", w / 2, y, { align: "center" });

    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...gray);
    doc.text("ACE Coordinator | Blossom Children's Center", w / 2, y, { align: "center" });

    // Static ACE Provider Info (bottom section)
    y += 28;
    doc.setDrawColor(...peach);
    doc.setLineWidth(0.5);
    const infoBoxW = 460;
    doc.line((w - infoBoxW) / 2, y, (w + infoBoxW) / 2, y);

    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...gray);
    const aceLines = [
        "Event Modality: Online Asynchronous",
        "ACE Provider Name: Blossom Children's Center    |    ACE Provider Number: OP-22-0525",
    ];
    aceLines.forEach((line) => {
        doc.text(line, w / 2, y, { align: "center" });
        y += 11;
    });

    // Bottom bar
    doc.setFillColor(...orange);
    doc.rect((w - barW) / 2, h - im - 10, barW, 3, "F");

    return doc;
}
