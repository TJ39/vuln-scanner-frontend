import React from "react";

function Privacy() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-8">
      <div className="max-w-3xl mx-auto neon-box rounded-xl p-8">
        <h1 className="text-4xl font-bold text-cyan-300 mb-6">Privacy Policy</h1>
        <p className="mb-4">
          We respect your privacy and are committed to protecting your personal data.
          This policy explains how we handle your information when using Inspectra.
        </p>
        <h2 className="text-2xl text-cyan-200 mt-6 mb-2">1. Data We Collect</h2>
        <p className="mb-4">
          We may collect non-sensitive usage data to improve our services. We do not
          sell or share your personal data with third parties.
        </p>
        <h2 className="text-2xl text-cyan-200 mt-6 mb-2">2. How We Use Data</h2>
        <p className="mb-4">
          Data is used solely for analysis, debugging, and service improvement.
        </p>
        <h2 className="text-2xl text-cyan-200 mt-6 mb-2">3. Security</h2>
        <p className="mb-4">
          We implement security measures to safeguard your data, but no system is
          100% secure.
        </p>
        <p className="mt-8 text-sm text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default Privacy;
