/* =========================================================
   learning.js  —  PERSONALISED LEARNING ENGINE
   Tracks what you have studied, how well you understood it,
   and what is due for revision. Then adapts the next answer
   to your level instead of repeating the same explanation.
   ========================================================= */

const LEARNING_KEY = "aa_learning";

/* Human labels for the topic ids used in AIML */
const TOPIC_LABELS = {
  JAVA_OOP: "Java OOP",
  JAVA_STRING: "Java String",
  JAVA_EXCEPTION: "Java Exception Handling",
  JAVA_COLLECTIONS: "Java Collections",
  JAVA_BASIC: "Java basics",
  PYTHON_BASICS: "Python basics",
  PYTHON_ERROR: "Python debugging",
  PANDAS: "Python data science",
  DSA_BINARY: "Binary search",
  SORTING: "Sorting algorithms",
  BIGO: "Time complexity",
  DBMS: "DBMS",
  OS_DEADLOCK: "Operating systems",
  CN_OSI: "Computer networks",
  TOCA: "Theory of computation",
  MATH_PROBABILITY: "Probability & Statistics",
  DM_GRAPH: "Discrete mathematics",
  CENTRE_DIV: "CSS centring",
  CSS_BASICS: "CSS fundamentals",
  HTML_SEMANTIC: "Semantic HTML & SEO",
  JS_BASICS: "JavaScript basics",
  DEBUG: "Debugging",
  GIT: "Git & GitHub",
  DEPLOY: "Deployment",
  RESUME: "Resume writing",
  INTERVIEW: "Interview prep",
  LINKEDIN: "LinkedIn & GitHub profile",
  PROJECT_IDEA: "Project ideas",
  PROJECT_STRUCTURE: "Project structure",
  PPT: "Presentations",
  STUDY_PLAN: "Study planning",
  ASSIGNMENT: "Assignments",
  MARKS: "Exam answer format",
  GENERAL: "General"
};

/* Quiz bank — one question per topic, a few extras for the big ones */
const QUIZ_BANK = {
  JAVA_OOP: [
    { q: "Which OOP pillar hides data using access modifiers?", a: "Encapsulation" },
    { q: "Polymorphism that is resolved at compile time is called…", a: "Method overloading" },
    { q: "Polymorphism resolved at runtime needs which two things?", a: "Inheritance and @Override" },
    { q: "Abstract class vs interface — which one can have a main method?", a: "Abstract class" },
    { q: "Why does Java not allow multiple inheritance of classes?", a: "Ambiguity; it uses interfaces instead" }
  ],
  JAVA_STRING: [
    { q: "String in Java is a…", a: "Final immutable class" },
    { q: "Why is String immutable?", a: "Security, string pool caching, thread safety" },
    { q: "equals() vs == — what does each compare?", a: "equals compares values, == compares references" },
    { q: "Which class is mutable and faster for concatenation?", a: "StringBuilder" }
  ],
  DBMS: [
    { q: "Which normal form removes transitive dependency?", a: "3NF" },
    { q: "What does 2NF remove?", a: "Partial dependency" },
    { q: "What does 1NF require of each cell?", a: "A single atomic value" },
    { q: "Expand ACID.", a: "Atomicity, Consistency, Isolation, Durability" }
  ],
  OS_DEADLOCK: [
    { q: "How many conditions are necessary for a deadlock?", a: "Four" },
    { q: "Name the four deadlock conditions.", a: "Mutual exclusion, hold and wait, no preemption, circular wait" },
    { q: "Which algorithm avoids deadlock?", a: "Banker's algorithm" },
    { q: "LRU stands for what, and which structure does it use?", a: "Least Recently Used; stack based counters" }
  ],
  CN_OSI: [
    { q: "Which OSI layer does routing happen in?", a: "Network layer" },
    { q: "How many bits is an IPv4 address?", a: "32 bits" },
    { q: "Which protocol guarantees delivery, TCP or UDP?", a: "TCP" },
    { q: "What is the default HTTPS port?", a: "443" }
  ],
  DSA_BINARY: [
    { q: "What is binary search's time complexity?", a: "O(log n)" },
    { q: "What must the array be before binary search?", a: "Sorted" },
    { q: "Binary search uses which technique?", a: "Divide and conquer" }
  ],
  BIGO: [
    { q: "What is the average lookup time of a HashMap?", a: "O(1)" },
    { q: "What is the time complexity of merge sort?", a: "O(n log n)" },
    { q: "Order these: O(n), O(log n), O(1).", a: "O(1) < O(log n) < O(n)" }
  ],
  CENTRE_DIV: [
    { q: "Which two properties centre a div with flexbox?", a: "justify-content and align-items" },
    { q: "What one-line grid property centres both axes?", a: "place-items: center" }
  ],
  CSS_BASICS: [
    { q: "What does box-sizing: border-box do?", a: "Includes padding and border inside the declared width" },
    { q: "Which selector wins, #id or .class?", a: "#id" },
    { q: "Flexbox is for 1D or 2D layout?", a: "1D" }
  ],
  GIT: [
    { q: "Which command uploads your commits?", a: "git push" },
    { q: "Which command stages every change?", a: "git add ." },
    { q: "Push rejected — what do you do first?", a: "git pull, then git push again" }
  ],
  RESUME: [
    { q: "What is the strongest project bullet formula?", a: "Action verb + what you built + tech + result" },
    { q: "Why avoid tables and graphics in a resume?", a: "ATS cannot parse them" },
    { q: "How many pages should a fresher resume be?", a: "One page" }
  ],
  INTERVIEW: [
    { q: "How long should a self introduction be?", a: "About 60 seconds" },
    { q: "Name three project questions you must prepare.", a: "Problem, tech choice, hardest part" }
  ],
  MATH_PROBABILITY: [
    { q: "State Bayes' theorem.", a: "P(B|A) = P(A|B)P(B) / P(A)" },
    { q: "Expected value of a fair die?", a: "3.5" },
    { q: "Which distribution models events in a fixed time interval?", a: "Poisson" }
  ],
  PYTHON_BASICS: [
    { q: "List vs tuple — which is mutable?", a: "List" },
    { q: "What does __init__ do?", a: "Initialises a new object's attributes" },
    { q: "Which is immutable, a list or a tuple?", a: "Tuple" }
  ],
  JAVA_EXCEPTION: [
    { q: "Which block always runs?", a: "finally" },
    { q: "Does finally always run?", a: "Almost — not on System.exit or a JVM crash" },
    { q: "Is System.gc() a guarantee?", a: "No, it is only a request" }
  ],
  HTML_SEMANTIC: [
    { q: "How many h1 tags should a page have?", a: "One" },
    { q: "Which tag holds the main content?", a: "<main>" },
    { q: "Why add alt text?", a: "Accessibility and SEO" }
  ],
  DEPLOY: [
    { q: "Which free host is the easiest for a static site?", a: "Netlify" },
    { q: "What do you set on Netlify when deploying a plain folder?", a: "The publish directory" }
  ],
  PPT: [
    { q: "How many lines should one slide have, maximum?", a: "Six" },
    { q: "Which slide shows your architecture?", a: "Working" }
  ],
  DM_GRAPH: [
    { q: "Formula for nCr?", a: "n! / (r! (n-r)!)" },
    { q: "What makes a relation an equivalence relation?", a: "Reflexive, symmetric and transitive" },
    { q: "How many edges does a tree with n nodes have?", a: "n - 1" }
  ],
  TOCA: [
    { q: "Which machine has a stack?", a: "PDA" },
    { q: "Which language class does a DFA recognise?", a: "Regular languages" },
    { q: "What is the pumping lemma used for?", a: "Proving a language is not regular" }
  ],
  SORTING: [
    { q: "Which sorts are stable?", a: "Bubble, insertion, merge" },
    { q: "Worst case of quick sort?", a: "O(n squared)" }
  ]
};

/* levels: 0 = new/weak, 1 = seen, 2 = understood once, 3 = mastered */
const LEVELS = ["new / weak", "seen once", "understood", "mastered"];

/* revision gap in days, by level */
const GAPS = [1, 2, 4, 7];

/* Some topics are reachable from two places (an AIML category id and a
   plain keyword rule id). Map the duplicates onto one canonical id. */
const ALIASES = {
  java_oop: "JAVA_OOP", java_string: "JAVA_STRING", java_exception: "JAVA_EXCEPTION",
  java_collections: "JAVA_COLLECTIONS", java_basic: "JAVA_BASIC",
  python_basics: "PYTHON_BASICS", python_error: "PYTHON_ERROR", pandas: "PANDAS",
  binary_search: "DSA_BINARY", sorting: "SORTING", big_o: "BIGO",
  dbms: "DBMS", os_deadlock: "OS_DEADLOCK", cn_osi: "CN_OSI", toca: "TOCA",
  probability: "MATH_PROBABILITY", dm_graph: "DM_GRAPH",
  centre_div: "CENTRE_DIV", css_basics: "CSS_BASICS", responsive: "CSS_BASICS",
  semantic_html: "HTML_SEMANTIC", js_basics: "JS_BASICS", debug_help: "DEBUG", debug: "DEBUG",
  git_basics: "GIT", deploy: "DEPLOY", resume_tips: "RESUME", interview: "INTERVIEW",
  linkedin: "LINKEDIN", project_idea: "PROJECT_IDEA", project_structure: "PROJECT_STRUCTURE",
  ppt: "PPT", plan: "STUDY_PLAN", assignment: "ASSIGNMENT", marks_format: "MARKS"
};

const Learning = {

  data: {
    profile: { name: "friend", college: "not set", branch: "not set", year: "" },
    topics: {},
    quizzes: { asked: 0, correct: 0 },
    last: "",
    started: ""
  },

  /* ---------- persistence ---------- */
  load() {
    const raw = Store.get(LEARNING_KEY, null);
    if (raw && typeof raw === "object") {
      Learning.data = Object.assign(Learning.data, raw);
      Learning.data.profile = Object.assign({ name: "friend", college: "not set", branch: "not set", year: "" },
                                           raw.profile || {});
      Learning.data.topics = raw.topics || {};
      Learning.data.quizzes = raw.quizzes || { asked: 0, correct: 0 };
    }
    if (!Learning.data.started) {
      Learning.data.started = new Date().toISOString().slice(0, 10);
    }
    // drop AIML predicate name / college into the profile
    const n = (AIML.predicates && AIML.predicates.name) || "";
    if (n && n !== "friend") Learning.data.profile.name = n;
    const c = AIML.predicates && AIML.predicates.college;
    if (c) Learning.data.profile.college = c;
    const b = AIML.predicates && AIML.predicates.branch;
    if (b) Learning.data.profile.branch = b;
  },

  save() { Store.set(LEARNING_KEY, Learning.data); },

  reset() {
    Learning.data = {
      profile: { name: "friend", college: "not set", branch: "not set", year: "" },
      topics: {},
      quizzes: { asked: 0, correct: 0 },
      last: "",
      started: new Date().toISOString().slice(0, 10)
    };
    Learning.save();
  },

  label(id) { return TOPIC_LABELS[id] || id.replace(/_/g, " "); },

  /* fold aliases onto the canonical topic id */
  canon(id) {
    const s = String(id || "").toUpperCase().replace(/[^A-Z0-9_]/g, "_");
    return ALIASES[s.toLowerCase()] || s;
  },

  /* ---------- recording ---------- */
  record(topicId, opts) {
    if (!topicId) return;
    const id = Learning.canon(topicId);
    if (!TOPIC_LABELS[id]) return;      // never track chatter like "hello"
    Learning.data.last = id;
    const t = Learning.data.topics[id] ||
      (Learning.data.topics[id] = { seen: 0, level: 0, good: 0, bad: 0, last: "", due: 0 });

    t.seen += 1;
    t.last = new Date().toISOString().slice(0, 10);

    if (opts && typeof opts.level === "number") {
      // AIML <learn level="n"/> — an explicit signal from the answer
      t.level = Math.max(t.level, opts.level);
      if (opts.level === 0) t.bad += 1;
      else if (opts.level >= 2) t.good += 1;
    } else if (opts && opts.correct === true) {
      t.good += 1;
      t.level = Math.min(3, t.level + 1);
    } else if (opts && opts.correct === false) {
      t.bad += 1;
      t.level = Math.max(0, t.level - 1);
    } else {
      t.level = Math.min(3, Math.max(t.level, 1));
    }

    t.due = Learning.nextDue(t.level);
    Learning.save();
  },

  level(topicId) {
    const id = Learning.canon(topicId);
    const t = Learning.data.topics[id];
    return t ? t.level : 0;
  },

  nextDue(level) {
    const gap = GAPS[Math.max(0, Math.min(3, level))];
    const d = new Date();
    d.setDate(d.getDate() + gap);
    return d.toISOString().slice(0, 10);
  },

  isDue(id) {
    const t = Learning.data.topics[id];
    if (!t) return false;
    return new Date(t.due) <= new Date();
  },

  /* ---------- lists ---------- */
  allTopics() {
    return Object.keys(Learning.data.topics).map((id) =>
      Object.assign({ id: id }, Learning.data.topics[id]));
  },

  dueList() {
    const due = Learning.allTopics().filter((t) => Learning.isDue(t.id));
    if (!due.length) {
      return "**Revision queue is empty.** Nothing is due right now.\nAsk me about a subject and it will be added automatically.";
    }
    let s = "**Due for revision** (" + due.length + ")\n";
    due.sort((a, b) => a.level - b.level).forEach((t) => {
      s += "- " + Learning.label(t.id) + " — " + LEVELS[t.level] + ", asked " + t.seen + "×";
    });
    s += "\n\nSay *quiz JAVA_OOP* to test yourself, or *revise* to see this again.";
    return s;
  },

  weakList() {
    const weak = Learning.allTopics()
      .filter((t) => t.level <= 1 && t.seen >= 1)
      .sort((a, b) => (a.good - a.bad) - (b.good - b.bad));
    if (!weak.length) return "**No weak topics yet.** I have not found any topic you struggled with.";
    return "**Weak topics** — I will explain these in a simpler way next time.\n" +
      weak.map((t) => "- " + Learning.label(t.id) + " (" + LEVELS[t.level] + ", " + t.bad + "× confused)")
        .join("\n");
  },

  strongList() {
    const strong = Learning.allTopics().filter((t) => t.level >= 3).sort((a, b) => b.seen - a.seen);
    if (!strong.length) return "**No mastered topics yet.** Answer the feedback buttons and I will track them.";
    return "**You are strong in**\n" + strong.map((t) => "- " + Learning.label(t.id)).join("\n");
  },

  /* ---------- adaptive guidance ---------- */
  /* Level 0/1 -> basics. Level 2 -> exam drills. Level 3 -> skip basics. */
  guidance(topicId) {
    const lv = Learning.level(topicId);
    if (lv <= 1) {
      return "\n\n---\n_Difficulty: basics mode. Tell me *simple* for an even shorter version, or *got it* when it clicks._";
    }
    if (lv === 2) {
      return "\n\n---\n_Difficulty: exam mode. Ask me for a 2-mark and a 7-mark version of this, or say *got it* to move to advanced._";
    }
    return "\n\n---\n_Difficulty: advanced mode — I will skip definitions from now on and give edge cases and practice questions._";
  },

  /* ---------- quiz ---------- */
  startQuiz(topicId, count) {
    const id = Learning.canon(topicId);
    let bank = QUIZ_BANK[id];

    if (!bank) {
      // topic has no bank -> use weak topics instead
      const weak = Learning.allTopics()
        .filter((t) => t.level <= 1 && QUIZ_BANK[t.id])
        .map((t) => t.id);
      if (!weak.length) {
        return "I have no question bank for *<star1/>* yet.\n\nTry one of these:\n" +
          Object.keys(QUIZ_BANK).slice(0, 8).map((k) => "- " + Learning.label(k)).join("\n") +
          "\n\nOr say *weak topics* to see what you should revise.";
      }
      bank = [];
      weak.forEach((w) => bank.push.apply(bank, QUIZ_BANK[w]));
    }

    const n = Math.min(count || 1, bank.length);
    const pool = bank.slice().sort(() => Math.random() - 0.5).slice(0, n);

    Learning.activeQuiz = pool.map((q, i) => ({ i: i, q: q.q, a: q.a, done: false }));
    Learning.quizOpen = true;

    let s = "**Quiz on " + Learning.label(id) + "** — " + n + " question" + (n > 1 ? "s" : "") + "\n\n";
    s += Learning.activeQuiz[0].q + "\n\n_Answer in one line, or say *hint* for a nudge, or *skip* to move on._";
    return s;
  },

  nextQuestion() {
    const q = Learning.activeQuiz.find((x) => !x.done);
    if (!q) return null;
    return "**Q" + (q.i + 1) + "/" + Learning.activeQuiz.length + "**\n\n" + q.q +
      "\n\n_Answer, or say *hint* / *skip*._";
  },

  checkAnswer(text) {
    const q = Learning.activeQuiz && Learning.activeQuiz.find((x) => !x.done);
    if (!q) return null;

    const a = String(text).toLowerCase();
    const answer = String(q.a).toLowerCase();

    // token overlap as a forgiving match
    const norm = (s) => s.replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter((w) => w.length > 2);
    const want = norm(answer);
    const got = new Set(norm(a));
    const hits = want.filter((w) => got.has(w)).length;
    const correct = want.length ? hits / want.length >= 0.5 : false;

    q.done = true;
    Learning.data.quizzes.asked += 1;
    if (correct) {
      Learning.data.quizzes.correct += 1;
      Learning.record(topicsFor(q), { correct: true });
    } else {
      Learning.record(topicsFor(q), { correct: false });
    }
    Learning.save();

    let s = correct
      ? "**Correct.** " + q.a + "\n\n_Logged as understood._"
      : "**Not quite.** The answer is: **" + q.a + "**\n\n_Logged as a weak topic, so I will bring it back in revision._";

    const nxt = Learning.nextQuestion();
    if (!nxt) Learning.quizOpen = false;
    return s + (nxt ? "\n\n---\n" + nxt : "\n\n---\nThat is the end of this quiz. Say *my progress* to see the update.");
  },

  hint() {
    const q = Learning.activeQuiz && Learning.activeQuiz.find((x) => !x.done);
    if (!q) return null;
    const first = String(q.a).split(/\s+/)[0];
    return "**Hint** — it starts with *" + first.charAt(0).toUpperCase() + first.slice(1) +
      "* and has " + q.a.split(/\s+/).length + " key word(s). Try again, or say *skip*.";
  },

  /* ---------- summary ---------- */
  summary() {
    const topics = Learning.allTopics();
    const p = Learning.data.profile;
    const q = Learning.data.quizzes;
    const mastered = topics.filter((t) => t.level >= 3).length;
    const weak = topics.filter((t) => t.level <= 1).length;

    let s = "**Your learning profile**\n\n";
    s += "- Name: " + p.name + "\n";
    s += "- College: " + p.college + "\n";
    s += "- Branch: " + p.branch + (p.year ? " (" + p.year + ")" : "") + "\n";
    s += "- Tracking since: " + Learning.data.started + "\n\n";

    if (!topics.length) {
      s += "_No topics tracked yet. Ask me any subject and it starts recording automatically._";
      return s;
    }

    s += "- Topics studied: **" + topics.length + "**\n";
    s += "- Mastered: **" + mastered + "**\n";
    s += "- Needs work: **" + weak + "**\n";
    s += "- Quiz score: **" + q.correct + " / " + q.asked + "**\n\n";

    s += "**By level**\n";
    LEVELS.forEach((name, i) => {
      const list = topics.filter((t) => t.level === i);
      if (!list.length) return;
      s += "\n*" + name + "*\n" + list.map((t) =>
        "- " + Learning.label(t.id) + " — " + t.seen + "× asked, next revision " + t.due).join("\n");
    });

    s += "\n\n---\n\n" + Learning.dueList();
    return s;
  }
};

/* map a quiz back to the topic(s) it came from */
function topicsFor(q) {
  for (const id in QUIZ_BANK) {
    if (QUIZ_BANK[id].some((x) => x.q === q.q)) return id;
  }
  return "GENERAL";
}
