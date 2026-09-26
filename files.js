/* =========================================================
   files.js  —  PDF / notes upload  +  Voice input & output
   ========================================================= */

/* ---------- Lazy-load pdf.js only when a PDF is picked ---------- */
const PDF_LIB = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDF_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src="' + src + '"]')) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error("Could not load " + src));
    document.head.appendChild(s);
  });
}

const Files = {

  /* Reads a File and returns plain text.
     Text/code files -> FileReader.
     PDFs           -> pdf.js (needs internet once to load the library). */
  async extract(file) {
    const name = file.name.toLowerCase();

    if (name.endsWith(".pdf")) {
      await loadScript(PDF_LIB);
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER;
        const buffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;

        let full = "";
        for (let p = 1; p <= pdf.numPages; p++) {
          const page = await pdf.getPage(p);
          const content = await page.getTextContent();
          full += content.items.map((i) => i.str).join(" ") + "\n";
        }
        return full.trim();
      }
      // pdf.js blocked (offline) -> ask the user to paste the text
      throw new Error(
        "PDF reader could not load (no internet for the library). " +
        "Open the PDF, copy the text, and paste it in the chat instead."
      );
    }

    // plain text, markdown, code, csv, json...
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Could not read that file."));
      reader.readAsText(file);
    });
  },

  /* ---------- Voice output (speechSynthesis) ---------- */
  speak(text, enabled) {
    if (!("speechSynthesis" in window)) return false;
    speechSynthesis.cancel();
    if (!enabled) return false;

    const clean = String(text)
      .replace(/```[\s\S]*?```/g, " code block skipped ")
      .replace(/[*#`|]/g, "")
      .replace(/https?:\/\/\S+/g, "");

    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.lang = "en-IN";

    const voices = speechSynthesis.getVoices();
    const pref = voices.find((v) => /en-IN/i.test(v.lang)) ||
                 voices.find((v) => /^en/i.test(v.lang));
    if (pref) utter.voice = pref;

    speechSynthesis.speak(utter);
    return true;
  },

  stopSpeaking() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  },

  /* ---------- Voice input (SpeechRecognition) ---------- */
  micSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  },

  startMic(onResult, onState) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      onState("unsupported");
      return null;
    }

    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = true;
    rec.continuous = false;

    let baseText = "";
    let finalText = "";

    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t + " ";
        else interim += t;
      }
      onResult((baseText + finalText + interim).trim());
    };

    rec.onerror = (e) => onState("error:" + (e.error || "unknown"));
    rec.onend = () => onState("idle");

    try {
      rec.start();
      onState("listening");
    } catch (err) {
      onState("error:start");
      return null;
    }
    return rec;
  }
};
