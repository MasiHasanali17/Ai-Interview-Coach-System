// src/components/ScoreReport.jsx

export default function ScoreReport({ score }) {
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <h2>Final Score</h2>
      <div style={{ fontSize: "3rem", fontWeight: 800 }}>
        {score}/10
      </div>
    </div>
  );
}