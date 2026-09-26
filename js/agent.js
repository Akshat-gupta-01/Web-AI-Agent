/* =========================================================
   agent.js  —  PERSONALITY (system prompt) + OFFLINE ENGINE
   ========================================================= */

/* The default personality. Edit this file, or better:
   open Settings in the app and edit the box there.        */
const DEFAULT_PERSONALITY = `You are "Akshat's Personal AI Agent", a personal AI assistant built for Akshat Gupta.

IDENTITY
- You are not a generic chatbot. You help with college studies, exam prep, programming, projects, web development, assignments, research, resume/career work, GitHub & deployment, presentations, and daily productivity.

USER PROFILE
- Name: Akshat Gupta, India, timezone GMT+5:30 (IST)
- Computer Science / Engineering student
- Interests: Java, Python, Web Development, Software Development, AI/Technology, Projects, Career

COMMUNICATION STYLE
- Simple, direct, humanized language
- Short answers when possible; exam-ready content
- Practical examples, beginner-friendly, step-by-step when required
- Avoid: unnecessary theory, complicated English, repetition, robotic wording, long introductions
- Start with the answer. No "I'd be happy to help!" or "Sure!".

SPECIAL TRIGGERS
- "simple" -> simplify language
- "short"  -> only the essential answer
- "exam"   -> exam-ready structure
- "2 marks" -> 2-4 lines; "5 marks" -> definition + explanation + example; "7-10 marks" -> definition + explanation + example + advantages/applications
- "humanized" / "easy English" -> natural, simple vocabulary
- "book me likhne wala" -> notebook/assignment-style wording
- "step by step" -> numbered instructions

ACADEMIC SUBJECTS
CS: Java, Python, Data Structures, Algorithms, DBMS, Computer Networks, Operating Systems, Digital Logic, Computer Organization, Theory of Computation, Compiler Design, Software Testing, Web Development, Software Engineering.
Maths: Discrete Mathematics, Probability, Statistics, Regression, Numerical/Applied Mathematics, Engineering Mathematics.

CODE RULES
- Java: simple readable syntax, include main() when appropriate, explain only important lines
- Python: identify error -> explain why -> simplest fix -> corrected code
- Platform problems: give approach first, then code, then time/space complexity
- Web dev: never rewrite existing code unless asked. Preserve structure, IDs, classes, image paths, filenames.

DEBUGGING RULE
Never rewrite everything. Use: 1. Problem  2. Why it happens  3. Fix  4. Corrected code.
If a one-line fix is enough, give only that.

CAREER
- Resume: ATS-friendly, single column, concise, achievement-focused, no fake experience
- Interview answers: simple spoken English, memorable, natural

RESEARCH
- Verify time-sensitive information, prefer official sources, mention dates
- Never invent information or sources. If unsure, say so.

NEVER
- Fabricate results, sources, files, memory, tool actions, or completed deployments.
- Make decisions for Akshat on money, legal, health or safety matters. Present options instead.

Final priority: ACCURACY > CLARITY > PRACTICALITY > SPEED > MINIMUM FRICTION.`;


/* ---------------------------------------------------------
   Storage helpers (tiny wrapper so we use localStorage once)
   --------------------------------------------------------- */
const Store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch (e) {}
  }
};


/* ---------------------------------------------------------
   Tiny markdown-ish renderer
   Escapes HTML first (safe from pasted <script>), then
   adds code blocks, inline code, bold, italics, lists.
   --------------------------------------------------------- */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatText(raw) {
  const codeBlocks = [];
  let text = String(raw).replace(/```(\w+)?\n?([\s\S]*?)```/g, (m, lang, code) => {
    codeBlocks.push(
      '<pre><code data-lang="' + escapeHtml(lang || "") + '">' +
      escapeHtml(code.replace(/\n$/, "")) +
      "</code></pre>"
    );
    return "@@CODEBLOCK" + (codeBlocks.length - 1) + "@@";
  });

  text = escapeHtml(text);

  text = text.replace(/`([^`\n]+)`/g, "<code>$1</code>");
  text = text.replace(/\*\*([^*\n]+)\*\*/g, "<b>$1</b>");
  text = text.replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<i>$2</i>");

  // bullet lists
  text = text.replace(/^(\s*)[-*]\s+(.+)$/gm, "$1• $2");
  // numbered lists
  text = text.replace(/^(\s*)(\d+)\.\s+(.+)$/gm, "$1$2. $3");

  text = text.replace(/@@CODEBLOCK(\d+)@@/g, (m, i) => codeBlocks[+i]);

  // AIML parks < and > on private-use code points so they never get
  // double-escaped. Turn them into entities now, after escaping is done.
  if (AIML && AIML.LT) text = text.split(AIML.LT).join("&lt;").split(AIML.GT).join("&gt;");

  return text;
}


/* ---------------------------------------------------------
   Calculator — safe, supports + - * / % ^ and brackets
   --------------------------------------------------------- */
function calcExpression(expr) {
  const cleaned = String(expr)
    .replace(/[a-zA-Z_$][\w$]*/g, "")   // drop words like "calculate", "of"
    .replace(/[^0-9+\-*/%^().\s]/g, "")
    .replace(/\^/g, "**");

  if (!cleaned.trim()) return null;
  if (!/[0-9]/.test(cleaned)) return null;

  try {
    /* eslint-disable no-new-func */
    const value = Function('"use strict";return (' + cleaned + ")")();
    /* eslint-enable no-new-func */
    if (typeof value !== "number" || !isFinite(value)) return null;
    return Math.round(value * 1e8) / 1e8;
  } catch (e) {
    return null;
  }
}


/* ---------------------------------------------------------
   Document search — when a PDF / notes file is attached
   Scores sentences by how many query words they contain.
   --------------------------------------------------------- */
function searchDocument(text, query, maxResults = 3) {
  if (!text) return "";

  const stop = new Set([
    "the", "a", "an", "is", "are", "was", "in", "of", "and", "or", "to",
    "for", "on", "with", "what", "how", "why", "explain", "tell", "me",
    "this", "that", "it", "be", "do", "does", "can", "you", "i"
  ]);

  const words = String(query)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stop.has(w));

  if (!words.length) return "";

  const sentences = String(text)
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 25);

  const scored = sentences
    .map((s) => {
      const low = s.toLowerCase();
      let score = 0;
      words.forEach((w) => {
        const hits = low.split(w).length - 1;
        score += hits;
      });
      return { s: s.trim(), score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  if (!scored.length) return "";
  return scored.map((x, i) => (i + 1) + ". " + x.s).join("\n\n");
}


/* ---------------------------------------------------------
   Keyword matching
   Must respect word boundaries, otherwise "hi" matches inside
   "t-HI-p" and short words match random parts of longer words.
   --------------------------------------------------------- */
function isWordChar(c) {
  return c !== undefined && /[a-z0-9]/.test(c);
}

function matchKeyword(q, keyword) {
  const k = keyword.toLowerCase();
  let idx = q.indexOf(k);
  while (idx !== -1) {
    const before = idx === 0 ? " " : q[idx - 1];
    const afterIdx = idx + k.length;
    const after = afterIdx >= q.length ? " " : q[afterIdx];
    if (!isWordChar(before) && !isWordChar(after)) return true;
    idx = q.indexOf(k, idx + 1);
  }
  return false;
}

/* Score = how many keywords matched, weighted by keyword length.
   Longer keywords are more specific, so they count more. */
function scoreKeywords(q, keys) {
  let score = 0;
  for (const k of keys) {
    if (matchKeyword(q, k)) score += 1 + Math.min(k.length, 12) / 4;
  }
  return score;
}


/* ---------------------------------------------------------
   mainAgent.reply()
   Offline brain. Returns a string, or a Promise for async.
   --------------------------------------------------------- */
const mainAgent = {

  /* Load the AIML categories and your saved learning data. Call once at startup. */
  init() {
    AIML.load(AIML_CATS);
    const taught = Store.get("aa_taught", []);
    if (taught.length) AIML.load(AIML_CATS.concat(taught));
    Learning.load();
  },

  /* Learn a new rule on the fly.
     "when someone asks what is a pointer, answer it stores an address" */
  tryTeach(text) {
    const m = String(text).match(
      /^when\s+(?:someone|anyone|somebody|people|i)\s+(?:asks|says|ask)\s+(.+?)[\s,:]+(?:answer|reply|say|tell\s+them)\s+(.+)$/i
    );
    if (!m) return null;

    const pattern = AIML.preprocess(m[1]);
    if (!pattern || pattern === "*") return null;

    const answer = m[2].trim()
      .replace(/&lt;/g, AIML.LT)
      .replace(/&gt;/g, AIML.GT);

    const taught = Store.get("aa_taught", []).filter((c) => c.p[0] !== pattern);
    taught.push({ id: "user_taught", p: [pattern], t: answer });

    Store.set("aa_taught", taught);
    mainAgent.init();

    return "**Learned a new rule.**\n\nNow when you say *<" + pattern.toLowerCase() +
      ">* I will reply:\n\n" + answer + "\n\n_Say *reset progress* if you want me to forget it._";
  },

  /* Exam answer structure for a given mark count. */
  marksHeader(n) {
    const map = {
      2: "**2 marks** — two to four lines only:\n\n1. Definition\n2. One key point or the name of a diagram\n\nDo not add anything else.",
      3: "**3 marks** — definition plus two short points.",
      4: "**4 marks** — definition, two points, one small example.",
      5: "**5 marks** — definition + explanation + example or diagram.",
      6: "**6 marks** — definition + explanation + example + one line on use.",
      7: "**7 marks** — definition + main explanation + example/diagram + advantages or applications.",
      8: "**8 marks** — 7-mark structure plus one more application or limitation.",
      10: "**10 marks** — full answer: definition, detailed explanation, worked example, diagram, advantages, applications, conclusion."
    };
    return map[n] || map[5];
  },

  /* Build the message list sent to an online API */
  buildSystemPrompt(settings) {
    const name = (settings.userName || "").trim();
    const base = (settings.personality || "").trim() || DEFAULT_PERSONALITY;
    if (!name) return base;
    return base + "\n\n(The user's name is " + name + ". Address him by name occasionally, not every reply.)";
  },

  /* ---------- OFFLINE ENGINE ----------
     Order of attempts:
       1. live calculator
       2. active quiz answer
       3. AIML pattern match
       4. uploaded notes / PDF search
       5. plain keyword knowledge base
       6. honest fallback
  */
  offlineReply(text, ctx) {
    const q = String(text || "").toLowerCase().trim();
    const docs = (ctx && ctx.docs) || [];
    const persona = (ctx && ctx.persona) || {};

    if (!q) return "Please type a question.";

    /* 1) Calculator
       Ignore things like "2-3 marks" that only look like math. */
    const calcWord = /\b(calculate|compute|evaluate|solve|plus|minus|multiplied|divided|sum of)\b/;
    const calcShape = (/\d\s*[+\-*/^%]\s*\d/.test(q) || /\(\s*\d/.test(q)) && !/\bmarks?\b/.test(q);
    if (calcWord.test(q) || calcShape) {
      const result = calcExpression(q);
      if (result !== null) {
        return "**Result:** " + result;
      }
    }

    /* 2) An active quiz takes priority over everything else */
    if (Learning.activeQuiz) {
      const pending = Learning.activeQuiz.some((x) => !x.done);
      const wants = /^(hint|help me|clue|skip|next|pass)\b/.test(q);

      if (pending) {
        if (/^(hint|help me|clue)/.test(q)) return Learning.hint();
        if (/^(skip|next|pass)/.test(q)) {
          const p = Learning.activeQuiz.find((x) => !x.done);
          p.done = true;
          const nxt = Learning.nextQuestion();
          if (!nxt) Learning.quizOpen = false;
          return "Skipped. The answer was **" + p.a + "**." +
            (nxt ? "\n\n---\n" + nxt
                 : "\n\n---\nThat is the end of this quiz. Say *my progress* to see the update.");
        }
        const graded = Learning.checkAnswer(text);
        if (graded) return graded;
      } else if (wants) {
        return "That quiz is already finished.\n\nSay *quiz DBMS*, *quiz JAVA_OOP*, *quiz OS_DEADLOCK* — or just *quiz* and I will pick a weak topic for you.";
      }
    }

    /* 3) Quiz commands */
    const quizCmd = q.match(/^quiz(?:\s+me)?(?:\s+on)?\s+(.+)$/);
    if (quizCmd) return Learning.startQuiz(quizCmd[1], 1);
    if (/^(quiz|test me|revise me|quiz me)$/.test(q)) {
      const weak = Learning.allTopics()
        .filter((t) => t.level <= 1 && QUIZ_BANK[t.id])
        .map((t) => t.id);
      return Learning.startQuiz(weak.length ? weak[0] : "JAVA_OOP", 1);
    }

    /* 4) Learn a new rule on the fly */
    const taught = mainAgent.tryTeach(text);
    if (taught) return taught;

    /* 5) "explain X in 7 marks" — the marks structure must not lose to the
          topic itself, so handle it before the normal AIML match. */
    const mk = String(text).match(/^(.+?)\s*(?:in|for|as)?\s*\b(2|3|4|5|6|7|8|10)\s*marks?\b\s*$/i);
    if (mk && mk[1].trim().length > 2) {
      const sub = AIML.ask(mk[1].trim(), {
        previous: "", it: "",
        botName: (persona.userName || "Akshat") + "'s Assistant"
      });
      if (sub) {
        if (AIML.lastId) Learning.record(AIML.lastId);
        // drop the adaptive-difficulty footer, it is not part of the answer
        const clean = sub.replace(/\n*---\n_Difficulty:[^\n]*_\s*$/, "");
        return mainAgent.marksHeader(mk[2]) + "\n\n" + clean +
          "\n\n_This is the content. Now trim it to exactly " + mk[2] + " marks._";
      }
    }

    /* 6) AIML */
    const hit = AIML.ask(text, {
      previous: (ctx && ctx.previous) || "",
      it: (ctx && ctx.it) || "",
      botName: persona.userName ? persona.userName + "'s Assistant" : "Assistant"
    });

    if (hit !== null && hit !== "") {
      // learn from whichever category answered
      const catId = AIML.lastId || "";
      if (catId) Learning.record(catId);
      return hit + Learning.guidance(catId || "GENERAL");
    }

    /* 7) Search uploaded notes / PDF */
    if (docs.length) {
      const hits = docs.map((d) => searchDocument(d.text, text)).filter(Boolean);
      if (hits.length) {
        return "I have no AIML rule for that, but here is what your uploaded file says:\n\n" +
          hits.join("\n\n");
      }
    }

    /* 8) Plain keyword knowledge base */
    let best = null;
    let bestScore = 0;
    KB.forEach((rule) => {
      const score = scoreKeywords(q, rule.keys);
      if (score > bestScore) { bestScore = score; best = rule; }
    });
    if (best && best.answer) {
      Learning.record(best.id);
      return best.answer + Learning.guidance(best.id);
    }

    /* 9) Honest fallback */
    const ask = (persona.userName || "Akshat");
    return (
`I do not have a rule or a note for that one.

**Three ways to get an answer:**

1. **Turn on a real AI brain** — Settings → *Google Gemini* or *Groq* → paste a free key. Then I can answer anything.
2. **Upload your notes or PDF** with the paperclip and I will search them.
3. **Teach me** — say *"when someone asks <u>your question</u>, answer <u>your answer</u>"* and I will remember it.

**What I do know right now** (ask me any of these)
Java OOP · Java String · Exception handling · Collections · Python · Debugging ·
DSA & binary search · Big-O · DBMS · Operating systems · Networks · Theory of computation ·
Probability · Discrete maths · CSS · Semantic HTML · JavaScript · Git · Deployment ·
Resume · Interview · Projects · Presentations · Study plans

Say *help* for the full list.`
    );
  }
};

