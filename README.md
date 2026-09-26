# Akshat's AI Agent

A personal AI study assistant with two brains:

1. **Offline AIML engine** — real AIML 1.0.1 pattern matching, zero internet, zero API key.
2. **Online brain** — free Google Gemini key (already configured) or Groq, for anything at all.

On top of that it has a **personalised learning engine** that tracks which subjects you actually understand, adapts the depth of every answer, and tells you what is due for revision.

Built with plain HTML, CSS and JavaScript. No build step, no npm, no backend.

---

## Run it

**VS Code (recommended)**
1. Open this folder
2. Right-click `index.html` → *Open with Live Server*

**Or just double-click `index.html`.** Everything works, including the offline AIML brain. (PDF reading is better through Live Server.)

The app opens in **online Gemini mode** because `js/config.js` already holds your key.

---

## The two brains

### Offline AIML engine (always available)

Set **Brain mode → Offline** in Settings. It runs with no internet at all.

How it decides:

1. Live calculator — `calculate 24*3`
2. Active quiz answer
3. `"explain X in 7 marks"` → topic answer + the right exam structure
4. AIML pattern match (longest literal pattern wins, standard AIML rule)
5. Search your uploaded notes / PDF
6. Plain keyword knowledge base
7. Honest fallback that tells you the three ways to get a better answer

### Online brain (free)

**Gemini is already wired up.** Your key is in `js/config.js`, which is listed in `.gitignore` so it can never be pushed to GitHub by accident.

If you ever need a new key:

1. Go to **`aistudio.google.com/apikey`**
2. Sign in with your Google account (no credit card)
3. **Create API key** → *Create API key in new project*
4. Copy it — starts with `AIza` or `AQ.`
5. Settings → *Google Gemini* → paste → **Test this key** → **Save**

> **Check the Key Type column says `auth`.** Google retired the old *Standard* key type during 2026, so a Standard key gets rejected. New keys are auth keys automatically.

**Groq alternative:** `console.groq.com` → API Keys → Create API Key → paste in Settings.

---

## The personalised learning engine

This is the part that makes it *your* assistant.

**What it tracks**
- Profile: name, college, branch
- Every subject you ask about, and how many times
- Whether you said *got it* or *confused*
- Quiz score per topic
- When each topic is next due for revision

**How it adapts**

| Your level | What you get next |
|---|---|
| New / weak | Definitions, simple words, small examples |
| Seen once | Basics recap plus one new point |
| Understood | Exam drills — 2-mark and 7-mark versions |
| Mastered | Definitions skipped, edge cases and practice questions only |

**Three ways to feed it signal**
1. Press **Got it** / **Confused** under any answer
2. Say *"got it"* or *"I did not understand"* in chat
3. Take a quiz — correct answers raise the level, wrong ones lower it

**Revision** uses spaced repetition. A topic comes back after 1, 2, 4 or 7 days depending on how well you know it. A red badge on the sidebar shows how many are due.

**Commands**

| Command | What it does |
|---|---|
| `/progress` | Full learning profile, levels, quiz score, revision queue |
| `/weak` | Topics I think you struggle with |
| `/revise` | What is due today |
| `/quiz DBMS` | Question test on a topic |
| `/name Akshat` · `/college` · `/branch` | Update your profile |
| `/reset` | Clear all progress |
| `quiz JAVA_OOP` | Same as `/quiz`, without the slash |
| `hint` · `skip` | While a quiz is running |

**Teach it a new rule**

```
when someone asks what is a pointer, answer it stores a memory address
```

It saves the rule permanently and uses it from then on.

---

## Features

| Feature | Status |
|---|---|
| AIML 1.0.1 engine (patterns, wildcards, topics, conditions, random) | Working offline |
| Free Gemini brain (key pre-configured) | Working |
| Free Groq brain (optional) | Working |
| Personalised learning + spaced revision | Working |
| Quiz engine with 22 question banks | Working |
| Editable personality / system prompt | Settings → Personality |
| PDF and notes upload, searched automatically | Working |
| Chat history saved per browser | Working |
| Voice input (speak your question) | Chrome / Edge |
| Voice output (reads the answer) | Chrome / Edge |
| Live calculator | Working |
| Mobile responsive | Yes |
| Auto retry on free-tier 503 rate limits | Working |

---

## Files

```
index.html          page structure
style.css           all styling
js/config.js        YOUR API KEY — gitignored, do not publish
js/aiml-data.js     the AIML categories + keyword triggers
js/aiml.js          the AIML engine
js/learning.js      personalised learning engine + quiz bank
js/knowledge.js     fallback keyword knowledge base
js/agent.js         personality, offline brain, calculator, notes search
js/api.js           Gemini + Groq connections, retry, model discovery
js/files.js         PDF reading, voice in/out
js/app.js           UI, chat, history, settings, commands
.gitignore          keeps config.js out of git
```

---

## Customising

### Add a subject to the AIML knowledge base

Open `js/aiml-data.js`. Add a category:

```js
{ id:"my_topic",
  p:["MY TOPIC","* MY TOPIC *","EXPLAIN MY TOPIC"],
  t:`Definition and explanation here.

Supports **bold**, code blocks and lists.` }
```

Then add its keywords so short questions still reach it:

```js
const AIML_TOPIC_KEYS = {
  my_topic: ["MY TOPIC", "SECOND PHRASE", "A KEYWORD"],
  ...
};
```

Longest matching keyword wins, so the specific patterns still take priority.

### Add a label so it shows up in your progress

In `js/learning.js`, add to `TOPIC_LABELS`:

```js
MY_TOPIC: "My Topic",
```

### Change its personality

Settings → **Personality & rules**. That box is the system prompt sent to the AI. Edit it freely; it saves automatically.

To change the default permanently, edit `DEFAULT_PERSONALITY` in `js/agent.js`.

### Add quiz questions

In `js/learning.js`, add to `QUIZ_BANK`:

```js
JAVA_OOP: [
  { q: "Your question?", a: "Correct answer" },
],
```

---

## Honest limits

- **Offline mode only knows the built-in AIML topics.** Anything else → it tells you to turn on the AI brain or upload notes. It will not make an answer up.
- **The free Gemini tier is slow and rate-limited.** Expect 3–15 second replies and occasional `503 high demand` — the app retries automatically, but some replies will still be slow.
- **PDF text extraction needs internet once** to load pdf.js. Text and code files work fully offline.
- **Your key is in `js/config.js` on your disk.** If you host this project on Netlify or GitHub Pages, delete the key from that file and paste it into the app's Settings box instead.
- **The key is now in this chat history.** If that matters to you, revoke it in AI Studio and create a new one.

---

## Possible next upgrades

- Add a subject picker that loads separate knowledge files per semester
- Export a chat to PDF or Markdown
- Voice loop — auto-listen after speaking the answer
- Add a Python code-execution sandbox
- Add a spaced-repetition flashcard view of your weak topics
- Ollama support for a fully local LLM with no API key at all
