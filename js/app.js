/* =========================================================
   app.js  —  UI, chat, history, voice, files
   ========================================================= */

const KEY_SETTINGS = "aa_settings";
const KEY_CHATS    = "aa_chats";
const KEY_VOICE    = "aa_voiceOut";

/* ---------- Element refs ---------- */
const $ = (id) => document.getElementById(id);

const DEL_ICON =
  '<svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const el = {
  messages: $("messages"),
  input: $("input"),
  sendBtn: $("sendBtn"),
  micBtn: $("micBtn"),
  fileBtn: $("fileBtn"),
  fileInput: $("fileInput"),
  attachBar: $("attachBar"),
  voiceBtn: $("voiceBtn"),
  status: $("statusText"),
  modeBadge: $("modeBadge"),
  chatTitle: $("chatTitle"),
  chatSub: $("chatSub"),
  historyList: $("historyList"),
  sidebar: $("sidebar"),
  menuBtn: $("menuBtn"),
  newChatBtn: $("newChatBtn"),
  settingsBtn: $("settingsBtn"),
  modal: $("settingsModal"),
  closeSettings: $("closeSettings"),
  saveSettingsBtn: $("saveSettingsBtn"),
  resetPromptBtn: $("resetPromptBtn"),
  modeSelect: $("modeSelect"),
  apiKey: $("apiKey"),
  modelName: $("modelName"),
  userName: $("userName"),
  systemPrompt: $("systemPrompt"),
  keyField: $("keyField"),
  modelField: $("modelField"),
  toast: $("toast"),
  learnBtn: $("learnBtn"),
  learnModal: $("learnModal"),
  learnBody: $("learnBody"),
  closeLearn: $("closeLearn"),
  resetLearnBtn: $("resetLearnBtn"),
  quizWeakBtn: $("quizWeakBtn"),
  dueBadge: $("dueBadge"),
  keyHelpBtn: $("keyHelpBtn"),
  keyGuide: $("keyGuide"),
  testKeyBtn: $("testKeyBtn"),
  keyTest: $("keyTest")
};


/* ---------- State ---------- */
let settings = {
  mode: "offline",
  apiKey: "",
  modelName: "gemini-flash-latest",
  userName: "Akshat",
  personality: DEFAULT_PERSONALITY
};

/* js/config.js holds Akshat's key so the app works with zero setup.
   Anything already saved in the browser wins, so he can still change it. */
function applyConfig() {
  if (typeof CONFIG === "undefined") return;
  const s = Store.get(KEY_SETTINGS, null);
  settings.mode    = (s && s.mode)    || CONFIG.defaultMode || "offline";
  settings.apiKey  = (s && s.apiKey)  || CONFIG.geminiKey || "";
  settings.modelName = (s && s.modelName) || CONFIG.geminiModel || settings.modelName;
  settings.userName = (s && s.userName) || settings.userName;
  settings.personality = (s && s.personality) || settings.personality;
}


let chats = [];          // [{ id, title, messages: [{role, content}], updated }]
let currentId = null;
let attached = [];       // [{ name, text }]
let voiceOut = false;
let busy = false;
let rec = null;
let baseInput = "";
let lastBotReply = "";


/* =========================================================
   1. LOAD / SAVE
   ========================================================= */
function loadAll() {
  applyConfig();
  settings = Object.assign(settings, Store.get(KEY_SETTINGS, {}));
  chats = Store.get(KEY_CHATS, []);
  voiceOut = Store.get(KEY_VOICE, false);

  // clean up any corrupt chat data
  chats = chats.filter((c) => c && Array.isArray(c.messages));
  chats.forEach((c) => {
    c.id = c.id || Date.now() + Math.random();
    c.title = c.title || "Untitled chat";
  });

  if (chats.length) currentId = chats[0].id;
  applyModeToUI();
  el.voiceBtn.classList.toggle("on", voiceOut);
}

function saveSettings() {
  Store.set(KEY_SETTINGS, settings);
  applyModeToUI();
}

function saveChats() {
  chats.sort((a, b) => (b.updated || 0) - (a.updated || 0));
  Store.set(KEY_CHATS, chats);
}

function applyModeToUI() {
  const online = settings.mode !== "offline";
  el.modeBadge.textContent = online ? settings.mode.toUpperCase() : "Offline";
  el.modeBadge.classList.toggle("online", online);

  el.status.textContent = online
    ? "Online mode — using " + settings.mode
    : "Offline mode — answers from built-in knowledge";

  el.chatSub.textContent = online
    ? "Online brain: " + settings.mode + " · key stored in this browser"
    : "Running offline · no API key needed";

  el.keyField.style.display = online ? "flex" : "none";
  el.modelField.style.display = online ? "flex" : "none";
}

let toastTimer = null;
function toast(msg) {
  el.toast.textContent = msg;
  el.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove("show"), 2600);
}


/* =========================================================
   2. RENDERING
   ========================================================= */
function currentChat() {
  let c = chats.find((x) => x.id === currentId);
  if (!c) {
    c = { id: Date.now(), title: "New Chat", messages: [], updated: Date.now() };
    chats.unshift(c);
    currentId = c.id;
  }
  return c;
}

function welcomeHTML() {
  const name = escapeHtml(Learning.data.profile.name === "friend" ? (settings.userName || "Akshat") : Learning.data.profile.name);
  const topics = Learning.allTopics();
  const due = topics.filter((t) => Learning.isDue(t.id));

  let sub = "AIML rules engine, running fully offline.";
  if (settings.mode !== "offline") sub = "Online brain: " + settings.mode + " · key stored in this browser";

  let track = "";
  if (topics.length) {
    track = '<div class="welcome-stats">' +
      "<b>" + topics.length + "</b> topics tracked · " +
      "<b>" + topics.filter((t) => t.level >= 3).length + "</b> mastered · " +
      "<b>" + topics.filter((t) => t.level <= 1).length + "</b> need work" +
      (due.length ? " · <b>" + due.length + "</b> due for revision" : "") +
      "</div>";
  }

  return (
    '<div class="welcome">' +
      "<h1>Hi " + name + " &#128512;</h1>" +
      "<p>" + sub + "<br/>I track what you study and adapt how I explain it.</p>" +
      track +
      '<div class="cards">' +
        '<div class="card"><b>Study</b>Java, Python, DSA, DBMS, OS, Maths</div>' +
        '<div class="card"><b>Code</b>Write, explain and debug code</div>' +
        '<div class="card"><b>Career</b>Resume, LinkedIn, interviews</div>' +
        '<div class="card"><b>Upload</b>Attach notes or a PDF and ask</div>' +
      "</div>" +
    "</div>"
  );
}


function addMessage(role, content, save = true) {
  const chat = currentChat();
  chat.messages.push({ role: role, content: content });
  chat.updated = Date.now();

  if (role === "user" && chat.messages.length === 1) {
    chat.title = content.replace(/\s+/g, " ").slice(0, 40) + (content.length > 40 ? "..." : "");
    el.chatTitle.textContent = chat.title;
  }
  if (save) saveChats();
  renderHistory();
}

function messageHTML(role, content) {
  const av = role === "user" ? "U" : "AI";
  let html =
    '<div class="msg ' + role + '">' +
      '<div class="av">' + av + "</div>" +
      '<div class="bubble">' + formatText(content) + "</div>" +
    "</div>";

  if (role === "bot") {
    html +=
      '<div class="msg bot-meta">' +
        '<span class="meta-label">Was this helpful?</span>' +
        '<button class="fb good" data-fb="good">Got it</button>' +
        '<button class="fb bad" data-fb="bad">Confused</button>' +
        '<span class="meta-label" data-topic-slot></span>' +
      "</div>";
  }
  return html;
}

function render() {
  const chat = currentChat();
  if (!chat.messages.length) {
    el.messages.innerHTML = welcomeHTML();
    return;
  }
  el.messages.innerHTML = chat.messages.map((m) => messageHTML(m.role, m.content)).join("");
  el.chatTitle.textContent = chat.title;
  scrollDown();
}

function scrollDown() {
  requestAnimationFrame(() => { el.messages.scrollTop = el.messages.scrollHeight; });
}

function renderHistory() {
  if (!chats.length) {
    el.historyList.innerHTML = '<div class="empty">No chats yet</div>';
    return;
  }
  el.historyList.innerHTML = chats.map((c) =>
    '<div class="hist-item ' + (c.id === currentId ? "active" : "") + '" data-id="' + c.id + '">' +
      "<span>" + escapeHtml(c.title) + "</span>" +
      '<button class="del" data-del="' + c.id + '" title="Delete">' + DEL_ICON + "</button>" +
    "</div>"
  ).join("");
}


/* =========================================================
   3. SENDING A MESSAGE
   ========================================================= */
function contextNote() {
  if (!attached.length) return "";
  return "\n\n[Attached files: " + attached.map((a) => a.name).join(", ") + "]\n" +
    attached.map((a) => "--- content of " + a.name + " ---\n" + a.text.slice(0, 12000)).join("\n\n");
}

async function send(text) {
  text = String(text || "").trim();
  if (!text || busy) return;

  busy = true;
  el.sendBtn.disabled = true;

  const full = text + contextNote();
  const lower = text.toLowerCase();

  addMessage("user", text);
  el.input.value = "";
  autoGrow();

  AIML.predicates.name = Learning.data.profile.name;
  AIML.predicates.that = lastBotReply;

  // typing indicator
  const typing = document.createElement("div");
  typing.className = "msg bot";
  typing.innerHTML =
    '<div class="av">AI</div>' +
    '<div class="bubble"><div class="typing"><i></i><i></i><i></i></div></div>';
  el.messages.appendChild(typing);
  scrollDown();

  let reply;
  try {
    if (settings.mode === "offline") {
      await new Promise((r) => setTimeout(r, 220));
      reply = runCommand(lower) || mainAgent.offlineReply(full, {
        docs: attached,
        previous: lastBotReply,
        persona: { userName: settings.userName }
      });
    } else {
      const history = currentChat()
        .messages.slice(0, -1)
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content }));

      let sys = mainAgent.buildSystemPrompt(settings);
      let userContent = full;

      /* the marks rule is the most-ignored one, so state it twice:
         in the system prompt AND on the user turn, which is obeyed harder */
      const mk = text.match(/\b(2|3|4|5|6|7|8|10)\s*marks?\b/i);
      if (mk) {
        const head = mainAgent.marksHeader(mk[1]);
        sys += "\n\nIMPORTANT — this is a " + mk[1] + "-mark question. Hard limit:\n" + head +
          "\nNo preamble, no closing line, no extra examples.";
        userContent += "\n\n---\nSTRICT FORMAT FOR THIS REPLY: write a " + mk[1] +
          "-mark answer only. " + head + " Do not write more than that.";
      }
      if (/\bshort\b|\bsimple\b|\beasy english\b|\bconcise\b/i.test(text)) {
        const note = "STRICT FORMAT FOR THIS REPLY: short and simple English only. Cut every unnecessary word.";
        sys += "\n\nIMPORTANT — " + note;
        userContent += "\n\n---\n" + note;
      }

      reply = await Api.ask(settings, sys, history.concat([{ role: "user", content: userContent }]));
    }

  } catch (err) {
    console.error(err);
    reply =
      "**Something went wrong**\n\n" +
      escapeHtml(err.message || String(err)) + "\n\n" +
      "**Quick fixes**\n" +
      "- Check the API key in Settings (it must be active)\n" +
      "- Make sure you are online\n" +
      "- Or switch the brain to *Offline* — the AIML engine still answers built-in topics\n\n" +
      "_Your question is still in the chat, so nothing is lost._";
  }

  typing.remove();
  lastBotReply = reply;
  addMessage("bot", reply);
  render();
  updateDueBadge();
  if (voiceOut) Files.speak(reply, true);

  busy = false;
  el.sendBtn.disabled = false;
  el.input.focus();
}


/* =========================================================
   3b. SLASH COMMANDS
   ========================================================= */
function runCommand(lower) {
  if (lower.charAt(0) !== "/") return null;
  const [cmd, ...rest] = lower.slice(1).trim().split(/\s+/);
  const arg = rest.join(" ");

  switch (cmd) {
    case "help":
      return AIML.cats.length ? mainAgent.offlineReply("help", { docs: attached, persona: {} }) : "";

    case "profile":
    case "progress":
    case "stats":
      return Learning.summary();

    case "weak":
      return Learning.weakList();

    case "strong":
      return Learning.strongList();

    case "revise":
    case "due":
      return Learning.dueList();

    case "quiz":
      return Learning.startQuiz(arg || "", 1);

    case "name":
      if (!arg) return "**Usage:** /name Akshat";
      Learning.data.profile.name = arg;
      AIML.predicates.name = arg;
      Learning.save();
      return "Saved. I will call you **" + arg + "** from now on.";

    case "college":
      if (!arg) return "**Usage:** /college MIT Campus";
      Learning.data.profile.college = arg;
      AIML.predicates.college = arg;
      Learning.save();
      return "Saved. College set to **" + arg + "**.";

    case "branch":
      if (!arg) return "**Usage:** /branch CSE";
      Learning.data.profile.branch = arg;
      AIML.predicates.branch = arg;
      Learning.save();
      return "Saved. Branch set to **" + arg + "**.";

    case "reset":
      Learning.reset();
      updateDueBadge();
      return "Progress cleared. I am starting fresh with you.";

    default:
      return "**Unknown command:** /" + cmd + "\n\nUse /help to see the list.";
  }
}



/* =========================================================
   4. INPUT BOX
   ========================================================= */
function autoGrow() {
  el.input.style.height = "auto";
  el.input.style.height = Math.min(el.input.scrollHeight, 160) + "px";
}

el.input.addEventListener("input", autoGrow);
el.input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send(el.input.value);
  }
});
el.sendBtn.addEventListener("click", () => send(el.input.value));


/* =========================================================
   5. FILE ATTACHMENTS
   ========================================================= */
el.fileBtn.addEventListener("click", () => el.fileInput.click());

el.fileInput.addEventListener("change", async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  toast("Reading " + file.name + "...");
  try {
    const text = await Files.extract(file);
    attached.push({ name: file.name, text: text });
    renderAttach();
    toast("Attached " + file.name + " (" + text.length + " chars)");
  } catch (err) {
    toast(err.message || "Could not read that file.");
  }
  el.fileInput.value = "";
});

function renderAttach() {
  el.attachBar.innerHTML = attached.map((a, i) =>
    '<div class="attach">' + escapeHtml(a.name) +
    ' <button data-rm="' + i + '" title="Remove">' + DEL_ICON + "</button></div>"
  ).join("");
}

el.attachBar.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-rm]");
  if (!btn) return;
  attached.splice(+btn.dataset.rm, 1);
  renderAttach();
});


/* =========================================================
   6. VOICE
   ========================================================= */
if ("speechSynthesis" in window) {
  speechSynthesis.getVoices();   // warm up
}

el.voiceBtn.addEventListener("click", () => {
  voiceOut = !voiceOut;
  Store.set(KEY_VOICE, voiceOut);
  el.voiceBtn.classList.toggle("on", voiceOut);
  if (!voiceOut) Files.stopSpeaking();
  toast(voiceOut ? "Voice output ON" : "Voice output OFF");
});

el.micBtn.addEventListener("click", () => {
  if (!Files.micSupported()) {
    toast("Voice input not supported in this browser. Try Chrome or Edge.");
    return;
  }
  if (rec) { rec.stop(); rec = null; el.micBtn.classList.remove("listening"); return; }

  baseInput = el.input.value;
  rec = Files.startMic(
    (text) => { el.input.value = (baseInput ? baseInput + " " : "") + text; autoGrow(); },
    (state) => {
      if (state === "idle" || state.startsWith("error")) {
        rec = null;
        el.micBtn.classList.remove("listening");
        if (state.startsWith("error")) toast("Mic problem: " + state.split(":")[1]);
      }
    }
  );
  el.micBtn.classList.add("listening");
  el.input.focus();
});


/* =========================================================
   7. CHAT MANAGEMENT
   ========================================================= */
el.newChatBtn.addEventListener("click", () => {
  const c = { id: Date.now(), title: "New Chat", messages: [], updated: Date.now() };
  chats.unshift(c);
  currentId = c.id;
  saveChats();
  render();
  renderHistory();
  el.input.focus();
  if (window.innerWidth <= 820) el.sidebar.classList.remove("open");
});

el.historyList.addEventListener("click", (e) => {
  const del = e.target.closest("[data-del]");
  if (del) {
    e.stopPropagation();
    const id = +del.dataset.del;
    chats = chats.filter((c) => c.id !== id);
    if (currentId === id) currentId = chats.length ? chats[0].id : null;
    saveChats();
    render();
    renderHistory();
    return;
  }
  const item = e.target.closest("[data-id]");
  if (!item) return;
  currentId = +item.dataset.id;
  render();
  renderHistory();
  if (window.innerWidth <= 820) el.sidebar.classList.remove("open");
});


/* =========================================================
   8. SETTINGS
   ========================================================= */
function openSettings() {
  el.modeSelect.value = settings.mode;
  el.apiKey.value = settings.apiKey;
  el.modelName.value = settings.modelName;
  el.userName.value = settings.userName;
  el.systemPrompt.value = settings.personality;
  el.modelName.placeholder = settings.mode === "groq" ? "llama-3.3-70b-versatile" : "gemini-2.5-flash";
  applyModeToUI();
  el.modal.classList.add("open");
}

function closeSettings() { el.modal.classList.remove("open"); }

el.settingsBtn.addEventListener("click", openSettings);
el.closeSettings.addEventListener("click", closeSettings);
el.modal.addEventListener("click", (e) => { if (e.target === el.modal) closeSettings(); });

el.modeSelect.addEventListener("change", () => {
  const m = el.modeSelect.value;
  el.modelName.placeholder = m === "groq" ? "llama-3.3-70b-versatile" : "gemini-2.5-flash";
  el.keyField.style.display = m === "offline" ? "none" : "flex";
  el.modelField.style.display = m === "offline" ? "none" : "flex";
});

el.resetPromptBtn.addEventListener("click", () => {
  el.systemPrompt.value = DEFAULT_PERSONALITY;
  toast("Personality reset to default.");
});

el.saveSettingsBtn.addEventListener("click", () => {
  settings.mode = el.modeSelect.value;
  settings.apiKey = el.apiKey.value.trim();
  settings.modelName = el.modelName.value.trim();
  settings.userName = el.userName.value.trim() || "Akshat";
  settings.personality = el.systemPrompt.value.trim() || DEFAULT_PERSONALITY;
  saveSettings();
  closeSettings();
  render();
  toast("Settings saved.");
});


/* =========================================================
   9. LEARNING PANEL
   ========================================================= */
function openLearn() {
  const topics = Learning.allTopics();
  let html = "";

  /* profile */
  html += '<div class="lp-profile">';
  html +=   '<label class="lp-row"><span>Name</span><input id="lpName" value="' +
            escapeHtml(Learning.data.profile.name) + '" /></label>';
  html +=   '<label class="lp-row"><span>College</span><input id="lpCollege" value="' +
            escapeHtml(Learning.data.profile.college) + '" /></label>';
  html +=   '<label class="lp-row"><span>Branch</span><input id="lpBranch" value="' +
            escapeHtml(Learning.data.profile.branch) + '" /></label>';
  html += "</div>";
  html += '<button class="btn primary small" id="lpSave">Save profile</button>';

  if (!topics.length) {
    html += '<div class="lp-empty">No topics tracked yet. Ask me any subject and it starts recording automatically.</div>';
  } else {
    /* score line */
    const mastered = topics.filter((t) => t.level >= 3).length;
    const weak = topics.filter((t) => t.level <= 1).length;
    const due = topics.filter((t) => Learning.isDue(t.id)).length;
    const q = Learning.data.quizzes;

    html += '<div class="lp-stats">';
    html +=   '<div class="stat"><b>' + topics.length + '</b><span>topics</span></div>';
    html +=   '<div class="stat"><b>' + mastered + '</b><span>mastered</span></div>';
    html +=   '<div class="stat"><b>' + weak + '</b><span>weak</span></div>';
    html +=   '<div class="stat"><b>' + due + '</b><span>due</span></div>';
    html +=   '<div class="stat"><b>' + q.correct + '/' + q.asked + '</b><span>quiz</span></div>';
    html += "</div>";

    html += '<h4 class="lp-h">Your topics</h4><div class="lp-list">';
    topics
      .sort((a, b) => a.level - b.level || b.seen - a.seen)
      .forEach((t) => {
        const pct = [0, 34, 67, 100][t.level];
        const due = Learning.isDue(t.id);
        html +=
          '<div class="lp-item">' +
            '<div class="lp-top">' +
              '<span class="lp-name">' + escapeHtml(Learning.label(t.id)) +
                (due ? ' <em class="due">due</em>' : "") +
              "</span>" +
              '<span class="lp-level">' + LEVELS[t.level] + "</span>" +
            "</div>" +
            '<div class="bar"><i style="width:' + pct + '%"></i></div>' +
            '<div class="lp-bot">asked ' + t.seen + "× · good " + t.good + " · confused " + t.bad +
              ' · next ' + t.due + "</div>" +
            '<button class="btn tiny" data-lp-quiz="' + t.id + '">Quiz me</button>' +
          "</div>";
      });
    html += "</div>";
  }

  el.learnBody.innerHTML = html;
  el.learnModal.classList.add("open");
}

function closeLearn() { el.learnModal.classList.remove("open"); }

el.learnBtn.addEventListener("click", openLearn);
el.closeLearn.addEventListener("click", closeLearn);
el.learnModal.addEventListener("click", (e) => { if (e.target === el.learnModal) closeLearn(); });

el.learnBody.addEventListener("click", (e) => {
  if (e.target.id === "lpSave") {
    Learning.data.profile.name = $("lpName").value.trim() || "friend";
    Learning.data.profile.college = $("lpCollege").value.trim() || "not set";
    Learning.data.profile.branch = $("lpBranch").value.trim() || "not set";
    AIML.predicates.name = Learning.data.profile.name;
    AIML.predicates.college = Learning.data.profile.college;
    AIML.predicates.branch = Learning.data.profile.branch;
    Learning.save();
    render();
    toast("Profile saved.");
    openLearn();
    return;
  }
  const q = e.target.closest("[data-lp-quiz]");
  if (q) {
    closeLearn();
    send("quiz " + q.dataset.lpQuiz);
  }
});

el.resetLearnBtn.addEventListener("click", () => {
  Learning.reset();
  closeLearn();
  toast("Progress cleared.");
  updateDueBadge();
});

el.quizWeakBtn.addEventListener("click", () => {
  const weak = Learning.allTopics()
    .filter((t) => t.level <= 1 && QUIZ_BANK[t.id])
    .map((t) => t.id);
  closeLearn();
  send(weak.length ? "quiz " + weak[0] : "quiz JAVA_OOP");
});

function updateDueBadge() {
  const n = Learning.allTopics().filter((t) => Learning.isDue(t.id)).length;
  el.dueBadge.textContent = n;
  el.dueBadge.hidden = n === 0;
}


/* ---- feedback buttons under every bot reply ---- */
el.messages.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-fb]");
  if (!btn) return;

  const row = btn.closest(".bot-meta");
  const id = AIML.lastId || "GENERAL";

  Learning.record(id, { correct: btn.dataset.fb === "good" });

  row.querySelectorAll("[data-fb]").forEach((b) => (b.disabled = true));
  row.querySelector(".meta-label").textContent =
    btn.dataset.fb === "good"
      ? "Marked as understood. I will skip the basics next time."
      : "Marked as a weak topic. I will explain it more simply and add it to revision.";

  updateDueBadge();
  toast("Saved · " + Learning.label(id) + " → " + LEVELS[Learning.level(id)]);
});


/* =========================================================
   10. API KEY HELP
   ========================================================= */
el.keyHelpBtn.addEventListener("click", () => {
  el.keyGuide.hidden = !el.keyGuide.hidden;
  el.keyHelpBtn.textContent = el.keyGuide.hidden ? "How do I get a free key?" : "Hide instructions";
});

el.testKeyBtn.addEventListener("click", async () => {
  const key = el.apiKey.value.trim();
  const mode = el.modeSelect.value;

  if (!key) { showKeyTest("Paste a key first, then test it.", false); return; }

  el.testKeyBtn.disabled = true;
  el.testKeyBtn.textContent = "Testing…";
  showKeyTest("Contacting " + mode + "…", null);

  try {
    if (mode === "groq") {
      const res = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { "Authorization": "Bearer " + key }
      });
      if (!res.ok) {
        let d = "";
        try { d = ((await res.json()).error || {}).message || ""; } catch (e) {}
        showKeyTest("Groq said no — HTTP " + res.status + (d ? ": " + d : "") +
          "\n\nCheck that you copied the whole key from console.groq.com → API Keys.", false);
      } else {
        const data = await res.json();
        const chat = (data.data || []).map((m) => m.id)
          .filter((n) => !/whisper|guard|moderation/i.test(n)).slice(0, 8);
        showKeyTest("Key works. Models available: " + chat.join(", "), true);
      }
    } else {
      const r = await Api.testGemini(key);
      if (!r.ok) {
        showKeyTest(r.error, false);
      } else {
        showKeyTest(
          "Key works. Tested on **" + (r.used || "a chat model") + "**.\n\n" +
          "Models you can use: " + r.models.slice(0, 8).join(", "),
          true
        );
      }
    }
  } catch (err) {
    showKeyTest("Could not test — " + (err.message || err) +
      "\n\nIf you are offline, that is expected. Switch Brain mode to **Offline**.", false);
  }

  el.testKeyBtn.disabled = false;
  el.testKeyBtn.textContent = "Test this key";
});

function showKeyTest(msg, ok) {
  el.keyTest.hidden = false;
  el.keyTest.className = "keytest " + (ok === true ? "ok" : ok === false ? "bad" : "");
  el.keyTest.textContent = msg;
}


/* =========================================================
   11. QUICK ASK + MOBILE MENU
   ========================================================= */
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    send(chip.dataset.q);
    if (window.innerWidth <= 820) el.sidebar.classList.remove("open");
  });
});

el.menuBtn.addEventListener("click", () => el.sidebar.classList.toggle("open"));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeSettings(); closeLearn(); }
});


/* =========================================================
   12. START
   ========================================================= */
mainAgent.init();

/* first run: adopt the name from Settings so the AIML "hello" is not "friend" */
if (Learning.data.profile.name === "friend" && settings.userName) {
  Learning.data.profile.name = settings.userName;
  AIML.predicates.name = settings.userName;
  Learning.save();
}

loadAll();
render();
renderHistory();
updateDueBadge();
el.input.focus();


