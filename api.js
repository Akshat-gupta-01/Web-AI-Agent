/* =========================================================
   api.js  —  ONLINE BRAINS (optional, free tiers)
   -------------------------------------------------------------
   Offline AIML mode needs none of this. These functions only run
   when Akshat switches the brain to Gemini or Groq in Settings.

   The key lives in the browser (localStorage) or in js/config.js.
   It is sent only to that one provider.
   ========================================================= */

/* Older free-tier model names stop being offered over time, so we
   try a short list and then ask the provider what it actually has. */
const GEMINI_MODELS = ["gemini-flash-latest", "gemini-3-flash-preview", "gemini-3.5-flash"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const Api = {

  /* Which models does this key actually have access to? */
  async geminiModels(key) {
    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models?pageSize=200",
        { headers: { "x-goog-api-key": key } }
      );
      if (!res.ok) return [];
      const data = await res.json();
      return (data.models || [])
        .map((m) => m.name || "")
        .filter((n) => n.indexOf("models/") === 0)
        .map((n) => n.replace("models/", ""));
    } catch (e) {
      return [];
    }
  },

  /* Validate a key without spending a real chat turn on it. */
  async testGemini(key) {
    const models = await Api.geminiModels(key);
    if (!models.length) {
      return { ok: false, error: "Gemini did not accept this key. Check that you copied all of it, with no spaces." };
    }
    const chat = models.filter((n) =>
      !/image|tts|audio|live|embedding|native|omni/i.test(n));

    if (!chat.length) {
      return { ok: true, models: chat, note: "Key works, but no text chat model is enabled for it." };
    }

    /* make one real call so we know it is not just readable */
    const model = GEMINI_MODELS.find((m) => chat.includes(m)) || chat[0];
    const url = "https://generativelanguage.googleapis.com/v1beta/models/" +
                encodeURIComponent(model) + ":generateContent";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Reply with the single word: OK" }] }],
        generationConfig: { maxOutputTokens: 300, thinkingConfig: { thinkingBudget: 0 } }
      })
    });

    if (!res.ok) {
      return { ok: false, models: chat, error: "Key is readable but the test call failed: HTTP " + res.status };
    }
    return { ok: true, models: chat, used: model };
  },

  /* ---------- Google Gemini ---------- */
  async gemini(settings, systemPrompt, messages) {
    const preferred = (settings.mode === "gemini" && settings.modelName) || "";
    let order = [preferred].concat(GEMINI_MODELS).filter(Boolean);

    /* drop duplicates, keep order */
    order = order.filter((m, i) => order.indexOf(m) === i);

    let lastError = "";
    let available = null;

    const tryModel = async (model) => {
      const url = "https://generativelanguage.googleapis.com/v1beta/models/" +
                  encodeURIComponent(model) + ":generateContent";

      const body = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        })),
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 2048,
          // the 3.x models think by default, which adds 10-15s per reply
          thinkingConfig: { thinkingBudget: 0 }
        }
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": settings.apiKey
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        let detail = "";
        try {
          const j = await res.json();
          detail = (j.error && j.error.message) || "";
        } catch (e) { /* ignore */ }
        const err = new Error(res.status + " " + res.statusText + (detail ? " — " + detail : ""));
        err.status = res.status;
        throw err;
      }

      const data = await res.json();
      const parts = (data.candidates && data.candidates[0] && data.candidates[0].content &&
                     data.candidates[0].content.parts) || [];
      const text = parts.map((p) => p.text || "").join("").trim();
      if (!text) throw new Error("Model returned an empty reply.");
      return text;
    };

    /* free tiers return 503 "high demand" often, so retry with backoff */
    const withRetry = async (model) => {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          return await tryModel(model);
        } catch (err) {
          lastError = err.message;
          const retryable = err.status === 503 || err.status === 429 || err.status === 500;
          if (!retryable || attempt === 2) throw err;
          await sleep(700 * (attempt + 1));
        }
      }
    };

    for (const model of order) {
      try {
        return await withRetry(model);
      } catch (err) {
        lastError = err.message;
      }
    }

    /* nothing in the list worked — ask Google what this key can use */
    if (available === null) available = await Api.geminiModels(settings.apiKey);
    const flash = available.filter((n) =>
      /flash/i.test(n) && !/image|tts|audio|live|embedding|native|omni/i.test(n));

    for (const model of flash.slice(0, 3)) {
      if (order.indexOf(model) !== -1) continue;
      try {
        return await withRetry(model);
      } catch (err) {
        lastError = err.message;
      }
    }

    /* give the user something actionable */
    if (/API key not valid|API_KEY_INVALID|PERMISSION_DENIED/i.test(lastError)) {
      throw new Error(
        "Gemini rejected this API key.\n\n(" + lastError + ")\n\n" +
        "Check three things:\n" +
        "1. You copied the whole key, no spaces or line breaks\n" +
        "2. In AI Studio the Key Type column says **auth** — the old Standard key type was retired in 2026\n" +
        "3. The Generative Language API is enabled for that project"
      );
    }
    if (err_is_offline(lastError)) {
      throw new Error(
        "No internet connection, so the AI brain cannot be reached.\n\n" +
        "Switch Brain mode to **Offline** in Settings — the AIML engine still answers every built-in topic."
      );
    }
    throw new Error("Gemini request failed. " + lastError +
      (flash.length ? "\n\nModels your key can use: " + flash.slice(0, 8).join(", ") : ""));
  },

  /* ---------- Groq (OpenAI compatible) ---------- */
  async groq(settings, systemPrompt, messages) {
    const models = [
      (settings.mode === "groq" && settings.modelName) || "",
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant"
    ].filter(Boolean).filter((m, i, a) => a.indexOf(m) === i);

    let lastError = "";

    for (const model of models) {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + settings.apiKey,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: model,
              temperature: 0.6,
              max_tokens: 2048,
              messages: [{ role: "system", content: systemPrompt }].concat(messages)
            })
          });

          if (!res.ok) {
            let detail = "";
            try {
              const j = await res.json();
              detail = (j.error && (j.error.message || (j.error.error && j.error.error.message))) || "";
            } catch (e) { /* ignore */ }
            const err = new Error(res.status + " " + res.statusText + (detail ? " — " + detail : ""));
            err.status = res.status;
            throw err;
          }

          const data = await res.json();
          const text = data.choices && data.choices[0] && data.choices[0].message
            ? data.choices[0].message.content : "";
          if (!text || !text.trim()) throw new Error("Groq returned an empty reply.");
          return text.trim();
        } catch (err) {
          lastError = err.message;
          const retryable = err.status === 429 || err.status === 500 || err.status === 503;
          if (!retryable || attempt === 2) break;
          await sleep(700 * (attempt + 1));
        }
      }
    }

    if (err_is_offline(lastError)) {
      throw new Error(
        "No internet connection, so Groq cannot be reached.\n\n" +
        "Switch Brain mode to **Offline** — the AIML engine still works."
      );
    }
    if (/401|invalid_api_key|Unauthorized/i.test(lastError)) {
      throw new Error(
        "Groq rejected this API key. (" + lastError + ")\n\n" +
        "Check that you copied the whole key from console.groq.com -> API Keys."
      );
    }
    throw new Error("Groq request failed. " + lastError);
  },

  /* ---------- single entry point ---------- */
  async ask(settings, systemPrompt, messages) {
    if (!settings.apiKey) {
      throw new Error("No API key saved. Open Settings and paste your free key, or switch Brain mode to Offline.");
    }
    if (settings.mode === "gemini") return Api.gemini(settings, systemPrompt, messages);
    if (settings.mode === "groq")   return Api.groq(settings, systemPrompt, messages);
    throw new Error("Online mode is not selected.");
  }
};

/* "Failed to fetch" / "NetworkError" means the machine is offline */
function err_is_offline(msg) {
  return /failed to fetch|networkerror|load failed|ERR_INTERNET|ERR_NAME_NOT_RESOLVED/i.test(msg || "");
}
