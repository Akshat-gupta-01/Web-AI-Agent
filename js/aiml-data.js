/* =========================================================
   aiml-data.js  —  THE AIML CATEGORIES
   Written in AIML syntax inside a JS array so the app also
   works when opened directly (no server, no fetch needed).
   ========================================================= */

/* -------------------------------------------------------------
   Extra keyword triggers.
   A pattern like "DBMS" only matches when the whole message is
   exactly that. These lists generate "* KEY *" patterns instead,
   so "3NF transitive dependency" also reaches the DBMS answer.
   Longest literal keyword wins, so the specific patterns below
   still take priority.
   ------------------------------------------------------------- */

const AIML_TOPIC_KEYS = {
  dbms:              ["DBMS","NORMALISATION","NORMALIZATION","1NF","2NF","3NF","BCNF","PRIMARY KEY","FOREIGN KEY","ACID","SQL","JOIN","ER DIAGRAM","RELATIONAL MODEL","DB"],
  os_deadlock:       ["OS","DEADLOCK","PROCESS SCHEDULING","SCHEDULING","PAGE REPLACEMENT","ROUND ROBIN","SEMAPHORE","OPERATING SYSTEM","THREADS IN OS"],
  cn_osi:            ["NETWORKING","NETWORKS","OSI","TCP","IP ADDRESS","DNS","COMPUTER NETWORK","PACKET","ROUTER"],
  toca:              ["THEORY OF COMPUTATION","AUTOMATA","DFA","NFA","TURING MACHINE","PUMPING LEMMA","GRAMMAR","REGULAR EXPRESSION","COMPILER DESIGN","LEXICAL ANALYSIS"],
  math_probability:  ["PROBABILITY","STATISTICS","BAYES","REGRESSION","HYPOTHESIS","NORMAL DISTRIBUTION","VARIANCE","STANDARD DEVIANCE","EXPECTED VALUE","PROBABILITY DISTRIBUTION"],
  dm_graph:          ["DISCRETE MATHEMATICS","GRAPH THEORY","PERMUTATION","COMBINATION","RELATIONS","INCLUSION EXCLUSION","NUMBER SYSTEM","LOGIC"],
  java_oop:          ["OOP CONCEPT","PILLARS OF OOP","POLYMORPHISM","ENCAPSULATION","INHERITANCE","ABSTRACTION","OBJECT ORIENTED","OVERLOADING","OVERRIDING"],
  java_string:       ["STRING","STRINGBUILDER","STRINGBUFFER","IMMUTABLE","FINAL CLASS"],
  java_exception:    ["EXCEPTION","EXCEPTIONS","TRY CATCH","FINALLY BLOCK","THROWABLE","GARBAGE COLLECTION","FINALIZE","CUSTOM EXCEPTION"],
  java_collections:  ["COLLECTIONS","COLLECTION FRAMEWORK","ARRAYLIST","LINKEDLIST","HASHMAP","TREEMAP","HASH SET","ARRAYDEQUE","STREAMS API","COMPARATOR"],
  java_basic:        ["JAVA","JAVA PROGRAM","MAIN METHOD","STATIC KEYWORD","FINAL KEYWORD","CONSTRUCTOR","THREAD IN JAVA","INTERFACE","ABSTRACT CLASS","JVM","BYTECODE","METHOD OVERRIDING IN JAVA"],
  python_basics:     ["PYTHON","LIST VS TUPLE","DECORATOR","DICTIONARY","LAMBDA","NUMPY","PYTHON OOP","FILE HANDLING IN PYTHON","PYTHON LIST"],
  python_error:      ["TRACEBACK","NAMEERROR","SYNTAXERROR","INDENTATIONERROR","MODULENOTFOUND","TYPERROR","VALUEERROR IN PYTHON","PYTHON EXCEPTION"],
  pandas:            ["PANDAS","NUMPY","MATPLOTLIB","DATA SCIENCE","DATA VISUALISATION","DATA VISUALIZATION","DATAFRAME","READ_CSV"],
  dsa_binary:        ["DSA","DATA STRUCTURE","DATA STRUCTURES","BINARY SEARCH","LINEAR SEARCH","SEARCHING","ARRAY","LINKED LIST","STACK","QUEUE","TREE","GRAPH","RECURSION","HASHING"],
  sorting:           ["SORTING","BUBBLE SORT","QUICK SORT","MERGE SORT","HEAP SORT","INSERTION SORT","SELECTION SORT","STABLE SORT"],
  bigo:              ["TIME COMPLEXITY","COMPLEXITY","BIG O","SPACE COMPLEXITY","ALGORITHM COMPLEXITY","ORDER OF GROWTH"],
  centre_div:        ["CENTRE DIV","CENTER DIV","CENTRE","CENTER","VERTICALLY CENTER","HORIZONTALLY CENTER","CENTRE AN ELEMENT"],
  css_basics:        ["CSS","BOX MODEL","FLEXBOX","GRID LAYOUT","CSS SELECTOR","MEDIA QUERY","MEDIA QUERIES","RESPONSIVE","PSEUDO CLASS","Z INDEX","POSITIONING IN CSS"],
  html_semantic:     ["HTML","SEMANTIC","SEO","ACCESSIBILITY","ALT TAG","HEADING TAG","META TAG","A11Y","LANDING PAGE"],
  js_basics:         ["JAVASCRIPT","JS","DOM","EVENT LISTENER","FETCH API","PROMISE","ASYNC AWAIT","CLOSURE","ARRAY METHODS IN JS","SCOPE IN JAVASCRIPT"],
  debug:             ["DEBUG","DEBUGGING","ERROR IN MY CODE","NOT WORKING","FIX CODE","WHY IS NOT WORKING","STACK TRACE","NULLPOINTER"],
  git:               ["GIT","GITHUB","COMMIT","BRANCH","REPOSITORY","GIT PUSH","GIT PULL","MERGE CONFLICT","VERSION CONTROL","STAGING"],
  deploy:            ["DEPLOY","DEPLOYMENT","HOSTING","NETLIFY","VERCEL","GITHUB PAGES","PUBLISH WEBSITE","LIVE URL","DOMAIN"],
  resume:            ["RESUME","CV","ATS","PORTFOLIO SITE","JOB APPLICATION"],
  interview:         ["INTERVIEW","SELF INTRODUCTION","HR ROUND","VIVA","APTITUDE","TECHNICAL ROUND","PLACEMENT"],
  linkedin:          ["LINKEDIN","GITHUB PROFILE","PROFILE LINKEDIN","ABOUT ME SECTION","PORTFOLIO","PERSONAL WEBSITE","PORTFOLIO WEBSITE","PERSONAL PORTFOLIO"],
  project_idea:      ["PROJECT","PROJECT IDEA","IDEA FOR PROJECT","MINI PROJECT","FINAL YEAR PROJECT","CAPSTONE"],
  project_structure: ["PROJECT STRUCTURE","FILE STRUCTURE","FOLDER STRUCTURE","ORGANISE PROJECT","ORGANIZE PROJECT","DIRECTORY STRUCTURE"],
  ppt:               ["PPT","PRESENTATION","SLIDE","SEMINAR","SLIDES","DECK"],
  study_plan:        ["STUDY PLAN","TIMETABLE","DAILY SCHEDULE","ROUTINE","PRODUCTIVITY","HOW TO PLAN","EXAM PREPARATION","SYLLABUS PLAN"],
  assignment:        ["ASSIGNMENT","SUBMISSION","BOOK ME LIKHNE WALA","LIKHNE WALA","HANDWRITTEN ANSWER"]
};

const AIML_CATS = [

  /* ================= GREETINGS ================= */
  { id:"hello", p:["HELLO","HI","HEY","HII","HELLO THERE","HEY THERE","GOOD MORNING","GOOD AFTERNOON","GOOD EVENING","NAMASTE","NAMASTE BHAI"],
    t:`Hello <uname/>! Good to see you.

I am your AIML personal agent. I can help with:
College subjects | Java & Python | Projects | Debugging | Resume & Interviews | Git & Deploy | PPT | Study planning

Type *help* to see everything, or use the Quick Ask buttons.
You can also attach your notes and I will answer from them.` },

  { id:"howareyou", p:["HOW ARE YOU","HOW R U","HOW ARE U","KAISE HO","HOW IS IT GOING","HOW YOU DOING","HOW'S IT GOING"],
    t:`I am working fine, thanks for asking.

My brain right now: <random>
  <li>offline AIML engine — no internet needed</li>
  <li>offline AIML engine, 0 API calls</li>
  <li>running on local rules and your uploaded notes</li>
</random>

Chats so far: <get name="chatcount"/>  |  Topics you have studied: <level topic="GENERAL"/>

What shall we do today?` },

  { id:"bye", p:["BYE","GOODBYE","SEE YOU","GOOD NIGHT","BYE BYE","CYA","TA TA"],
    t:`Goodbye <uname/>. See you next time.

<due/>` },

  { id:"thanks", p:["THANK YOU","THANKS","THX","SHUKRIYA","THANK U","THANKYOU","MANY THANKS"],
    t:`<random>
  <li>Happy to help.</li>
  <li>Any time, <uname/>.</li>
  <li>Glad it helped. Next question whenever you are ready.</li>
</random>` },

  { id:"whoareyou", p:["WHO ARE YOU","WHAT ARE YOU","YOUR NAME","INTRODUCE YOURSELF","TELL ME ABOUT YOU","ABOUT YOU","WHAT IS YOUR NAME"],
    t:`I am <bot/>, a personal AIML agent built for <uname/>.

**What I am**
A rule-based chatbot. I match your question against AIML patterns, and I learn how strong you are in each topic.

**What I track**
- Which subjects you have studied
- Which ones you say you did not understand
- When they are due for revision

**What I can do**
1. Explain college subjects in exam format
2. Write and fix code
3. Plan projects, resumes, interviews, presentations
4. Search your own notes and PDFs
5. Quiz you on weak topics

Say *my progress* to see what I know about your learning.` },

  { id:"help", p:["HELP","WHAT CAN YOU DO","COMMANDS","FEATURES","MENU","OPTIONS"],
    t:`**Commands you can use**

- *my progress* — your profile, strengths and weak topics
- *revise* — topics due for revision today
- *quiz JAVA_OOP* — 5 question test on a topic
- *weak topics* — what I think you struggle with
- *set profile* — tell me your college, branch, year
- *reset progress* — clear what I know (start fresh)

**Settings**
Open *Settings* to switch between the offline AIML brain and a real AI
(Gemini or Groq, free key). The Personality box is my rule set — edit it
anyway you like.

**Shortcuts**
- say *simple* — I simplify
- say *short* — I shorten
- say *2 marks* / *7 marks* — exam length
- say *easy English* — simpler words

Upload a PDF or notes file with the paperclip and I will use your material.` },

  /* ================= IDENTITY / USER ================= */
  { id:"myname_is", p:["MY NAME IS *","I AM *","I'M *","CALL ME *","THIS IS *"],
    t:`<think> set name from star1 and topic to none</think>
<set name="name"><star/></set>
Nice to meet you, <uname/>!

I will use that name from now on. What do you want to study?` },

  { id:"whatismyname", p:["WHAT IS MY NAME","WHO AM I","MY NAME","REMEMBER MY NAME"],
    t:`Your name is <uname/>.` },

  { id:"college", p:["MY COLLEGE IS *","I STUDY IN *","I AM IN *","MY COLLEGE IS"],
    t:`<set name="college"><star/></set>
Noted — you study at <uname/>'s college: <get name="college"/>.

I will keep that in mind while explaining subjects.` },

  { id:"branch", p:["MY BRANCH IS *","I AM IN * YEAR","MY BRANCH"],
    t:`<set name="branch"><star/></set>
Branch saved: <get name="branch"/>.` },


  /* ================= MARKS FORMAT (personalised) ================= */
  { id:"marks2", p:["* 2 MARKS","* IN 2 MARKS","* FOR 2 MARKS","2 MARKS *"],
    t:`**2 marks** — keep it this short:

Definition: <star index="1"/>

Then one more line: <star index="2"/>

That is enough for a 2-mark answer.` },

  { id:"marks5", p:["* 5 MARKS","* IN 5 MARKS","* FOR 5 MARKS","5 MARKS *"],
    t:`**5 marks** — structure:

1. **Definition** — <star index="1"/>
2. **Explanation** — <star index="2"/>
3. **Example / small diagram** — <star index="3"/>

One idea per line, no long paragraphs.` },

  { id:"marks7", p:["* 7 MARKS","* IN 7 MARKS","* FOR 7 MARKS","7 MARKS *","* 10 MARKS","10 MARKS *"],
    t:`**7–10 marks** — full structure:

1. **Definition** — <star index="1"/>
2. **Main explanation** — <star index="2"/>
3. **Example or diagram** — <star index="3"/>
4. **Advantages / applications** — <star index="4"/>
5. **Closing line**

Write points as numbered lines. Always draw a small labelled diagram in technical papers — it is easy marks.` },


  { id:"exam", p:["I HAVE AN EXAM *","EXAM ON *","MY EXAM IS *","EXAM IN * DAYS"],
    t:`<set name="lastExam"><star/></set>
Exam noted: <get name="lastExam"/>

**Plan to start**
1. List every topic and mark it: *confident* / *half* / *new*
2. Fix the *new* ones first — they cost the most marks
3. Then the *half* ones — one example each
4. *Confident* ones last, just a quick recap

Want me to build a day-wise plan? Tell me the subject and how many days you have.` },

  /* ================= JAVA ================= */
  { id:"java_oop", p:["* OOP IN JAVA","OOP","OOP CONCEPT","4 PILLARS OF OOP","PILLARS OF OOP","OBJECT ORIENTED PROGRAMMING","* OBJECT ORIENTED *"],
    t:`<think>record topic JAVA_OOP</think>
**OOP in Java — the 4 pillars**

**1. Encapsulation** — wrap data + methods in a class, hide data.
<code>
class Account {
    private int balance;
    public void deposit(int amt){ balance += amt; }
}
</code>

**2. Inheritance** — one class reuses another.
Java allows single, multilevel and interface inheritance. No multiple inheritance for classes.

**3. Polymorphism**
- Compile time → overloading
<code>
void add(int a, int b){ }
void add(double a, double b){ }
</code>
- Run time → overriding (needs inheritance + <code>@Override</code>)

**4. Abstraction** — show behaviour, hide implementation.
<code>
abstract class Shape { abstract double area(); }
</code>

**Exam line:** OOP is a paradigm where data and operations are combined into objects, following encapsulation, inheritance, polymorphism and abstraction.

Did this click, or should I explain it more simply?` },

  { id:"java_string", p:["STRING IN JAVA","* STRING * IMMUTABLE","WHY STRING IS IMMUTABLE","JAVA STRING CLASS","* IMMUTABLE"],
    t:`**String in Java**

- String is a **class**, not a keyword. It lives in <code>java.lang</code>.
- It is **immutable** — once created, it never changes.
<code>
String s = "hello";
s = s + " world";   // new object; old one is untouched
</code>
- Why immutable → security, string pool caching, thread safety.

**Important methods**
<code>
length()  charAt(i)  substring(a,b)  indexOf("x")
equals("a")     // compares value
== "a"          // compares reference
toUpperCase()  trim()  split(",")  replace(a,b)
</code>

Use <code>StringBuilder</code> for repeated concatenation — it is mutable and faster.
Use <code>StringBuffer</code> when threads are involved.

**Exam line:** String is a final, immutable class; its objects are stored in the constant pool.` },

  { id:"java_exception", p:["EXCEPTION HANDLING","TRY CATCH IN JAVA","CHECKED AND UNCHECKED EXCEPTION","THROWABLE IN JAVA","FINALLY IN JAVA"],
    t:`**Exception Handling**

Hierarchy: <code>Throwable</code> → <code>Error</code> (serious) → <code>Exception</code>
<code>Exception</code> → <code>RuntimeException</code> (unchecked) + checked exceptions

<code>
try {
    int n = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println(e.getMessage());
} finally {
    System.out.println("always runs");
}
</code>

- <code>throw</code> → throws one exception object
- <code>throws</code> → in the signature, declares it may throw
- try-with-resources → closes files automatically
- Custom → <code>class MyEx extends Exception</code>

**Garbage collection:** removes unreachable objects. <code>System.gc()</code> is a request, not a command. <code>finalize()</code> is deprecated — use try-with-resources instead.` },

  { id:"java_collections", p:["COLLECTION FRAMEWORK","ARRAYLIST VS LINKEDLIST","HASHMAP IN JAVA","COLLECTIONS IN JAVA","* VS * IN JAVA LIST"],
    t:`**Collections quick map**

**List** — ordered, allows duplicates
- <code>ArrayList</code> — dynamic array. O(1) access, slow middle insert
- <code>LinkedList</code> — linked list. O(n) access, fast insert/delete

**Set** — no duplicates
- <code>HashSet</code> unordered, <code>LinkedHashSet</code> insertion order, <code>TreeSet</code> sorted

**Map** — key → value
- <code>HashMap</code> O(1) average, no order
- <code>LinkedHashMap</code> keeps order
- <code>TreeMap</code> sorted by key, O(log n)

**Queue** — <code>ArrayDeque</code> (fast, no null), <code>PriorityQueue</code> (min-heap)

**Choosing:** random access → ArrayList · many inserts → LinkedList · key lookup → HashMap · sorted → TreeMap` },

  { id:"java_basic", p:["* IN JAVA","JAVA PROGRAM","JAVA CODE","WRITE A JAVA *","JAVA PROGRAM FOR *","PRIME NUMBER IN JAVA","FACTORY METHOD IN JAVA","INTERFACE IN JAVA","ABSTRACT CLASS IN JAVA"],
    t:`Here is the Java approach for *<star index="1"/>*:

1. Identify input and output
2. Decide the data type
3. Write the logic inside <code>main</code>
4. Compile → <code>javac File.java</code>
5. Run → <code>java File</code>

Tell me the exact problem and I will write the full code with comments and the complexity.

Quick Java facts you may need:
- <code>public static void main(String[] args)</code> — entry point
- <code>javac</code> compiles to bytecode; <code>JVM</code> runs it
- Static → belongs to class, Non-static → belongs to object
- <code>final</code> = cannot change, <code>static</code> = single copy, <code>abstract</code> = no body` },

  /* ================= PYTHON ================= */
  { id:"python_basics", p:["* IN PYTHON","PYTHON BASICS","LIST VS TUPLE","PYTHON OOP","PYTHON DECORATOR","PYTHON FOR BEGINNERS","WRITE A PYTHON *"],
    t:`**Python quick answers**

**List vs Tuple**
| | List | Tuple |
|---|---|---|
| Syntax | <code>[]</code> | <code>()</code> |
| Mutable | yes | no |
| Speed | slower | faster |
| Use | changing data | fixed / hashable |

**Decorators**
<code>
def log(fn):
    def wrapper(*a, **k):
        print("calling", fn.__name__)
        return fn(*a, **k)
    return wrapper

@log
def add(a, b):
    return a + b
</code>

**OOP**
<code>
class Student:
    def __init__(self, name, marks):
        self.name = name
        self.marks = marks
    def grade(self):
        return "A" if self.marks > 80 else "B"
</code>

Magic methods: <code>__init__ __str__ __repr__ __len__ __eq__ __add__</code>

Tell me the exact problem and I will write the code with a simple explanation.` },

  { id:"python_error", p:["* ERROR IN PYTHON","PYTHON ERROR","TRACEBACK","NAMEERROR","SYNTAXERROR","ATTRIBUTEERROR","INDEXERROR","KEYERROR","* IS NOT DEFINED","PYTHON DEBUG"],
    t:`Use this order — I will not rewrite everything:

1. **Problem** — what happened vs what you expected
2. **Why** — the actual reason
3. **Fix** — smallest change that works
4. **Corrected code** — only if needed

**Common ones**
- <code>NameError</code> → typo, or the variable is defined *after* it is used
- <code>IndentationError</code> → mixed tabs and spaces
- <code>TypeError</code> → wrong type, e.g. string + int
- <code>IndexError</code> → index beyond list length
- <code>KeyError</code> → key not in dictionary
- <code>ModuleNotFoundError</code> → <code>pip install package</code>
- <code>ZeroDivisionError</code> → division by zero

Paste your code and the **exact** error line and I will give the one-line fix if that is all it needs.` },

  { id:"pandas", p:["PANDAS","DATAFRAME","NUMPY","MATPLOTLIB","READ_CSV","DATA SCIENCE IN PYTHON"],
    t:`**Data science quick sheet**

<code>
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv("data.csv")
df.head()          # first 5 rows
df.info()          # column types
df.describe()      # statistics

df["col"].mean(), .sum(), .max()
df[df["marks"] > 80]                       # filter
df[df["city"].isin(["Delhi","Mumbai"])]    # filter list
df.isnull().sum(); df.fillna(df["marks"].mean())
df.groupby("city")["marks"].mean()        # group by
</code>

**Plots:** <code>plt.plot</code> line, <code>plt.bar</code> bar, <code>plt.scatter</code>, <code>plt.hist</code>
Then <code>plt.title() plt.xlabel() plt.ylabel() plt.legend() plt.show()</code>` },

  /* ================= CS THEORY ================= */
  { id:"dsa_binary", p:["BINARY SEARCH","* BINARY SEARCH *","SEARCH IN SORTED ARRAY"],
    t:`**Binary search** — needs a **sorted** array, then halve the range every step.

<code>
int low = 0, high = arr.length - 1;
while (low &lt;= high) {
    int mid = low + (high - low) / 2;
    if (arr[mid] == key) return mid;
    if (arr[mid] &lt; key)  low  = mid + 1;
    else                    high = mid - 1;
}
return -1;
</code>

**Time O(log n) · Space O(1)**
Fails on unsorted data because it removes half based on a wrong assumption.

**Dry run for [1,3,5,7,9] key=7:** low=0 high=4 mid=2 → 5<7 low=3 → mid=3 → 7 found.` },

  { id:"sorting", p:["BUBBLE SORT","QUICK SORT","MERGE SORT","HEAP SORT","INSERTION SORT","COMPARISON SORT"],
    t:`**Sorting complexity**

| Algorithm | Best | Average | Worst | Space |
|---|---|---|---|---|
| Bubble | O(n) | O(n²) | O(n²) | O(1) |
| Insertion | O(n) | O(n²) | O(n²) | O(1) |
| Selection | O(n²) | O(n²) | O(n²) | O(1) |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) avg |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) |

**Stable** → keeps equal keys in original order: Bubble, Insertion, Merge.
**In place** → little extra memory: Heap, and Quick in average case.

**Exam tip:** always state time, space and whether it is stable.` },

  { id:"bigO", p:["* TIME COMPLEXITY","BIG O","* COMPLEXITY OF *","SPACE COMPLEXITY","ORDER OF N"],
    t:`**Big-O cheatsheet**

| Operation | Complexity |
|---|---|
| Array access (index) | O(1) |
| Array search (linear) | O(n) |
| Binary search | O(log n) |
| Array insert in middle | O(n) |
| HashMap get/put | O(1) average |
| Balanced BST ops | O(log n) |
| BFS / DFS on graph | O(V + E) |
| Bubble sort | O(n²) |
| Merge / Heap sort | O(n log n) |
| Stack push/pop | O(1) |
| Queue enqueue/dequeue | O(1) |

Space: recursion depth adds O(n). Quick sort average is O(log n).

O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)` },

  { id:"dbms", p:["DBMS","NORMALIZATION","1NF","2NF","3NF","BCNF","PRIMARY KEY","FOREIGN KEY","ACID","ER DIAGRAM","SQL JOIN"],
    t:`**DBMS quick sheet**

**Keys** — Primary (uniquely identifies), Foreign (references another table), Candidate, Super, Alternate.

**Normalization** — removes redundancy step by step
- **1NF** → atomic values, no repeating groups, one value per cell
- **2NF** → 1NF + no partial dependency (all non-key columns depend on the whole key)
- **3NF** → 2NF + no transitive dependency
- **BCNF** → stricter than 3NF, every determinant is a candidate key

**ACID** — Atomicity, Consistency, Isolation, Durability

**Joins** — INNER (matching only), LEFT (all left + matches), RIGHT, FULL OUTER, CROSS

**SQL order** → SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT` },

  { id:"os_deadlock", p:["DEADLOCK","OPERATING SYSTEM","* DEADLOCK *","PROCESS IN OS","ROUND ROBIN","PAGE REPLACEMENT"],
    t:`**OS quick sheet**

**Deadlock** — two processes wait for each other forever.

Four necessary conditions (remember all four, this is a favourite question):
1. Mutual exclusion
2. Hold and wait
3. No preemption
4. Circular wait

**Prevention** — break any one condition. **Avoidance** — Banker's algorithm. **Detection** — wait-for graph. **Recovery** — kill a process.

**Scheduling** — FCFS, SJF (shortest wait), Priority, Round Robin (time quantum), SRTF.

**Page replacement** — FIFO, LRU, Optimal (best but not practical). LRU is the most asked.

**Deadlock vs Starvation** — deadlock = everyone waits; starvation = one process keeps getting ignored.` },

  { id:"cn_osi", p:["COMPUTER NETWORK","OSI MODEL","TCP IP","IP ADDRESS","HTTP","DNS","NETWORKING"],
    t:`**Networking quick sheet**

**OSI 7 layers** (bottom → top)
1. Physical — cables, bits
2. Data Link — MAC, frames, switch
3. Network — IP, routing, packets
4. Transport — TCP/UDP, ports
5. Session — sessions, sockets
6. Presentation — encryption, compression
7. Application — HTTP, DNS, SMTP

**TCP vs UDP** — TCP is connection-based, ordered, reliable, slower (3-way handshake). UDP is connectionless, fast, no guarantee.

**IPv4** 32 bits, dotted. **IPv6** 128 bits, colon-separated.
Private ranges: 10.x, 172.16–31.x, 192.168.x

**DNS** resolves name → IP. **HTTP** 80, **HTTPS** 443, **FTP** 21, **SMTP** 25.

**Status codes** — 200 OK, 301 moved, 404 not found, 500 server error.` },

  { id:"toca", p:["THEORY OF COMPUTATION","FINITE AUTOMATA","DFA","NFA","TURING MACHINE","PUMPING LEMMA","REGULAR EXPRESSION","CONTEXT FREE GRAMMAR"],
    t:`**TOC quick sheet**

- **DFA** — deterministic, one transition per symbol. Recognises regular languages.
- **NFA** — many transitions, epsilon moves. Convertible to DFA. Also regular.
- **PDA** — has a stack. Recognises context-free languages.
- **Turing Machine** — infinite tape. Recognises recursively enumerable languages.
- **Pumping Lemma** — proof that a language is *not* regular.
- **CFG** — production rules for syntax. Examples: E → E+T | T, T → T*F | F

**Hierarchy** — Regular ⊂ Context-Free ⊂ Recursively Enumerable

**Exam tip:** know the hierarchy diagram and one difference between each machine.` },

  { id:"math_probability", p:["PROBABILITY","BAYES THEOREM","CONDITIONAL PROBABILITY","* PROBABILITY *","STATISTICS","REGRESSION","HYPOTHESIS TESTING"],
    t:`**Probability quick sheet**

- **Conditional** — <code>P(A|B) = P(A∩B) / P(B)</code>
- **Bayes** — <code>P(B|A) = P(A|B)P(B) / P(A)</code>
- **Addition** — <code>P(A∪B) = P(A)+P(B)−P(A∩B)</code>
- **Multiplication (independent)** — <code>P(A∩B) = P(A)P(B)</code>
- **Expected value** — <code>E(X) = Σ x·P(x)</code>
- **Variance** — <code>E(X²) − (E X)²</code>

**Distributions** — Binomial (n trials, 2 outcomes), Poisson (events in fixed time), Normal (mean, std dev).

**Statistics** — mean, median, mode, variance, standard deviation, z-score.

**Regression** — y = a + bx. b is slope, a is intercept. R² tells how well the line fits.

**Exam tip:** write the formula, then write where each term comes from.` },

  { id:"dm_graph", p:["DISCRETE MATHEMATICS","GRAPH THEORY","PERMUTATION","COMBINATION","RELATION AND FUNCTION","INCLUSION EXCLUSION"],
    t:`**Discrete maths quick sheet**

- **Permutation** nPr = n! / (n−r)!
- **Combination** nCr = n! / (r! (n−r)!)
- **Sum of first n naturals** = n(n+1)/2
- **Sum of squares** = n(n+1)(2n+1)/6
- **Inclusion–Exclusion** — |A∪B| = |A|+|B|−|A∩B|
- **De Morgan** — (A∪B)' = A' ∩ B'  and  (A∩B)' = A' ∪ B'
- **Relations** — reflexive (aRa), symmetric (aRb→bRa), transitive (aRb & bRc→aRc), equivalence = all three
- **Graph** — Euler path uses all **edges** once, Euler circuit returns to start; Hamiltonian visits all **vertices** once. A tree has n−1 edges and no cycles.` },

  /* ================= WEB DEV ================= */
  { id:"centre_div", p:["* CENTRE * DIV","* CENTER * DIV","CENTRE DIV","CENTER DIV","FLEXBOX CENTRE","HOW TO CENTRE *"],
    t:`**Centring a div**

**1. Flexbox — most used**
<code>
.parent {
  display: flex;
  justify-content: center;   /* horizontal */
  align-items: center;       /* vertical   */
  height: 100vh;
}
</code>

**2. Grid**
<code>
.parent { display: grid; place-items: center; min-height: 100vh; }
</code>

**3. Absolute + transform**
<code>
.child { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); }
</code>

Always add <code>box-sizing: border-box</code> globally. It removes most sizing bugs.` },

  { id:"css_basics", p:["CSS BOX MODEL","* CSS *","FLEXBOX","GRID LAYOUT","CSS SELECTOR","MEDIA QUERY","RESPONSIVE DESIGN"],
    t:`**CSS essentials**

**Box model** — content → padding → border → margin. <code>box-sizing: border-box</code> includes padding and border in the width.

**Layout**
- Flexbox → 1D, row or column
- Grid → 2D, rows and columns together
- Position: static, relative, absolute, fixed, sticky

**Responsive**
<code>
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap: 16px; }
@media (max-width: 768px) { .sidebar { display: none; } }
</code>
Units: %, rem/em for text, vh/vw for viewport, <code>clamp()</code> for fluid size.

**Specificity** — inline style (1000) beats id (100) beats class (10) beats element (1).` },

  { id:"html_semantic", p:["SEMANTIC HTML","* HTML TAG","ACCESSIBILITY","* SEO","ALT TAG","ARIA"],
    t:`**Semantic HTML** — use meaningful tags, not only <code>&lt;div&gt;</code>
<code>
&lt;header&gt;  nav / logo
&lt;nav&gt;     links
&lt;main&gt;    main content (only ONE)
&lt;article&gt; a self-contained post
&lt;section&gt; a group of content
&lt;aside&gt;   side content
&lt;footer&gt;  footer
</code>
Benefit: screen readers, SEO, smaller HTML.

**SEO** — one <code>&lt;h1&gt;</code>, then h2→h3 in order. <code>&lt;title&gt;</code> + meta description of 150–160 chars. <code>alt</code> on every image. Fast load, mobile friendly.

**Accessibility** — alt text, <code>&lt;label for&gt;</code> tied to inputs, keyboard usable, 4.5:1 contrast, <code>aria-label</code> on icon-only buttons.` },

  { id:"js_basics", p:["JAVASCRIPT","* IN JAVASCRIPT","JS BASICS","DOM MANIPULATION","EVENT LISTENER","ASYNC AWAIT","PROMISE IN JS"],
    t:`**JavaScript essentials**

<code>
let a = 10;              // let can change
const b = 20;            // const cannot
</code>

**DOM**
<code>
document.getElementById("id")
document.querySelector(".class")
el.addEventListener("click", fn)
el.innerHTML / el.textContent
</code>

**Async**
<code>
async function get(){
  try {
    const res = await fetch(url);
    const data = await res.json();
  } catch(e) { console.log(e); }
}
</code>

**Common beginner errors**
- <code>==</code> vs <code>===</code> (use ===)
- missing <code>event.preventDefault()</code> on a form
- using a function before it is declared
- wrong file or image path
- <code>getElementById</code> must match the exact id, case matters` },

  /* ================= DEBUGGING ================= */
  { id:"debug", p:["* NOT WORKING","* ERROR","DEBUG","* FAILED","SOMETHING IS WRONG","FIX MY CODE","* NOT LOADING","WHY IS MY *"],
    t:`Use this exact order — I will not rewrite your whole project:

1. **Problem** — what happens vs what you expected
2. **Why it happens** — the real reason
3. **Fix** — smallest change first
4. **Corrected code** — only the part that is broken

**Fastest way to find a JS bug**
- <code>console.log()</code> the value right before the failing line
- check the id/class spelling (case matters)
- open DevTools → Console for the red error, Network for a 404
- <code>typeof x</code> to see if a variable is undefined

Paste the code and the **exact** error message and I will fix only that part.` },

  /* ================= GIT / DEPLOY ================= */
  { id:"git", p:["GIT","GITHUB","* GIT *","HOW TO PUSH","PUSH MY CODE","* GIT PUSH *","BRANCH IN GIT","MERGE CONFLICT","COMMIT"],
    t:`**Git — exact commands**

First time
<code>
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/user/repo.git
git push -u origin main
</code>

Daily loop
<code>
git status          # what changed
git add .           # stage
git commit -m "msg" # save a version
git push            # upload
</code>

Useful
<code>
git log --oneline       # history
git pull                # get latest
git clone &lt;url&gt;        # download
git switch -c feature    # new branch
git merge feature
git restore file         # discard changes
git reset --soft HEAD~1  # undo last commit, keep files
</code>

Write messages like <code>feat: add login page</code> or <code>fix: stop page refresh</code>.

**Common errors**
- *rejected — non-fast-forward* → someone else pushed. Run <code>git pull</code> then <code>git push</code>.
- *Permission denied* → the remote URL belongs to another account. Fix with <code>git remote set-url origin &lt;your-url&gt;</code>` },

  { id:"deploy", p:["DEPLOY","DEPLOYMENT","NETLIFY","GITHUB PAGES","VERCEL","* HOW TO HOST *","PUBLISH MY WEBSITE"],
    t:`**Deploy free in about 2 minutes**

**Netlify (easiest)**
1. Push the project to GitHub
2. Netlify → Add new site → Import an existing project
3. Pick the repo
4. Set **Publish directory** to <code>.</code> (or <code>public</code> / <code>build</code>)
5. Deploy → live URL immediately

**GitHub Pages**
Settings → Pages → Deploy from a branch → choose <code>main</code>, folder <code>/ (root)</code> → done.

**Vercel** — same flow, best for React/Node.

**Fastest of all:** drag the folder to app.netlify.com/drop

Tip: a custom domain works on all three, but the free subdomain is guaranteed.` },

  /* ================= CAREER ================= */
  { id:"resume", p:["RESUME","CV","* RESUME TIP","ATS","* HOW TO MAKE RESUME","RESUME FOR *","* RESUME FOR *"],
    t:`**Resume rules — ATS friendly**

**Structure (single column, one page)**
1. Name + phone + email + LinkedIn + GitHub
2. Education — college, branch, CGPA, year
3. Projects (2–4, most relevant first)
4. Skills — grouped: Languages / Frameworks / Tools
5. Internships / Certifications
6. Achievements (only if strong)

**Project bullet formula:** Action Verb + what you built + tech + result
- Weak: "Made a website using HTML and CSS"
- Strong: "Built a responsive food-delivery UI in HTML/CSS/JS with 12 pages and cart state, deployed on Netlify"

**ATS rules** — plain text, no tables, no images, no graphics. Standard section names. Match keywords from the job description. Save as PDF, 10–12pt font.

**Never add fake experience.** Real projects with a live GitHub link are stronger than a long fake internship list.` },

  { id:"interview", p:["INTERVIEW","* INTERVIEW QUESTION","SELF INTRODUCTION","TELL ME ABOUT YOURSELF","HR QUESTION","* HR ROUND","VIVA QUESTION"],
    t:`**Self introduction — 60 seconds, memorise this shape**

"Hello, I am <uname/>, a Computer Science student at <get name="college"/>.
I mainly work with Java, Python and web development.

I am strongest at building complete projects — for example I built a URL
shortener and a food-delivery website, handling both the frontend and the
logic, and deployed them on GitHub and Netlify.

Apart from studies I solve DSA problems and maintain my GitHub to show my
work. I am looking for an internship where I can apply my Java and web
skills on real products and keep learning."

**Favourite HR questions**
- *Why should we hire you?* → "I can deliver working code and explain it clearly, which matters in team projects."
- *Where do you see yourself?* → "Growing into a full-stack or backend role with Java."
- *Weakness?* → Name a real one, then say what you are doing to fix it.
- *Questions for us?* → Always ask at least one.

**Project questions to expect** — problem, why this tech, hardest part, how you tested it, what you would improve.` },

  { id:"linkedin", p:["LINKEDIN","GITHUB PROFILE","* LINKEDIN PROFILE","HOW TO MAKE A GITHUB PROFILE"],
    t:`**LinkedIn**
- Photo: plain, clear face, light background
- Banner: one line about what you do + a link to your project
- Headline: not "Student" — write "Computer Science Student | Java, Python, Web Development"
- About section: 3 short paragraphs — who, what you build, what you want next
- Add projects with a live link and a one-line description
- Write 3–5 posts about what you built. Recruiters notice consistent posting.

**GitHub profile**
- Same name and bio as LinkedIn
- A real profile README with what you are learning
- Pin your 3 best repositories
- Commit messages in the format <code>feat:</code> <code>fix:</code> <code>docs:</code>
- Green contribution graph looks good, so commit regularly` },

  /* ================= PROJECTS ================= */
  { id:"project_idea", p:["PROJECT IDEA","* PROJECT IDEA","SUGGEST A PROJECT","* PROJECT FOR *","MINI PROJECT","FINAL YEAR PROJECT"],
    t:`**Project ideas you can build and explain in a viva**

**Web**
- Food delivery website (HTML/CSS/JS + cart state)
- URL shortener with click analytics
- Portfolio with a dark mode toggle
- Attendance / library management system

**Java**
- Student management with a database
- Banking system with OOP + exceptions
- Snake and Ladder game on Swing

**Python**
- Number guessing game with score tracking
- Expense tracker with Pandas and a chart
- Image scraper and renamer

**Data**
- Movie recommendation using Pandas
- Student result analysis with Matplotlib
- Spam detection using simple ML

For any of these I can give you the **file structure, the HTML/CSS/JS code, the README and the viva questions**.

Tell me which one and whether you want it in Java, Python or JavaScript.` },

  { id:"project_structure", p:["* PROJECT STRUCTURE","* FILE STRUCTURE","HOW TO START A PROJECT","PROJECT ORGANISATION","FOLDER STRUCTURE"],
    t:`**Clean project structure for a web project**
<code>
my-project/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── data.js
├── images/
├── README.md
</code>

**Rules that keep it clean**
1. Name files by purpose, not by number — <code>style.css</code>, not <code>style2.css</code>
2. Keep CSS in one file until it passes ~400 lines, then split by section
3. Keep all images in <code>images/</code> and use relative paths
4. Remove unused code before submitting
5. Add a README with what it is, how to run, and the tech used

Want me to create the actual files for your project? Just say the project name and the language.` },

  /* ================= PPT ================= */
  { id:"ppt", p:["PRESENTATION","* PPT","SLIDES","* SLIDE STRUCTURE","HOW TO PRESENT","* PRESENTATION FOR *","PPT FOR *"],
    t:`**Presentation structure that works**

1. **Title** — project name, your name, college
2. **Introduction** — what it is, in two lines
3. **Problem** — what difficulty exists without it
4. **Objective** — what you set out to build
5. **Technology Used** — languages, frameworks, tools
6. **Working** — one clear architecture or flow diagram
7. **Features** — four to six points, maximum
8. **Advantages** — short and factual
9. **Future Scope** — two or three realistic improvements
10. **Conclusion** — one closing line, then thank you

**Slide rules** — six lines per slide maximum, 28pt+ font, one idea per slide, never read full paragraphs. Use a diagram instead of a wall of bullets.

**Speaking order** — introduce → problem → what you built → demo → future scope. Talk slowly, explain the diagram once, finish on time.` },

  /* ================= PLANNING ================= */
  { id:"study_plan", p:["STUDY PLAN","* PLAN FOR *","TIMETABLE","* HOW TO STUDY","REVISION PLAN","* ORGANISE *","* PLAN FOR MY *"],
    t:`**Simple study system — no over-planning**

1. **One master list** — every subject, assignment, deadline in one place. Sort into *urgent this week* and *later*.
2. **Top 3 per day** — more than three never gets finished.
3. **Hardest first** — your mind is freshest early, so use it on the tough subject.
4. **Revise same day** — 10 minutes on what you just studied. This matters more than extra hours.
5. **Weekly review** — 15 minutes: what finished, what slipped, what moves.

**Best study technique** — read once → close the book → write what you remember → check. Recall beats re-reading every time.

Tell me the subject, your exam date and how many hours you can give daily, and I will build a day-wise plan.` },

  { id:"assignment", p:["* ASSIGNMENT","* ASSIGNMENT ON *","WRITE AN ASSIGNMENT","BOOK ME LIKHNE WALA","* LIKHNE WALA"],
    t:`**Assignment format (notebook style)**

- Heading: subject name, your name, roll number, date
- Then the answer in numbered points
- One line per point, in your own words
- Add a small diagram if the topic allows
- End with a conclusion line

**Rules for good marks**
- Never copy-paste from the internet — copy the words and it is detected
- Keep it simple English, short paragraphs
- Use diagrams and tables, they give easy marks
- 1.5 to 2 pages is usually enough for a 5-mark answer

Tell me the subject and question and I will write it in notebook style, in easy English.` },

  /* ================= LEARNING SYSTEM ================= */
  { id:"progress", p:["MY PROGRESS","* MY PROGRESS","WHAT DO YOU KNOW ABOUT ME","LEARNING PROGRESS","* PROGRESS"],
    t:`**Your learning profile**
- Name: <uname/>
- College: <get name="college"/>
- Branch: <get name="branch"/>

<due/>` },

  { id:"weak", p:["WEAK TOPICS","* WEAK TOPICS","* I AM WEAK IN","I AM CONFUSED IN *","* CONFUSED IN *","I DID NOT UNDERSTAND *"],
    t:`<learnlast level="0"/>
Noted — I will keep <lower><star index="1"/></lower> simple for you.

<random>
  <li>Here is the same thing in very simple words.</li>
  <li>Let me explain it from scratch, no jargon.</li>
  <li>Short version first, then details.</li>
</random>

Tell me the exact part you did not get, and I will explain only that part again with a smaller example.` },

  { id:"gotit", p:["I GOT IT","I UNDERSTAND","GOT IT","UNDERSTOOD","* GOT IT","THAT HELPS","* HELPS","I KNOW THIS","NICE EXPLANATION"],
    t:`<learnlast level="3"/>
That is marked as understood.

Next time I will skip the basics for this and give you exam questions and edge cases instead.

<due/>` },

  { id:"notgotit", p:["I DID NOT GET IT","DID NOT UNDERSTAND","STILL CONFUSED","I AM CONFUSED","* DID NOT GET IT","* NOT CLEAR","MORE EXAMPLES","* EXPLAIN AGAIN","* AGAIN"],
    t:`<learnlast level="0"/>
Marked as a weak topic — I will bring it back in revision.

**Let me try a different way**
1. One line definition
2. A tiny real example
3. Then one line on why it matters

Tell me which part still feels unclear — the definition, the example, or the reason — and I will only redo that part.` },

  { id:"quiz", p:["QUIZ ME","* QUIZ *","TEST ME","* QUIZ ME ON *","ASK ME QUESTIONS","REVISE ME"],
    t:`Let us do a quick check. I will ask one question at a time and give you a hint if you need it.

Say *quiz* again for a different subject, or *my progress* to see your topics.` },

  { id:"revise", p:["REVISE","* REVISE","REVISION","* REVISION","WHAT SHOULD I REVISE","* DUE"],
    t:`**Revision queue**

<due/>` },

  { id:"reset", p:["RESET PROGRESS","* RESET MY PROGRESS","FORGET EVERYTHING","* FORGET *","START FRESH"],
    t:`<think> reset everything</think>
Cleared. I no longer track your topics.

We start fresh — tell me what you want to study and I will track it again from today.` },

  { id:"setprofile", p:["SET PROFILE","* SET PROFILE","UPDATE MY PROFILE","EDIT PROFILE"],
    t:`Give me your details one at a time, like this:

- my name is Akshat
- my college is ...
- my branch is CSE
- I am in 3rd year

Or just say it in one line and I will save it.` },

  /* ================= UTILS ================= */
  { id:"time", p:["WHAT IS THE TIME","* TIME NOW","CURRENT TIME","* TIME","WHAT TIME IS IT"],
    t:`<sysdate/>` },

  { id:"date", p:["WHAT IS THE DATE","TODAY DATE","WHAT IS TODAY","* DATE"],
    t:`<sysdate/>` },

  { id:"who", p:["WHO","WHAT IS THIS","WHAT IS THAT"],
    t:`Tell me more, or type *help* to see what I can do.` },

  { id:"how", p:["HOW"],
    t:`How what, exactly? Give me the full question and I will answer step by step.` }
];
