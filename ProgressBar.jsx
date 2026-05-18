// src/components/ProgressBar.jsx

export default function ProgressBar({ progress }) {
  return (
    <div className="progress-bar-wrap">
      <div
        className="progress-bar-fill"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}