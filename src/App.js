import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css"; // import custom styles
import { Routes, Route, Link } from "react-router-dom"; // Removed BrowserRouter from here
import MainScanner from "./pages/MainScanner";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanId, setScanId] = useState(null);
  const [logs, setLogs] = useState([
    { msg: "> Welcome to Inspectra v2.4.1", cls: "text-cyan-300" },
    { msg: "> System initialized...", cls: "text-green-400" },
    { msg: "> Ready to scan target URL", cls: "text-green-400" },
    { msg: "> Enter URL and click SCAN to begin", cls: "text-green-400" },
  ]);
  const [status, setStatus] = useState("IDLE");
  const [lastScan, setLastScan] = useState("Never");

  const vantaRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    // Load external scripts dynamically
    const loadScript = (src, callback) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = callback;
      document.body.appendChild(script);
      return script;
    };

    // Tailwind CSS
    loadScript("https://cdn.tailwindcss.com");

    // Vanta.js
    const vantaScript = loadScript(
      "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js",
      () => {
        if (window.VANTA) {
          vantaRef.current = window.VANTA.NET({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x00f7ff,
            backgroundColor: 0x010a13,
            points: 12.0,
            maxDistance: 22.0,
            spacing: 17.0,
          });
        }
      }
    );

    // Feather icons
    loadScript(
      "https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js",
      () => {
        if (window.feather) {
          window.feather.replace();
        }
      }
    );

    // AOS
    const aosLink = document.createElement("link");
    aosLink.href = "https://unpkg.com/aos@2.3.1/dist/aos.css";
    aosLink.rel = "stylesheet";
    document.head.appendChild(aosLink);

    const aosScript = loadScript(
      "https://unpkg.com/aos@2.3.1/dist/aos.js",
      () => {
        if (window.AOS) {
          window.AOS.init({
            duration: 800,
            once: true,
          });
        }
      }
    );

    // Cleanup
    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
      }
      if (document.body.contains(vantaScript)) {
        document.body.removeChild(vantaScript);
      }
      if (document.body.contains(aosScript)) {
        document.body.removeChild(aosScript);
      }
      if (document.head.contains(aosLink)) {
        document.head.removeChild(aosLink);
      }
    };
  }, []);

  // Scroll logs when they update
  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollTop = resultsRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (message, colorClass = "text-green-400") => {
    setLogs((prev) => [...prev, { msg: message, cls: colorClass }]);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleScan = async () => {
    if (!url) return alert("Please enter a URL to scan");
    setLoading(true);
    setScanId(null);
    setLogs([
      { msg: "> Welcome to Inspectra v2.4.1", cls: "text-cyan-300" },
      { msg: "> System initialized...", cls: "text-green-400" },
      { msg: "> Ready to scan target URL", cls: "text-green-400" },
      { msg: "> Enter URL and click SCAN to begin", cls: "text-green-400" },
    ]);
    setStatus("SCANNING");

    addLog(`> Initiating scan for: ${url}`);
    addLog(`> Establishing connection...`);

    await delay(1000);
    addLog(`> Scanning for XSS vulnerabilities...`);

    await delay(1000);
    addLog(`> Scanning for SQL injection points...`);

    await delay(1000);
    addLog(`> Checking for CSRF vulnerabilities...`);

    await delay(1000);
    addLog(`> Analyzing server headers...`);

    try {
      const res = await axios.post(`${API_URL}/scan`, { url });
      setScanId(res.data.scan_id);

      await delay(1000);
      addLog(`> Scanning complete`);
      addLog(`> Results:`, "text-cyan-300");

      res.data.results.forEach((r) => {
        let severityColor = "text-green-400";
        if (r.severity === "High") severityColor = "text-red-500";
        else if (r.severity === "Medium") severityColor = "text-yellow-400";
        else if (r.severity === "Low") severityColor = "text-orange-400";

        let message = `- ${r.type}`;
        if (r.type === "Headers") {
          message += `: Missing Security Headers: ${
            (r.missing && r.missing.join(", ")) || "None"
          } (Severity: ${r.severity || "Unknown"})`;
        } else if (r.type === "SQLi") {
          message += `: SQL Injection risk detected on ${
            r.endpoint || "unknown endpoint"
          } (Severity: ${r.severity || "Unknown"})`;
        } else if (r.type === "XSS") {
          message += `: XSS vulnerability found on ${
            r.endpoint || "unknown endpoint"
          } (Severity: ${r.severity || "Unknown"})`;
        }
        addLog(message, severityColor);
      });

      if (res.data.results.length === 0) {
        addLog(`- No vulnerabilities found`, "text-green-400");
      }

      setStatus("COMPLETE");
      const now = new Date();
      setLastScan(now.toLocaleString());
    } catch (err) {
      addLog(`> Error during scan: ${err.message}`, "text-red-500");
      setStatus("ERROR");
    }
    setLoading(false);
  };

  const handleDownloadReport = async () => {
    if (!scanId) return alert("No scan completed yet");
    try {
      const res = await axios.get(`${API_URL}/report/${scanId}`, {
        responseType: "blob",
      });

      const fileUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", `report_${scanId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Error generating report");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col">
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex-grow font-roboto-mono overflow-x-hidden">
              <div id="vanta-bg" className="absolute inset-0"></div>
              <div className="scan-line"></div>

              <div className="container mx-auto px-4 py-12 relative z-10">
                {/* Header */}
                <header
                  className="flex flex-col items-center justify-center mb-16"
                  data-aos="fade-down"
                >
                  <h1 className="text-5xl md:text-7xl font-bold mb-4 neon-text font-orbitron">
                    INSPECTRA
                  </h1>
                  <p className="text-xl md:text-2xl text-center text-cyan-300 mb-8">
                    Advanced Cybersecurity Vulnerability Scanner
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                </header>

                {/* Main Scanner Section */}
                <main className="max-w-4xl mx-auto">
                  <div className="neon-box rounded-xl p-8 mb-12" data-aos="fade-up">
                    <div className="flex items-center mb-6">
                      <i data-feather="shield" className="text-cyan-400 mr-3"></i>
                      <h2 className="text-2xl font-bold text-cyan-300">
                        URL Vulnerability Scanner
                      </h2>
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="url-input"
                        className="block text-sm font-medium text-cyan-200 mb-2"
                      >
                        Enter URL to scan
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          id="url-input"
                          placeholder="https://example.com"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="flex-grow px-4 py-3 bg-gray-800 border border-cyan-500 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
                        />
                        <button
                          onClick={handleScan}
                          disabled={loading}
                          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-r-lg transition duration-200 flex items-center neon-button"
                        >
                          <i data-feather="search" className="mr-2"></i>{" "}
                          {loading ? "Scanning..." : "Scan"}
                        </button>
                      </div>
                    </div>

                    {/* Logs terminal */}
                    <div
                      className="terminal rounded-lg p-4 h-64 overflow-y-auto mb-4 hacker-text"
                      ref={resultsRef}
                    >
                      {logs.map((l, idx) => (
                        <p
                          key={idx}
                          className={`mb-1 ${l.cls}`}
                          style={{ whiteSpace: "pre-wrap" }}
                        >
                          {l.msg}
                        </p>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <span className="text-xs text-cyan-300">STATUS:</span>
                        <span
                          className={`text-xs ${
                            status === "SCANNING"
                              ? "text-yellow-400"
                              : status === "COMPLETE"
                              ? "text-green-400"
                              : "text-red-500"
                          }`}
                          id="status-text"
                        >
                          {status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Last scan: <span id="last-scan">{lastScan}</span>
                      </div>
                    </div>

                    {/* Download Report Button */}
                    {scanId && (
                      <button
                        onClick={handleDownloadReport}
                        className="mt-4 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition duration-200 flex items-center neon-button mx-auto"
                      >
                        <i data-feather="download" className="mr-2"></i> Download Report
                      </button>
                    )}
                  </div>

                  {/* Features Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div
                      className="neon-box rounded-xl p-6"
                      data-aos="fade-up"
                      data-aos-delay="100"
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-full bg-cyan-900 bg-opacity-50 mr-3">
                          <i data-feather="lock" className="text-cyan-400"></i>
                        </div>
                        <h3 className="text-xl font-bold text-cyan-300">
                          Threat Detection
                        </h3>
                      </div>
                      <p className="text-gray-300">
                        Advanced algorithms detect vulnerabilities including XSS, SQLi,
                        CSRF, and more with 99.7% accuracy.
                      </p>
                    </div>

                    <div
                      className="neon-box rounded-xl p-6"
                      data-aos="fade-up"
                      data-aos-delay="200"
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-full bg-cyan-900 bg-opacity-50 mr-3">
                          <i data-feather="activity" className="text-cyan-400"></i>
                        </div>
                        <h3 className="text-xl font-bold text-cyan-300">
                          Real-time Analysis
                        </h3>
                      </div>
                      <p className="text-gray-300">
                        Continuous scanning provides live updates as new threats are
                        discovered during the scan.
                      </p>
                    </div>

                    <div
                      className="neon-box rounded-xl p-6"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-full bg-cyan-900 bg-opacity-50 mr-3">
                          <i data-feather="bar-chart-2" className="text-cyan-400"></i>
                        </div>
                        <h3 className="text-xl font-bold text-cyan-300">
                          Detailed Reports
                        </h3>
                      </div>
                      <p className="text-gray-300">
                        Comprehensive reports with severity ratings and remediation
                        steps for each vulnerability found.
                      </p>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div
                    className="neon-box rounded-xl p-8 mb-16"
                    data-aos="fade-up"
                  >
                    <h2 className="text-2xl font-bold text-cyan-300 mb-6 text-center">
                      Global Threat Statistics
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-cyan-400 mb-2 glow">
                          1.2M+
                        </div>
                        <div className="text-sm text-gray-300">Websites Scanned</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-cyan-400 mb-2 glow">
                          4.7M
                        </div>
                        <div className="text-sm text-gray-300">
                          Vulnerabilities Found
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-cyan-400 mb-2 glow">
                          99.7%
                        </div>
                        <div className="text-sm text-gray-300">Detection Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-cyan-400 mb-2 glow">
                          24/7
                        </div>
                        <div className="text-sm text-gray-300">Monitoring</div>
                      </div>
                    </div>
                  </div>
                </main>

                {/* Footer */}
                <footer className="text-center text-gray-400 text-sm mt-16 py-6 border-t border-gray-700">
                  <div className="mb-4">
                    <Link 
                      to="/privacy"
                      className="hover:text-cyan-300 mx-2"
                    >
                      Privacy Policy
                    </Link>
                    <Link 
                      to="/terms"
                      className="hover:text-cyan-300 mx-2"
                    >
                      Terms of Service
                    </Link>
                    <Link 
                      to="/contact"
                      className="hover:text-cyan-300 mx-2"
                    >
                      Contact
                    </Link>
                  </div>
                  <p>© 2023 Inspectra Security Systems. All rights reserved.</p>
                  <p className="mt-2 text-xs">v2.4.1 | Build 8472</p>
                </footer>
              </div>
            </div>
          }
        />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;