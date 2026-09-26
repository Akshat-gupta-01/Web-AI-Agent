/* =========================================================
   knowledge.js  —  OFFLINE KNOWLEDGE BASE
   The assistant works with ZERO internet / ZERO API using
   these rules. Each rule has: keywords + an answer.
   Add your own rules any time (college subjects, notes, etc.)
   ========================================================= */

const KB = [

  /* ---------- Greetings ---------- */
  {
    id: "greet",
    keys: ["hello", "hi", "hey", "namaste", "good morning", "good evening", "hii"],
    answer:
`Hello Akshat! Good to see you.

I can help you with:
- College subjects (Java, Python, DSA, DBMS, OS, Networks)
- Maths (Discrete, Probability, Statistics, Engineering Maths)
- Coding, debugging and projects
- Resume, LinkedIn and interview prep
- Git, GitHub and deployment
- PPT plans and viva answers

Type your question, or click a Quick Ask option.

Tip: you can edit my personality in Settings, upload your notes/PDF,
and talk to me using the mic button.`
  },

  {
    id: "howareyou",
    keys: ["how are you", "how r u", "kaise ho", "how's it going"],
    answer:
`I'm working fine, thanks for asking.

Quick status:
- Mode: I answer offline unless you add a free API key in Settings
- Knowledge: built-in rules + any notes you upload
- Memory: every chat is saved in this browser

What are we working on today?`
  },

  {
    id: "thanks",
    keys: ["thank you", "thanks", "thx", "shukriya"],
    answer: `Happy to help. Ask the next one whenever you need it.`
  },

  {
    id: "whoareyou",
    keys: ["who are you", "your name", "what are you", "about you", "introduce yourself"],
    answer:
`I am your personal AI assistant, built for you.

What I do:
1. Explain college subjects in exam-ready format
2. Write and debug code in Java, Python, JS, HTML, CSS
3. Help with projects, from idea to deployment
4. Help with resume, LinkedIn and interviews
5. Organise assignments, exams and deadlines

How I answer:
- Answer first, explanation second
- Short by default, detailed only when useful
- Say "2 marks" / "7 marks" and I match that length
- Say "simple" or "easy English" and I simplify

Customise me in Settings — the personality box is fully editable.`
  },

  /* ---------- Java ---------- */
  {
    id: "java_oop",
    keys: ["oop", "oops", "object oriented", "object-oriented", "4 pillars of oop", "pillars of oops"],
    answer:
`OOP (Object-Oriented Programming) — 4 pillars

**1. Encapsulation**
Wrapping data + methods in a class and hiding data using access modifiers.
\`\`\`java
class Account {
    private int balance;          // data hidden
    public void deposit(int amt){ // access given
        balance += amt;
    }
}
\`\`\`

**2. Inheritance**
One class using another class's properties.
\`\`\`java
class Animal { void sound(){ System.out.println("..."); } }
class Dog extends Animal { }
\`\`\`
Java supports single, multilevel and interface inheritance (not multiple).

**3. Polymorphism**
Same method name, different behaviour.
- Compile time → method overloading
\`\`\`java
void add(int a, int b){ }   // overload
void add(double a, double b){ }
\`\`\`
- Run time → method overriding (needs inheritance + @Override)

**4. Abstraction**
Hiding implementation, showing only behaviour.
\`\`\`java
abstract class Shape {
    abstract double area();     // no body
}
class Circle extends Shape {
    double area(){ return 3.14 * r * r; }
}
\`\`\`

**Exam tip:** for 2 marks write definition + one line on each pillar.`
  },

  {
    id: "java_string",
    keys: ["string in java", "java string", "string immutable", "why string is immutable"],
    answer:
`Java String — key points

- String is a **class** (not a keyword) in \`java.lang\`
- It is **immutable** — once created, it cannot change
  \`\`\`java
  String s = "hello";
  s = s + " world";   // new object created, old one untouched
  \`\`\`
- Why immutable: security, caching, thread safety

Important methods:
\`\`\`java
s.length()  s.charAt(i)  s.substring(a,b)  s.indexOf("x")
s.equals("a")            // compare value  (== compares reference)
s.toUpperCase()  s.trim()  s.split(",")  s.replace(a,b)
\`\`\`

\`StringBuilder\` is mutable and faster for repeated concatenation.
\`StringBuffer\` is thread-safe (synchronised).

**Exam line:** String is a final, immutable class whose objects are stored in the constant pool.`
  },

  {
    id: "java_exception",
    keys: ["exception handling", "try catch", "throwable", "checked exception", "garbage collection java", "final finalize"],
    answer:
`Exception Handling in Java

Hierarchy:
\`Throwable\` → \`Error\` (serious, usually not handled) → \`Exception\` (programmer handles)
\`Exception\` → \`RuntimeException\` (unchecked) + checked exceptions

\`\`\`java
try {
    int n = 10 / 0;                 // ArithmeticException
} catch (ArithmeticException e) {
    System.out.println(e.getMessage());
} finally {
    System.out.println("always runs");
}
\`\`\`

- \`throw\` → throws a single exception object
- \`throws\` → in method signature, declares it may throw
- try-with-resources → auto closes files (\`try (FileInputStream f = ...)\`)
- Custom exception → \`class MyEx extends Exception\`

**GC:** removes unused objects. \`System.gc()\` is only a request, not a guarantee.
Finalization (\`finalize()\`) is deprecated — use \`try-with-resources\`.`
  },

  {
    id: "java_collections",
    keys: ["arraylist vs linkedlist", "collection framework", "hashmap", "arraylist", "collections in java"],
    answer:
`Java Collections — quick map

**List** → ordered, allows duplicates
- \`ArrayList\` — dynamic array. Fast random access O(1), slow insert in middle O(n)
- \`LinkedList\` — doubly linked list. Slow access O(n), fast insert/delete O(1)

**Set** → no duplicates
- \`HashSet\` (unordered), \`LinkedHashSet\` (insertion order), \`TreeSet\` (sorted)

**Map** → key-value
- \`HashMap\` — O(1) average, no order, allows one null key
- \`LinkedHashMap\` — keeps insertion order
- \`TreeMap\` — sorted by key, O(log n)

**Queue / Deque** → \`Queue\`, \`ArrayDeque\` (fast, no null allowed), \`PriorityQueue\`

When to choose:
- Read heavy + random access → ArrayList
- Insert/delete heavy in middle → LinkedList
- Key lookup → HashMap
- Sorted data → TreeMap / TreeSet`
  },

  /* ---------- Python ---------- */
  {
    id: "python_basics",
    keys: ["python basics", "python list vs tuple", "list vs tuple", "python decorators", "python oop", "__init__ python"],
    answer:
`Python core concepts

**List vs Tuple**
| Feature | List | Tuple |
|---|---|---|
| Syntax | \`[ ]\` | \`( )\` |
| Mutable | Yes | No |
| Speed | Slower | Faster |
| Use | changing data | fixed / hashable data |

**Decorators**
\`\`\`python
def log(fn):
    def wrapper(*a, **k):
        print("calling", fn.__name__)
        return fn(*a, **k)
    return wrapper

@log
def add(a, b):
    return a + b
\`\`\`

**OOP**
\`\`\`python
class Student:
    def __init__(self, name, marks):
        self.name = name
        self.marks = marks
    def grade(self):
        return "A" if self.marks > 80 else "B"

s = Student("Akshat", 90)
print(s.grade())
\`\`\`

Magic methods: \`__init__\`, \`__str__\`, \`__repr__\`, \`__len__\`, \`__eq__\`, \`__add__\`.`
  },

  {
    id: "pandas",
    keys: ["pandas", "dataframe", "numpy", "matplotlib", "read_csv"],
    answer:
`Data Science quick sheet

\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv("data.csv")
df.head()          # first 5 rows
df.info()          # column types
df.describe()      # stats
df["col"].mean(), .sum(), .max()

# filtering
df[df["marks"] > 80]
df[df["city"].isin(["Delhi", "Mumbai"])]

# missing values
df.isnull().sum()
df.fillna(df["marks"].mean())

# group by
df.groupby("city")["marks"].mean()
\`\`\`

**NumPy**
\`\`\`python
arr = np.array([1,2,3])
arr.shape, arr.dtype, arr.mean()
arr2 = arr.reshape(1,3)
\`\`\`

**Plots:** \`plt.plot\` (line), \`plt.bar\` (bar), \`plt.scatter\`, \`plt.hist\`, then \`plt.title/label/legend/show()\`.`
  },

  /* ---------- DSA ---------- */
  {
    id: "binary_search",
    keys: ["binary search", "bubble sort", "quick sort", "time complexity", "big o", "data structure", "linked list vs array"],
    answer:
`DSA quick answers

**Binary search** — searching a **sorted** array by halving the range.
\`\`\`java
int low = 0, high = arr.length - 1;
while (low <= high) {
    int mid = low + (high - low) / 2;
    if (arr[mid] == key) return mid;
    if (arr[mid] < key)  low  = mid + 1;
    else                  high = mid - 1;
}
return -1;
\`\`\`
Time **O(log n)**, Space **O(1)**. Condition fails on unsorted data.

**Big-O cheatsheet**
| Algorithm | Time |
|---|---|
| Linear search | O(n) |
| Binary search | O(log n) |
| Bubble sort | O(n²) |
| Merge / Heap sort | O(n log n) |
| Quick sort | O(n log n) avg, O(n²) worst |
| BFS / DFS | O(V + E) |
| HashMap get/put | O(1) avg |

**Array vs Linked List**
- Array: O(1) random access, fixed-ish size, contiguous memory
- Linked List: O(n) access, dynamic size, needs extra pointer memory`
  },

  /* ---------- Web dev ---------- */
  {
    id: "centre_div",
    keys: ["centre a div", "center a div", "flexbox", "flex center", "css center"],
    answer:
`Centring a div

**1. Flexbox (most used)**
\`\`\`css
.parent {
  display: flex;
  justify-content: center;   /* horizontal */
  align-items: center;       /* vertical   */
  height: 100vh;
}
\`\`\`

**2. Grid**
\`\`\`css
.parent {
  display: grid;
  place-items: center;       /* both axes */
  min-height: 100vh;
}
\`\`\`

**3. Absolute + transform (single element)**
\`\`\`css
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
\`\`\`

**4. Without flex**
\`\`\`css
.child { margin: auto; }
\`\`\` (only works if parent has \`display:flex\` or \`grid\`)

Always add \`box-sizing: border-box;\` globally to avoid sizing surprises.`
  },

  {
    id: "responsive",
    keys: ["responsive design", "media query", "mobile responsive", "media queries"],
    answer:
`Responsive design

**CSS Grid auto-fit (best modern way)**
\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
\`\`\`

**Flexbox wrap**
\`\`\`css
.row { display: flex; flex-wrap: wrap; gap: 16px; }
.row > * { flex: 1 1 220px; }
\`\`\`

**Media queries**
\`\`\`css
* { box-sizing: border-box; }

@media (max-width: 768px) {
  .sidebar { display: none; }
  h1 { font-size: 22px; }
}
\`\`\`

**Units:** \`%\`, \`rem\`/\`em\` (text), \`vh/vw\` (viewport), \`clamp()\` for fluid text:
\`font-size: clamp(1.2rem, 3vw, 2rem);\`

Mobile-first: write base styles, then add \`min-width\` queries.`
  },

  {
    id: "semantic_html",
    keys: ["semantic html", "html tags", "seo", "accessibility", "alt tag", "accessibility html"],
    answer:
`Semantic HTML + SEO + Accessibility

**Use meaningful tags, not just \`<div>\`**
\`\`\`html
<header>   site nav / logo
<nav>      links
<main>     main content (only ONE per page)
<article>  a self-contained post
<section>  a grouping of content
<aside>    side content
<footer>   footer
\`\`\`
Benefits: screen readers, SEO, smaller HTML.

**SEO basics**
- One \`<h1>\`, then \`h2 → h3\` in order, never skip levels
- \`<title>\` + \`<meta name="description">\` (150–160 chars)
- \`alt\` on every image
- Semantic links with descriptive text
- Fast load, mobile friendly

**Accessibility (a11y)**
- \`alt\` text on images
- \`<label>\` tied to inputs: \`for="id"\`
- Keyboard usable — never \`outline: none\` without a replacement
- Colour contrast 4.5:1 minimum
- \`aria-label\` on icon-only buttons
- \`role\` + \`aria-\` only when HTML alone is not enough`
  },

  /* ---------- Git / deploy ---------- */
  {
    id: "git_basics",
    keys: ["git", "git commands", "how to push", "git push", "github push", "commit"],
    answer:
`Git quick commands

**First time setup**
\`\`\`bash
git init                          # create repo locally
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/user/repo.git
git push -u origin main
\`\`\`

**Daily loop**
\`\`\`bash
git status                       # what changed
git add .                        # stage all
git commit -m "message"          # save a version
git push                         # upload it
\`\`\`

**Useful**
\`\`\`bash
git log --oneline                # history
git pull                         # download latest
git clone <url>                  # download a repo
git switch -c new-branch         # create + go to branch
git merge branch-name
git restore file                 # undo changes
git reset --soft HEAD~1          # undo last commit, keep files
\`\`\`

Write good messages: \`feat: add login page\`, \`fix: stop page refresh on submit\`.`
  },

  {
    id: "deploy",
    keys: ["deploy", "deployment", "netlify", "github pages", "host my website", "vercel"],
    answer:
`Deploying a website free

**Netlify (easiest)**
1. Push your project to GitHub
2. Go to netlify.com → Add new site → Import an existing project
3. Pick your repo
4. Set **Publish directory** (e.g. \`public\`, \`build\`, or \`.\`)
5. Click Deploy → you get a live URL in ~30 seconds

**GitHub Pages (free, already there)**
1. Settings → Pages → Source: deploy from a branch
2. Choose \`main\` branch, folder \`/ (root)\` or \`/docs\`
3. URL = \`https://user.github.io/repo\`

**Vercel** — same idea as Netlify, great for Node/React.

**Tips:** custom domain works on all three (free subdomain like \`.netlify.app\` for sure).
For a single \`index.html\`, drag the folder into app.netlify.com/drop.`
  },

  /* ---------- Resume / career ---------- */
  {
    id: "resume_tips",
    keys: ["resume", "cv", "ats", "resume tips", "how to make resume"],
    answer:
`Resume rules (ATS-friendly)

**Structure — single column, one page**
1. Name + phone + email + LinkedIn + GitHub
2. Education (college, branch, CGPA, year)
3. Projects (2–4, most relevant first)
4. Skills (grouped: Languages / Frameworks / Tools)
5. Internships / Certifications
6. Achievements (extra section, only if strong)

**Project bullet formula**
\`Action Verb\` + \`what you built\` + \`tech used\` + \`result\`
- Bad: "Made a website using HTML and CSS."
- Good: "Built a responsive food-delivery UI in HTML/CSS/JS with 12 pages and cart state, deployed on Netlify."

**ATS rules**
- Plain text, no tables, no images, no fancy headers
- Standard section names
- Match keywords from the job description
- PDF format, 10–12pt font

**No fake experience.** Real projects + real GitHub beat long internships.`
  },

  {
    id: "interview",
    keys: ["interview", "self introduction", "tell me about yourself", "hr questions", "viva"],
    answer:
`Interview prep

**Self introduction (60 seconds, easy to memorise)**
\`\`\`
"Hello, I'm Akshat Gupta, a Computer Science student at [college].
I mainly work with Java, Python and web development.

I'm strongest at building complete projects — for example, I built a
URL shortener and a food-delivery website, handling both the frontend
and the logic, and deployed them on GitHub and Netlify.

Apart from studies, I solve DSA problems and maintain my GitHub
to show my work. I'm looking for an internship where I can apply
my Java and web skills on real products and keep learning."
\`\`\`

**Common HR questions — short answers**
- *Why should we hire you?* → "I can deliver working code and explain it clearly, which matters in team projects."
- *Where do you see yourself?* → "Growing into a full-stack or backend role with Java."
- *Weakness?* → Pick a real one, and say what you're doing to fix it.
- *Do you have questions for us?* → Always ask one (training, tech stack, team size).

**Project questions to expect:** problem, why you chose the tech, hardest part, how you tested it, what you'd improve.`
  },

  /* ---------- Presentations ---------- */
  {
    id: "ppt",
    keys: ["presentation", "ppt", "slides", "slide structure", "how to present"],
    answer:
`Presentation structure that works

1. **Title** — project name, your name, college
2. **Introduction** — what the project is, in 2 lines
3. **Problem** — what difficulty exists without it
4. **Objective** — what you aimed to build
5. **Technology Used** — languages, frameworks, tools
6. **Working** — architecture / flow diagram (use one clear diagram)
7. **Features** — 4–6 bullet points, max
8. **Advantages** — short, factual
9. **Future Scope** — 2–3 realistic improvements
10. **Conclusion** — one closing line + thank you

**Slide rules:** 6 lines per slide max, 28pt+ font, one idea per slide,
no reading full paragraphs. Use a diagram instead of bullet walls.

**Speaking tip:** introduce → problem → what you built → demo → future.
Talk slowly, explain the diagram once, and end on time.`
  },

  /* ---------- Productivity ---------- */
  {
    id: "plan",
    keys: ["study plan", "make a plan", "timetable", "how to study", "revision", "organise", "organize", "productivity"],
    answer:
`Simple study system (no over-planning)

**1. One master list**
Write everything in one place: subjects, assignments, deadlines, projects.
Then sort into: **Urgent (due this week)** vs **Later**.

**2. Daily top 3**
Pick only 3 tasks per day. More than 3 never gets finished.

**3. Best order**
Hard subject first when your mind is fresh → easier work after.

**4. Revise what you learn**
- Same day: 10 min revision of what you studied
- Next day: 5 quick questions from memory
- Weekly: 1 hour mixed revision

**5. Study technique**
Read once → close the book → write what you remember → check.
This "recall" method works far better than re-reading.

**Weekly review (15 min):** what did I finish, what slipped, what moves to next week?

Use me for: breaking a syllabus into a day-wise plan, or a revision question set for any subject.`
  },

  /* ---------- Exam / marks logic ---------- */
  {
    id: "marks_format",
    keys: ["2 marks", "5 marks", "7 marks", "10 marks", "answer format", "how to write answer"],
    answer:
`Exam answer lengths

**2 marks** → 2–4 lines
- Definition
- One key point / diagram name

**5 marks** → Definition + explanation + example (or small diagram)

**7–10 marks** → Definition + main explanation + example/diagram
+ advantages/applications + a closing line

Write in this order:
1. Definition (1–2 lines)
2. Body points (numbered, one line each)
3. Example or diagram
4. Applications / advantages (only if marks demand it)

Tip: always draw a small labelled diagram in technical papers. It often gets easy marks.`
  },

  /* ---------- Debugging ---------- */
  {
    id: "debug_help",
    keys: ["debug", "error", "not working", "fix my code", "why is my code", "code not"],
    answer:
`Debugging format I follow

1. **Problem** — what happens vs what you expected
2. **Why** — the actual reason
3. **Fix** — smallest change that works
4. **Corrected code** — only if needed

**Fastest way to find a JavaScript bug**
- \`console.log()\` the value before the failing line
- Check spelling of IDs / class names
- Check the network tab for a 404 file
- Check the Console tab for the red error
- \`typeof x\` to see if a variable is undefined

**Common causes**
- Wrong file path or image path (relative vs absolute)
- Forgot \`event.preventDefault()\` on a form
- Function declared after use
- Missing closing bracket or semicolon
- Case mismatch: \`getElementById\` vs \`getElementbyid\`
- CSS not applying: missing \`.\` for class or \`#\` for id

Paste your code + the exact error message and I'll fix only the broken part.`
  },

  /* ---------- Utils ---------- */
  {
    id: "date_time",
    keys: ["what is the time", "current time", "what is the date", "today's date", "what day is today"],
    answer: null   // handled dynamically
  },

  {
    id: "calculate",
    keys: ["calculate", "compute", "solve", "sum of", "what is 1"],
    answer: null   // handled dynamically
  },

  {
    id: "help",
    keys: ["help", "what can you do", "commands", "features"],
    answer:
`Here's what I can do — no internet needed for the basics:

**Study** — explain any subject, 2-mark / 5-mark / 7-mark format
**Code** — Java, Python, JS, HTML, CSS; write, explain, fix
**Debug** — send code + error, get the smallest fix
**Projects** — plan, structure, README, viva answers
**Git & deploy** — exact commands + what each one does
**Career** — resume, LinkedIn, self-intro, interview answers
**PPT** — slide structure + speaking script
**Planning** — study plans, task breakdowns
**Files** — upload notes/PDF and ask about them
**Voice** — speak your question, hear the answer

**Shortcuts you can say to me**
- "simple" / "short" → I shorten and simplify
- "2 marks" / "7 marks" → exam length
- "book me likhne wala" → notebook-style Hindi-English answer
- "easy English" → simpler vocabulary

**Going online?** Settings → choose Gemini or Groq and paste a free key.
Then I can answer anything instead of only the built-in topics.`
  }
];
