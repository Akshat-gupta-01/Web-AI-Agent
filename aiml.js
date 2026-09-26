/* =========================================================
   aiml.js  —  AIML 1.0.1 style engine (JavaScript)
   Supports: <category> patterns, * wildcards, ^ topic,
   <set> <get> <condition> <if>/<elseif>/<else> <random>/<li>
   <think> <system>/<echo> <person> <uppercase> <lowercase> <bot>
   Extensions: <learn/> <level/> <profile/> <due/>
   ========================================================= */

const AIML = {

  cats: [],
  predicates: { name: "friend", topic: "", that: "", it: "" },

  /* ---------- load ---------- */
  load(cats) {
    /* &lt; / &gt; in the AIML source would be mistaken for tags, and would also
       get double-escaped later. Park them on private-use code points and let
       formatText() turn them into entities at the very end. */
    AIML.LT = "\uE000";
    AIML.GT = "\uE001";

    AIML.cats = cats.map((c) => {
      const patterns = (c.p || []).slice();

      /* widen a category with its keyword triggers */
      const keys = (typeof AIML_TOPIC_KEYS !== "undefined" && AIML_TOPIC_KEYS[c.id]) || [];
      keys.forEach((k) => {
        const w = "* " + k + " *";
        if (patterns.indexOf(w) === -1) patterns.push(w);
      });

      return {
        p: patterns.map((x) => AIML.preprocess(x)),
        t: (c.t || "")
          .replace(/&lt;/g, AIML.LT)
          .replace(/&gt;/g, AIML.GT),
        id: c.id || ""
      };
    });
  },

  /* ---------- text normalisation ---------- */
  preprocess(s) {
    return String(s)
      .toUpperCase()
      .replace(/\s+/g, " ")
      .trim();
  },

  normalize(s) {
    return String(s)
      .toUpperCase()
      .replace(/[?!.,;:\"'`]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  },

  /* ---------- pattern -> regex ---------- */
  toRegex(pattern) {
    // separate topic part  "HELLO ^MATH"
    let main = pattern;
    let topic = null;
    const hat = pattern.indexOf("^");
    if (hat !== -1) {
      main = pattern.slice(0, hat).trim();
      topic = pattern.slice(hat + 1).trim();
    }

    const tokens = main.split(" ").filter(Boolean);
    let src = "";
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      const prev = i > 0 ? tokens[i - 1] : "";
      if (i > 0) {
        // be flexible about spaces next to a wildcard
        src += (prev.includes("*") || t.includes("*")) ? "\\s*" : "\\s+";
      }
      if (t === "*") {
        src += "(.*?)";
      } else if (t.startsWith("*") && t.endsWith("*") && t.length > 1) {
        src += "(.*?)";
      } else if (t.startsWith("*")) {
        src += "(.*?)" + AIML.escape(t.slice(1));
      } else if (t.endsWith("*")) {
        src += AIML.escape(t.slice(0, -1)) + "(.*?)";
      } else {
        src += AIML.escape(t);
      }
    }

    // ^ topic -> the pattern is only valid while this topic is set
    if (topic) {
      src += "(?:\\s*\\^?\\s*" + AIML.escape(topic) + ")?";
    }
    return { regex: new RegExp("^" + src + "\\s*$", "i"), topic: topic };
  },

  escape(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  },

  /* ---------- matching ---------- */
  match(input) {
    const text = AIML.normalize(input);
    let best = null;
    let bestScore = -1;

    for (const cat of AIML.cats) {
      for (const p of cat.p) {
        if (/^[\s*]*$/.test(p)) continue;         // wildcard-only, too greedy

        const built = AIML.toRegex(p);

        // "PATTERN ^TOPIC" only matches while that topic is active
        if (built.topic && built.topic !== AIML.predicates.topic.toUpperCase()) continue;

        const m = built.regex.exec(text);
        if (!m) continue;

        // AIML rule: the pattern with the most literal characters wins
        const literal = p.replace(/\*/g, "").replace(/\s+/g, " ").trim().length;
        const score = literal * 10;
        if (score > bestScore) {
          bestScore = score;
          best = { cat: cat, wildcards: m.slice(1).map((x) => (x || "").trim()) };
        }
      }
    }
    return best;
  },

  /* ---------- attribute parsing ---------- */
  attrs(s) {
    const o = {};
    const re = /([a-zA-Z_][\w-]*)\s*=\s*"([^"]*)"|([a-zA-Z_][\w-]*)\s*=\s*'([^']*)'/g;
    let m;
    while ((m = re.exec(s))) {
      if (m[1] !== undefined) o[m[1].toLowerCase()] = m[2];
      else o[m[3].toLowerCase()] = m[4];
    }
    return o;
  },

  branches(body) {
    const out = [];
    const re = /<(if|elseif|else)\b([^>]*?)(\/?)>/g;
    let m;
    while ((m = re.exec(body))) {
      const name = m[1], a = m[2], selfClose = m[3] === "/";
      if (selfClose) { out.push({ name: name, attrs: AIML.attrs(a), body: "" }); continue; }
      const close = "</" + name + ">";
      const end = body.indexOf(close, re.lastIndex);
      const inner = end === -1 ? body.slice(re.lastIndex) : body.slice(re.lastIndex, end);
      out.push({ name: name, attrs: AIML.attrs(a), body: inner });
      if (end !== -1) re.lastIndex = end + close.length;
    }
    return out;
  },

  /* ---------- template evaluation ---------- */
  render(tpl, state) {
    let out = "";
    let i = 0;
    tpl = String(tpl);

    while (i < tpl.length) {
      const lt = tpl.indexOf("<", i);
      if (lt === -1) { out += tpl.slice(i); break; }
      out += tpl.slice(i, lt);

      const gt = tpl.indexOf(">", lt);
      if (gt === -1) { out += tpl.slice(lt); break; }

      const name = tpl.slice(lt + 1, gt).trim();
      const selfClose = name.endsWith("/");
      const tagName = (selfClose ? name.slice(0, -1) : name).split(/\s+/)[0].toLowerCase();
      const rawAttrs = selfClose ? name.slice(0, -1) : name;

      if (selfClose) {
        out += AIML.tag(tagName, AIML.attrs(rawAttrs), "", state);
        i = gt + 1;
        continue;
      }

      const closeTag = "</" + (selfClose ? name.slice(0, -1) : name).split(/\s+/)[0] + ">";
      const end = tpl.indexOf(closeTag, gt + 1);
      const body = end === -1 ? "" : tpl.slice(gt + 1, end);

      out += AIML.tag(tagName, AIML.attrs(rawAttrs), body, state);

      i = end === -1 ? gt + 1 : end + closeTag.length;
    }
    return out;
  },

  tag(name, a, body, state) {
    switch (name) {

      case "think":
        return "";

      case "set": {
        const v = a.value !== undefined
          ? a.value
          : AIML.render(body, state).replace(/\s+/g, " ").trim();
        AIML.predicates[a.name] = v;
        return "";
      }

      case "get":
        return String(state && state.predicates ? (state.predicates[a.name] || "") : "");

      case "system":
      case "echo":
        return state.input;

      case "star": {
        const i = a.index ? parseInt(a.index, 10) : 1;
        if (i === 1) return state.star1 || "";
        if (i === 2) return state.star2 || "";
        return (state.wildcards || [])[i - 1] || "";
      }

      case "uname": {
        /* the wildcards are upper-cased by normalisation, so tidy the name */
        const raw = String((Learning && Learning.data.profile.name) ||
                           state.predicates.name || "friend");
        return raw.toLowerCase().replace(/\b[a-z]/g, (ch) => ch.toUpperCase());
      }

      case "sysdate": {
        const now = new Date();
        const d = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
        const t = now.toLocaleTimeString("en-IN", { hour12: true });
        return "**Right now**\n\n- Date: " + d + "\n- Time: " + t + "\n- Timezone: IST (GMT+5:30)";
      }

      case "bot":
        return state.botName;

      case "person": {
        const t = (body || state.input).toLowerCase();
        const map = {
          i: "you", me: "you", my: "your", mine: "yours", myself: "yourself",
          you: "I", your: "my", yours: "mine", yourself: "myself",
          am: "are", are: "am", was: "were", were: "was"
        };
        return t.replace(/\b(i|me|my|mine|myself|you|your|yours|yourself|am|are|was|were)\b/g,
          (w) => map[w] || w);
      }

      case "uppercase":
        return AIML.render(body, state).toUpperCase();

      case "lowercase":
        return AIML.render(body, state).toLowerCase();

      case "random": {
        const items = [];
        const re = /<li\b[^>]*>([\s\S]*?)<\/li>/g;
        let m;
        while ((m = re.exec(body))) items.push(m[1]);
        if (!items.length) return AIML.render(body, state);
        const pick = items[Math.floor(Math.random() * items.length)];
        return AIML.render(pick, state);
      }

      case "condition": {
        const val = String(state.predicates[a.name] || "");
        const cond = a.value !== undefined ? a.value : val;
        const bs = AIML.branches(body);
        let done = false;
        for (const b of bs) {
          if (done && b.name !== "else") continue;
          if (b.name === "else") { done = true; return AIML.render(b.body, state); }
          const bv = b.attrs.value !== undefined
            ? b.attrs.value
            : AIML.render(b.body, state);
          if (bv === cond || val === cond) { done = true; return AIML.render(b.body, state); }
        }
        return "";
      }

      /* a bare <if> only matters inside <condition>, which already
         extracts each branch body. Rendered directly it just passes text on. */
      case "if":
        return AIML.render(body, state);

      /* ---- custom extensions ---- */

      case "learn": {
        const topic = a.topic || "GENERAL";
        const level = a.level ? parseInt(a.level, 10) : 1;
        if (typeof Learning !== "undefined") Learning.record(topic, { level: level });
        return "";
      }

      /* apply the level to whatever subject was discussed last.
         "got it" after an OOP answer should mark OOP, not a generic topic. */
      case "learnlast": {
        const level = a.level ? parseInt(a.level, 10) : 1;
        if (typeof Learning !== "undefined" && Learning.data.last) {
          Learning.record(Learning.data.last, { level: level });
        }
        return "";
      }

      case "level": {
        if (typeof Learning === "undefined") return "0";
        return String(Learning.level(a.topic || "GENERAL"));
      }

      case "due": {
        if (typeof Learning === "undefined") return "";
        return Learning.dueList();
      }

      case "weak": {
        if (typeof Learning === "undefined") return "";
        return Learning.weakList();
      }

      default:
        return AIML.render(body, state);
    }
  },

  /* ---------- main entry ---------- */
  ask(input, state) {
    const st = state || {};
    st.predicates = AIML.predicates;
    st.input = input;
    st.botName = st.botName || "Assistant";
    st.wildcards = [];

    AIML.predicates.that = st.previous || "";
    AIML.predicates.it = st.it || AIML.predicates.it || "";

    const hit = AIML.match(input);
    if (!hit) return null;

    st.wildcards = hit.wildcards;

    // <star index="1"/>
    const star1 = hit.wildcards[0] || "";
    if (star1) {
      AIML.predicates.it = star1;
      AIML.predicates.that = star1;
    }

    // capture it in state for templates that ask for star
    st.star1 = star1;
    st.star2 = hit.wildcards[1] || "";

    let out = AIML.render(hit.cat.t, st);
    out = out.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    AIML.lastId = hit.cat.id;
    return out;
  }
};

function a2s(a) {
  let s = "";
  for (const k in a) s += " " + k + '="' + a[k] + '"';
  return s;
}
