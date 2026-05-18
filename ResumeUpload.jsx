// src/components/ResumeUpload.jsx

export default function ResumeUpload({ onFile }) {
  return (
    <div
      className="card"
      style={{ textAlign: "center", cursor: "pointer" }}
      onClick={() => document.getElementById("fileInput").click()}
    >
      <p>Click to upload resume</p>
      <input
        id="fileInput"
        type="file"
        accept=".pdf"
        style={{ display: "none" }}
        onChange={(e) => onFile(e.target.files[0])}
      />
    </div>
  );
}