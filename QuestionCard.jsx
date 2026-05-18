// src/components/QuestionCard.jsx

export default function QuestionCard({ question, answer, setAnswer }) {
  return (
    <div className="card">
      <h3 style={{ marginBottom: "1rem" }}>{question.text}</h3>

      {question.type === "mcq" ? (
        question.options.map((opt, i) => (
          <button key={i} className="btn btn-outline" style={{ marginBottom: "0.5rem" }}>
            {opt}
          </button>
        ))
      ) : (
        <textarea
          className="input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your answer..."
        />
      )}
    </div>
  );
}