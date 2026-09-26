/* =========================================================
   config.js  —  YOUR API KEY (private, do not publish)
   -------------------------------------------------------------
   This file is listed in .gitignore, so it will NOT be pushed
   to GitHub by accident.

   If you host this project publicly (Netlify / GitHub Pages),
   DELETE the key below and paste it into the app instead:
   Settings -> Brain mode -> paste key -> Save.
   ========================================================= */

const CONFIG = {
  /* Google Gemini — free key from https://aistudio.google.com/apikey */
  geminiKey: "",

  /* Groq — free key from https://console.groq.com  (optional) */
  groqKey: "",

  /* Leave blank and the app asks Google which models your key can
     use, then picks a working one. Set a name to pin it. */
  geminiModel: "",

  defaultMode: "gemini"
};
