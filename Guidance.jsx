import { useState } from "react";

// ── Tab data ───────────────────────────────────────────
const TABS = [
  { id: "technical",  label: "Technical Round",  icon: "💻" },
  { id: "hr",         label: "HR Round",          icon: "🤝" },
  { id: "gd",         label: "Group Discussion",  icon: "👥" },
  { id: "coding",     label: "Coding Round",      icon: "⌨️" },
];

// ── Technical Round Content ────────────────────────────
const TECHNICAL_TIPS = [
  {
    title: "Master the Fundamentals First",
    content: `Before anything else, make sure your core concepts are solid. Recruiters at every company — from TCS to Google — test fundamentals before anything else.

For Data Science / ML roles: Statistics, Probability, Linear Algebra, Python, Pandas, Scikit-learn, ML algorithms (know when to use what), overfitting, bias-variance tradeoff.

For Software Engineering: OOP concepts, SOLID principles, Data Structures (Arrays, Linked Lists, Trees, Graphs, Hash Maps), Algorithms (sorting, searching, dynamic programming).

For Web Dev / Full Stack: HTML/CSS/JS deeply, React/Node fundamentals, REST APIs, databases (SQL vs NoSQL), HTTP protocol, authentication.

Rule: If you can explain it to a 10-year-old, you know it well enough for an interview.`,
  },
  {
    title: "How to Answer Technical Questions",
    content: `Most candidates jump straight to the answer. This is wrong. Use the Think-Out-Loud method:

Step 1 → Repeat the question: "So you're asking about overfitting — let me explain..."
Step 2 → Define it clearly: Give a textbook-clean definition first.
Step 3 → Give an analogy: "It's like a student who memorises answers without understanding..."
Step 4 → Give a real example: "In my NIFTY prediction project, my model had 99% train accuracy but 60% test accuracy..."
Step 5 → Mention how to solve it: "I used cross-validation and L2 regularization to fix it."

This structure shows depth. Most candidates stop at Step 2.`,
  },
  {
    title: "The Most Common Technical Questions (By Role)",
    content: `DATA SCIENCE / ML:
- What is the difference between supervised and unsupervised learning?
- Explain bias-variance tradeoff with an example.
- When would you use Random Forest over Logistic Regression?
- What is gradient descent? Explain intuitively.
- How do you handle missing data and class imbalance?
- What is cross-validation and why is it important?

SOFTWARE ENGINEERING:
- Explain OOP concepts with real examples.
- What is time complexity? Explain Big O notation.
- Difference between stack and heap memory.
- What is a deadlock? How do you prevent it?
- Explain REST API principles.

WEB DEVELOPMENT:
- What is the difference between == and === in JavaScript?
- Explain event loop in Node.js.
- What is the virtual DOM in React?
- Difference between SQL and NoSQL databases.`,
  },
  {
    title: "System Design Questions (For Mid-Level)",
    content: `If you are applying for junior or mid-level roles, you may face light system design questions. Here is how to approach them:

Framework to answer any system design question:
1. Clarify requirements — "Is this read-heavy or write-heavy? How many users?"
2. Estimate scale — "1 million users, 100k requests per day"
3. Define components — Frontend, Backend API, Database, Cache
4. Choose tech stack — "I'd use PostgreSQL for structured data, Redis for caching"
5. Discuss trade-offs — "SQL gives ACID compliance but NoSQL scales better horizontally"

Common system design questions for freshers:
- Design a URL shortener (like bit.ly)
- Design a notification system
- Design a basic chat application`,
  },
  {
    title: "What to Do When You Don't Know the Answer",
    content: `This happens in every interview. The worst thing you can do is go silent or say "I don't know" and stop.

What to do instead:

Option 1 — Reason it out loud:
"I haven't worked with this specific technology, but based on what I know about distributed systems, I would think it works by..."

Option 2 — Connect to something you know:
"I haven't used Kafka specifically, but I've worked with message queues in Python using Celery. I imagine Kafka solves similar problems at a much larger scale..."

Option 3 — Be honest but show curiosity:
"I'm not confident about this one. Could you give me a hint? I'd like to reason through it."

Never bluff. Interviewers know when you're faking it. Honest reasoning is always better than a wrong confident answer.`,
  },
];

// ── HR Round Content ───────────────────────────────────
const HR_TIPS = [
  {
    title: "Tell Me About Yourself — The Perfect Answer",
    content: `This is asked in 100% of interviews. Most candidates ramble. Here is the exact formula:

Structure (60-90 seconds):
1. Who you are: "I'm a final year B.Tech CSE student from [college], specializing in Data Science."
2. What you've built: "Over the past 2 years, I've built 3 ML projects including a stock prediction model and a healthcare diagnosis system."
3. What you're good at: "I'm strongest in Python, machine learning, and SQL."
4. Why you're here: "I'm targeting Data Analyst roles where I can use my skills to drive business decisions. Your company's focus on AI-driven analytics excites me."

What NOT to say:
× "I was born in..."
× "My hobbies are..."
× "I am a hardworking person..."
× Reading your resume out loud`,
  },
  {
    title: "The STAR Method for Behavioral Questions",
    content: `HR questions like "Tell me about a challenge you faced" need the STAR method.

S — Situation: Set the context briefly. (2-3 sentences)
"During my final year project, our team had 2 weeks to build a complete ML pipeline for healthcare diagnosis."

T — Task: What was your specific responsibility?
"I was responsible for the model training and evaluation pipeline."

A — Action: What did YOU do? (This is the most important part)
"I first explored 5 different algorithms, then selected XGBoost based on performance. I also implemented cross-validation to prevent overfitting and used SMOTE to handle class imbalance."

R — Result: What was the outcome? Use numbers.
"The final model achieved 91% accuracy and our project received the best project award in our department."

Practice STAR answers for these questions:
- Tell me about a challenge you overcame
- Describe a time you worked in a team
- Tell me about a failure and what you learned
- Describe a time you showed leadership`,
  },
  {
    title: "Salary Negotiation for Freshers",
    content: `Most freshers are scared to negotiate. Here's what you need to know:

Before the interview:
- Research the market range for your role and city (use Glassdoor, AmbitionBox, LinkedIn Salary)
- Know your minimum acceptable salary
- Know the company's typical fresher CTC

When asked "What are your salary expectations?":
Option 1 (Safe): "I'm flexible and open to your standard fresher compensation. Based on my research, I understand it's in the range of X to Y. Is that the ballpark?"

Option 2 (Confident): "Based on my skills in [specific area] and the market rate, I'm looking for around X LPA. Is that achievable?"

Never say:
× "I'll take whatever you offer"
× An extremely high number without justification
× "I need at least X or I won't join"

Remember: For most fresher roles, the package is fixed. Save negotiation energy for your first salary revision after joining.`,
  },
  {
    title: "Questions to Ask the Interviewer",
    content: `At the end of every interview, they ask "Do you have any questions?" Saying "No" is a mistake. It shows low interest.

Ask these questions:

About the role:
- "What does a typical day look like for someone in this role?"
- "What skills are most important to succeed in this team?"
- "What projects would I be working on in the first 3 months?"

About growth:
- "What learning and development opportunities does the company offer?"
- "How does the performance review process work?"

About the team:
- "How is the team structured? How many people would I be working with?"
- "What's the collaboration style — more independent or team-based work?"

Do NOT ask:
× "When will I get a promotion?"
× "How many leaves do I get?"
× "Is the salary negotiable?" (at this stage)`,
  },
  {
    title: "Body Language and Presentation",
    content: `In face-to-face and video interviews, your body language speaks before you do.

DO:
✓ Firm handshake (not crushing, not limp)
✓ Eye contact — look at the camera in video calls, not the screen
✓ Sit straight, slightly leaning forward (shows engagement)
✓ Smile genuinely when greeting
✓ Nod occasionally to show you're listening
✓ Take a 2-second pause before answering (shows you think)

DON'T:
✗ Cross your arms (defensive body language)
✗ Look down while answering
✗ Fidget with pen, ring, hair
✗ Check your phone
✗ Interrupt the interviewer
✗ Speak too fast when nervous — slow down deliberately

For Video Interviews:
- Camera at eye level (not below — bad angle)
- Good lighting on your face (not backlit)
- Clean background
- Earphones for clear audio
- Close all other apps — notifications are unprofessional`,
  },
];

// ── Group Discussion Content ───────────────────────────
const GD_TIPS = [
  {
    title: "What Evaluators Look For in GD",
    content: `Group Discussions are not about who talks the most. Evaluators watch for:

1. Communication Clarity — Can you express ideas clearly and concisely?
2. Listening Skills — Do you acknowledge others' points before countering?
3. Leadership — Can you bring structure to a chaotic discussion?
4. Knowledge — Do you have relevant facts and examples?
5. Confidence — Not aggression. Calm, assertive communication.
6. Team Player — Do you let others speak? Do you summarise the group's ideas?

The biggest mistake: Talking too much and listening too little.
The second biggest mistake: Not speaking at all.

Aim to speak 3-4 times during the discussion. Quality over quantity.`,
  },
  {
    title: "How to Start the GD (First Mover Advantage)",
    content: `Speaking first gives you visibility. But only if you start well.

How to start:
"The topic today is [X]. I'd like to begin by defining the scope — [definition]. From my perspective, [your strong opening point with a fact or statistic]."

Example for topic "AI will replace human jobs":
"AI replacing human jobs is one of the most debated topics of our decade. According to a McKinsey report, AI could automate 30% of tasks in 60% of jobs by 2030. However, history shows that technology creates more jobs than it eliminates — the industrial revolution is proof. I believe AI will transform jobs rather than eliminate them. Let me explain..."

If you don't start first — don't panic. Listen carefully to the first 2 speakers and enter with a connecting point: "Building on what [name] said about X, I'd like to add..."`,
  },
  {
    title: "Handling Aggressive Participants",
    content: `In every GD, there's someone who speaks loudly and interrupts others. Do not match their energy.

Strategy 1 — The Calm Counter:
Let them finish, then say: "That's an interesting point. However, the data suggests a different perspective..."

Strategy 2 — The Bridge:
"I hear your point about X. If we also consider Y, we get a more complete picture..."

Strategy 3 — Bring others in (shows leadership):
"We've heard strong views on one side. I'd like to hear what others think before we conclude."

Never:
× Raise your voice
× Say "You're wrong"
× Have a side conversation
× Interrupt aggressively

The evaluator is watching how you handle pressure — stay composed.`,
  },
  {
    title: "How to Summarise the GD",
    content: `If asked to summarise — or if you see the GD ending — this is your chance to shine.

A good summary:
1. Covers all major points raised (both sides)
2. Does NOT introduce new points
3. Is neutral — represents the group, not just your opinion
4. Ends with a clear conclusion or recommendation
5. Is under 60 seconds

Template:
"To summarise our discussion on [topic] — the group raised points in favour including [3 points]. On the other side, concerns were raised about [2-3 concerns]. On balance, the consensus seems to be [conclusion], while acknowledging that [counterpoint needs attention]. Thank you."

The person who summarises well is almost always remembered positively.`,
  },
];

// ── Coding Round Content ───────────────────────────────
const CODING_TIPS = [
  {
    title: "How to Approach a Coding Problem",
    content: `Most candidates start coding immediately. This is wrong. Use this 5-step approach:

Step 1 — Understand (2 minutes):
Read the problem twice. Ask clarifying questions.
"Can the input array be empty? Can values be negative? What's the expected output if there are duplicates?"

Step 2 — Think of examples (1 minute):
Write 2-3 test cases including edge cases on paper/whiteboard.

Step 3 — Plan your approach (2 minutes):
"I'll use a hash map for O(n) lookup. My approach is..."
State time and space complexity before coding.

Step 4 — Code (10-15 minutes):
Write clean, readable code. Use meaningful variable names.
Talk while coding: "Here I'm initialising the hash map... now I'm iterating through the array..."

Step 5 — Test and optimise (3 minutes):
Run your test cases. Check edge cases. Mention if there's a better approach.`,
  },
  {
    title: "Must-Know Data Structures",
    content: `These data structures appear in 80% of coding interviews. Know them deeply:

ARRAYS & STRINGS:
- Two pointer technique
- Sliding window
- Prefix sums
- String manipulation

LINKED LISTS:
- Reverse a linked list
- Detect cycle (Floyd's algorithm)
- Merge two sorted lists
- Find middle element

TREES:
- BFS and DFS traversals
- Height and diameter
- Lowest common ancestor
- Binary search tree operations

HASH MAPS:
- Frequency counting
- Two sum pattern
- Anagram detection
- Caching / memoization

STACKS & QUEUES:
- Valid parentheses
- Next greater element
- Level order traversal
- Monotonic stack patterns`,
  },
  {
    title: "Time and Space Complexity — Quick Reference",
    content: `Every answer should mention complexity. Interviewers expect it.

O(1)   — Constant  — Hash map lookup, array index access
O(log n) — Log     — Binary search, balanced BST operations
O(n)   — Linear   — Single loop through array
O(n log n) — Linearithmic — Merge sort, heap sort
O(n²)  — Quadratic — Nested loops (bubble sort, brute force)
O(2ⁿ)  — Exponential — Recursive solutions without memoization

How to analyse quickly:
- One loop = O(n)
- Nested loop = O(n²)
- Dividing input in half each step = O(log n)
- Recursion = draw the recursion tree

Space complexity:
- No extra space used = O(1)
- Hash map or array of size n = O(n)
- Recursion depth = O(height of recursion tree)

Always mention: "This solution is O(n) time and O(1) space. We could also..."`,
  },
  {
    title: "Top Platforms to Practice",
    content: `Structured practice plan for placement coding rounds:

BEGINNER (Start here):
- HackerRank — Complete the "Problem Solving" track
- CodeChef — Beginner and easy problems
- GeeksForGeeks — Topic-wise practice (arrays, strings, etc.)

INTERMEDIATE:
- LeetCode — Focus on Easy and Medium problems
  → Start with: Two Sum, Valid Parentheses, Reverse Linked List, Binary Search
- InterviewBit — Structured course with company-specific problems

ADVANCED:
- LeetCode Hard — For FAANG targets
- Codeforces — Competitive programming

COMPANY-SPECIFIC:
- TCS NQT — Practice on PrepInsta
- Infosys — HackerEarth, CoCubes pattern
- Wipro — Aptitude + coding on AMCAT pattern
- Amazon — LeetCode + system design
- Google — LeetCode Hard + competitive programming

Daily Practice Target:
Freshers: 1-2 problems per day consistently for 3 months
= 90-180 solved problems = strong placement performance`,
  },
  {
    title: "Writing Clean Code in Interviews",
    content: `Clean code signals professional thinking. Here's what clean interview code looks like:

1. Meaningful variable names:
BAD:  for i in range(len(a)):
GOOD: for index in range(len(array)):

2. Add brief comments for complex logic:
# Using two pointers to find pair with target sum

3. Handle edge cases explicitly:
if not array or len(array) == 0:
    return []

4. Consistent indentation (especially Python)

5. Use built-in functions appropriately:
Python: sorted(), enumerate(), zip(), collections.Counter()

6. Don't over-engineer:
Write the working solution first. Then optimise.
"This brute force works in O(n²). Let me now optimise to O(n) using a hash map..."

Interviewers at top companies evaluate:
- Does the code work? (correctness)
- Is it efficient? (complexity)
- Is it readable? (code quality)
- Can they extend it? (maintainability)`,
  },
];

// ── Pre Interview Checklist ────────────────────────────
const PRE_INTERVIEW_CHECKLIST = [
  "Research the company — product, recent news, tech stack",
  "Re-read your own resume — know every line of it",
  "Prepare 3 stories using STAR method",
  "Practice 'Tell me about yourself' out loud 5 times",
  "Know your projects deeply — every technical decision",
  "Charge your laptop and test audio/video (for online)",
  "Keep resume printout ready (for offline)",
  "Wear professional clothes the night before",
  "Sleep 7-8 hours before interview day",
  "Reach venue 15 minutes early (or log in 5 min early)",
  "Carry a notebook and pen",
  "Have a glass of water nearby",
];

export default function Guidance({ navigate }) {
  const [activeTab,    setActiveTab]    = useState("technical");
  const [openAccordion,setOpenAccordion]= useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  const tips =
    activeTab === "technical" ? TECHNICAL_TIPS :
    activeTab === "hr"        ? HR_TIPS        :
    activeTab === "gd"        ? GD_TIPS        : CODING_TIPS;

  function toggleAccordion(index) {
    setOpenAccordion(openAccordion === index ? null : index);
  }

  function toggleCheck(id) {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="guidance-page">

      {/* ── Page Header ───────────────────────────── */}
      <div style={{ marginBottom: "36px" }}>
        <div className="interview-page-title">Interview Guidance</div>
        <div className="interview-page-sub">
          Everything you need to walk into any interview with confidence
        </div>
      </div>

      {/* ── Hero Banner ───────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "var(--radius-xl)",
          padding: "36px 40px",
          color: "white",
          marginBottom: "36px",
          display: "flex",
          alignItems: "center",
          gap: "28px",
          flexWrap: "wrap",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", right: "24px", top: "50%",
            transform: "translateY(-50%)",
            fontSize: "120px", opacity: 0.08, pointerEvents: "none",
          }}
        >
          💡
        </div>
        <div style={{ fontSize: "52px" }}>🎯</div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              fontWeight: 800,
              marginBottom: "8px",
            }}
          >
            Preparation is the Only Shortcut
          </div>
          <div
            style={{
              opacity: 0.85,
              fontSize: "14px",
              lineHeight: 1.7,
              maxWidth: "560px",
            }}
          >
            The difference between a candidate who gets selected and one who
            doesn't is rarely intelligence — it's preparation. Read every
            section below and practise out loud. Then take the mock interview.
          </div>
        </div>
        <button
          style={{
            marginLeft: "auto",
            background: "rgba(255,255,255,0.2)",
            border: "1.5px solid rgba(255,255,255,0.4)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "var(--radius-full)",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "var(--transition)",
            whiteSpace: "nowrap",
          }}
          onClick={() => navigate("interview")}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}
        >
          Start Mock Interview →
        </button>
      </div>

      {/* ── Tabs ──────────────────────────────────── */}
      <div className="tabs-wrap" style={{ marginBottom: "32px" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => { setActiveTab(tab.id); setOpenAccordion(null); }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Description ───────────────────────── */}
      <div
        style={{
          background: "var(--primary-light)",
          border: "1px solid rgba(108,99,255,0.2)",
          borderRadius: "var(--radius)",
          padding: "14px 20px",
          marginBottom: "24px",
          fontSize: "14px",
          color: "var(--primary)",
          fontWeight: 500,
        }}
      >
        {activeTab === "technical" && "💻 Master the technical interview — from concept questions to system design."}
        {activeTab === "hr"        && "🤝 Nail the HR round — Tell me about yourself, salary negotiation, and more."}
        {activeTab === "gd"        && "👥 Stand out in Group Discussions — strategy, structure, and leadership."}
        {activeTab === "coding"    && "⌨️ Crack the coding round — approach, DSA, complexity, and clean code."}
      </div>

      {/* ── Accordion Tips ────────────────────────── */}
      <div style={{ marginBottom: "48px" }}>
        {tips.map((tip, i) => (
          <div key={i} className="accordion-item">
            <button
              className={`accordion-header ${openAccordion === i ? "open" : ""}`}
              onClick={() => toggleAccordion(i)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    width: "28px", height: "28px",
                    background: openAccordion === i
                      ? "var(--primary-light)" : "var(--surface2)",
                    color: openAccordion === i
                      ? "var(--primary)" : "var(--muted)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 800,
                    flexShrink: 0,
                    transition: "var(--transition)",
                  }}
                >
                  {i + 1}
                </span>
                {tip.title}
              </div>
              <span className="accordion-icon">▼</span>
            </button>
            <div className={`accordion-body ${openAccordion === i ? "open" : ""}`}>
              <div
                style={{
                  whiteSpace: "pre-line",
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.9,
                }}
              >
                {tip.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Do's and Don'ts ───────────────────────── */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "32px",
          boxShadow: "var(--shadow-card)",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: "20px",
          }}
        >
          ⚡ Quick Do's and Don'ts for{" "}
          {activeTab === "technical" ? "Technical" :
           activeTab === "hr"        ? "HR"        :
           activeTab === "gd"        ? "GD"        : "Coding"}{" "}
          Round
        </div>

        <div className="do-dont-grid">
          <div className="do-card">
            <div className="do-card-title">✅ Do's</div>
            {activeTab === "technical" && [
              "Think out loud while solving problems",
              "Define the concept before explaining",
              "Use real project examples to answer",
              "Ask for clarification if question is unclear",
              "Mention time and space complexity",
              "Show enthusiasm about the technology",
            ].map((d, i) => (
              <div key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", padding: "5px 0", display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--success)", flexShrink: 0 }}>✓</span> {d}
              </div>
            ))}
            {activeTab === "hr" && [
              "Prepare and practise answers out loud",
              "Use STAR method for behavioral questions",
              "Ask thoughtful questions at the end",
              "Research the company before interview",
              "Be honest about what you don't know",
              "Send a thank you email after interview",
            ].map((d, i) => (
              <div key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", padding: "5px 0", display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--success)", flexShrink: 0 }}>✓</span> {d}
              </div>
            ))}
            {activeTab === "gd" && [
              "Listen actively before speaking",
              "Support points with facts and data",
              "Acknowledge others' views before countering",
              "Keep calm if interrupted",
              "Volunteer to summarise at the end",
              "Maintain eye contact with all participants",
            ].map((d, i) => (
              <div key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", padding: "5px 0", display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--success)", flexShrink: 0 }}>✓</span> {d}
              </div>
            ))}
            {activeTab === "coding" && [
              "Clarify the problem before coding",
              "State your approach before writing code",
              "Write clean readable code",
              "Test with edge cases after coding",
              "Mention time and space complexity",
              "Talk while you code",
            ].map((d, i) => (
              <div key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", padding: "5px 0", display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--success)", flexShrink: 0 }}>✓</span> {d}
              </div>
            ))}
          </div>

          <div className="dont-card">
            <div className="dont-card-title">❌ Don'ts</div>
            {activeTab === "technical" && [
              "Don't say 'I don't know' and go silent",
              "Don't memorise answers — understand them",
              "Don't lie about skills on your resume",
              "Don't rush through explanations",
              "Don't forget to mention trade-offs",
              "Don't use jargon you can't explain",
            ].map((d, i) => (
              <div key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", padding: "5px 0", display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--danger)", flexShrink: 0 }}>✗</span> {d}
              </div>
            ))}
            {activeTab === "hr" && [
              "Don't badmouth previous employers",
              "Don't say your weakness is 'I work too hard'",
              "Don't ask about salary in round 1",
              "Don't check your phone during interview",
              "Don't interrupt the interviewer",
              "Don't give vague answers without examples",
            ].map((d, i) => (
              <div key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", padding: "5px 0", display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--danger)", flexShrink: 0 }}>✗</span> {d}
              </div>
            ))}
            {activeTab === "gd" && [
              "Don't dominate — let others speak",
              "Don't go off-topic",
              "Don't use aggressive language",
              "Don't stay silent the whole time",
              "Don't interrupt others mid-sentence",
              "Don't form groups or side conversations",
            ].map((d, i) => (
              <div key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", padding: "5px 0", display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--danger)", flexShrink: 0 }}>✗</span> {d}
              </div>
            ))}
            {activeTab === "coding" && [
              "Don't start coding without understanding",
              "Don't write unreadable code",
              "Don't forget edge cases",
              "Don't give up if you're stuck — think aloud",
              "Don't ignore the interviewer's hints",
              "Don't submit without testing",
            ].map((d, i) => (
              <div key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", padding: "5px 0", display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--danger)", flexShrink: 0 }}>✗</span> {d}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pre Interview Checklist ───────────────── */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "32px",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--text)",
            }}
          >
            📋 Pre-Interview Day Checklist
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "16px",
              fontWeight: 800,
              color: checkedCount === PRE_INTERVIEW_CHECKLIST.length
                ? "var(--success)" : "var(--primary)",
            }}
          >
            {checkedCount}/{PRE_INTERVIEW_CHECKLIST.length}
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{
                width: `${(checkedCount / PRE_INTERVIEW_CHECKLIST.length) * 100}%`,
                background: checkedCount === PRE_INTERVIEW_CHECKLIST.length
                  ? "var(--success)" : "var(--grad-primary)",
              }}
            />
          </div>
        </div>

        {checkedCount === PRE_INTERVIEW_CHECKLIST.length && (
          <div
            style={{
              background: "var(--success-light)",
              border: "1px solid rgba(39,174,96,0.2)",
              borderRadius: "var(--radius)",
              padding: "12px 16px",
              marginBottom: "16px",
              color: "var(--success)",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            🎉 You're fully prepared! Go crush that interview!
          </div>
        )}

        {PRE_INTERVIEW_CHECKLIST.map((item, i) => (
          <div
            key={i}
            className="checklist-item"
            style={{ cursor: "pointer" }}
            onClick={() => toggleCheck(i)}
          >
            <div
              style={{
                width: "22px", height: "22px",
                borderRadius: "6px",
                border: checkedItems[i]
                  ? "2px solid var(--success)"
                  : "2px solid var(--border-dark)",
                background: checkedItems[i] ? "var(--success)" : "var(--surface)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "var(--transition)",
                fontSize: "13px",
                color: "white",
              }}
            >
              {checkedItems[i] && "✓"}
            </div>
            <span
              style={{
                textDecoration: checkedItems[i] ? "line-through" : "none",
                color: checkedItems[i] ? "var(--muted)" : "var(--text-secondary)",
                fontSize: "14px",
                transition: "var(--transition)",
              }}
            >
              {item}
            </span>
          </div>
        ))}

        <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            className="btn-secondary"
            onClick={() => setCheckedItems({})}
          >
            Reset Checklist
          </button>
          <button
            className="btn-primary"
            style={{ width: "auto", padding: "12px 28px" }}
            onClick={() => navigate("interview")}
          >
            Start Mock Interview →
          </button>
        </div>
      </div>
    </div>
  );
}