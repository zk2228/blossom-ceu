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

// Kosai Zaya's signature (raw base64-encoded JPEG — no data URI prefix)
// jsPDF addImage works most reliably with raw base64 + explicit format parameter
const KOSAI_SIGNATURE_B64 = "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";

// Helper: load signature into a canvas and return a PNG dataURL
// This is the most reliable method for jsPDF across all versions.
function getSignatureAsCanvasDataURL() {
    return new Promise((resolve, reject) => {
        try {
            const img = new Image();
            img.onload = function() {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const dataURL = canvas.toDataURL('image/jpeg', 0.95);
                    console.log('Signature canvas ready:', img.width, 'x', img.height, 'dataURL length:', dataURL.length);
                    resolve(dataURL);
                } catch (e) {
                    console.error('Canvas draw failed:', e);
                    reject(e);
                }
            };
            img.onerror = function(e) {
                console.error('Signature image load failed:', e);
                reject(e);
            };
            img.src = 'data:image/jpeg;base64,' + KOSAI_SIGNATURE_B64;
        } catch (e) {
            reject(e);
        }
    });
}

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
        const doc = await generateCertificate(formData);
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
async function generateCertificate(data) {
    const { jsPDF } = window.jspdf;
    
    // Pre-load the signature via canvas BEFORE creating the PDF
    // This is the most reliable approach across all jsPDF versions
    let signatureDataURL = null;
    try {
        signatureDataURL = await getSignatureAsCanvasDataURL();
        console.log('Signature pre-rendered, dataURL length:', signatureDataURL.length);
    } catch (e) {
        console.error('Failed to pre-render signature:', e);
    }

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

    // Method 1: Use canvas-rendered dataURL (most reliable — proven in diagnostic test)
    if (signatureDataURL) {
        try {
            doc.addImage(signatureDataURL, 'JPEG', (w - sigImgW) / 2, y, sigImgW, sigImgH);
            sigRendered = true;
            console.log('Signature rendered via canvas dataURL');
        } catch (e) {
            console.error('Signature addImage with canvas dataURL failed:', e);
        }
    }

    // Method 2: Use raw base64 with explicit JPEG format
    if (!sigRendered) {
        try {
            doc.addImage(KOSAI_SIGNATURE_B64, 'JPEG', (w - sigImgW) / 2, y, sigImgW, sigImgH);
            sigRendered = true;
            console.log('Signature rendered via raw base64');
        } catch (e2) {
            console.error('Signature addImage with raw base64 failed:', e2);
        }
    }

    // Method 3: Final fallback to text
    if (!sigRendered) {
        console.warn('All image methods failed, using text fallback');
        doc.setFont('helvetica', 'bolditalic');
        doc.setFontSize(16);
        doc.setTextColor(...darkBg);
        doc.text('Kosai Zaya', w / 2, y + 30, { align: 'center' });
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
