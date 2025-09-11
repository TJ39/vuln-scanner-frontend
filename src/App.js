import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // import custom styles

function App() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scanId, setScanId] = useState(null); // NEW state for scan_id

  const handleScan = async () => {
    if (!url) return alert("Enter a website URL!");
    setLoading(true);
    setScanned(false);
    setResults([]);
    setScanId(null); // Reset scanId before new scan
    try {
      const res = await axios.post("https://vulnscanner.onrender.com/scan", { url });
      setResults(res.data.results || []);
      setScanId(res.data.scan_id); // Store scan_id
      setScanned(true);
    } catch (err) {
      alert("Error scanning site");
      setResults([]);
      setScanned(true);
    }
    setLoading(false);
  };

  const handleDownloadReport = async () => {
    if (!scanId) return; // Safety check
    try {
       const res = await axios.get(
  `https://vulnscanner.onrender.com/report/${scanId}`,
  { responseType: "blob" }
);

      const fileUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", `report_${scanId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up
    } catch (err) {
      alert("Error generating report");
    }
  };

  // Determine highest severity for potential UI theming (optional extension)
  const getHighestSeverity = () => {
    if (results.length === 0) return "safe";
    const severities = results.map(r => r.severity.toLowerCase());
    if (severities.includes("high")) return "high";
    if (severities.includes("medium")) return "medium";
    if (severities.includes("low")) return "low";
    return "info";
  };

  const theme = getHighestSeverity();

  return (
    <div className={`app-container ${theme}`}>
      <div className="scanner-box">
        <h1 className="title">Web Vulnerability Scanner</h1>
        <p className="subtitle">
          Test your websites for SQL Injection, XSS, and missing security
          headers before attackers exploit them.
        </p>

        {/* Scan Form */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-url"
          />
          <button onClick={handleScan} className="scan-btn" disabled={loading}>
            {loading ? "Scanning..." : "Scan Now"}
          </button>
        </div>

        {/* Download Report Button - Always show after URL entry, but disable appropriately */}
        {url && (
          <button
            onClick={handleDownloadReport}
            className="download-btn"
            disabled={!scanId || loading}
          >
            Download Report 📄
          </button>
        )}

        {/* Scan Results */}
        {scanned && !loading && (
          results.length > 0 ? (
            <div className="results-box">
              <h2>Scan Results:</h2>
              <ul>
                {results.map((r, i) => (
                  <li key={i}>
                    <span
                      className={`severity ${
                        r.severity ? r.severity.toLowerCase() : "unknown"
                      }`}
                    >
                      {r.severity || "Unknown"}
                    </span>{" "}
                    {r.type === "Headers" && (
                      <>
                        <strong>Missing Security Headers:</strong>{" "}
                        {(r.missing && r.missing.join(", ")) || "None"}
                      </>
                    )}
                    {r.type === "SQLi" && (
                      <span className="text-red-500">
                        ⚠️ SQL Injection risk detected on{" "}
                        {r.endpoint || "unknown endpoint"}
                      </span>
                    )}
                    {r.type === "XSS" && (
                      <span className="text-orange-400">
                        ⚠️ XSS vulnerability found on{" "}
                        {r.endpoint || "unknown endpoint"}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No vulnerabilities found ✅</p>
          )
        )}
      </div>
    </div>
  );
}

export default App;